import fs from "fs";
import path from "path";
import axios from "axios";
import ical from "ical.js";
import crypto from "crypto";
import { decompress } from "./functions.js";

const cache = {}; // Cache für ICS-Daten
const CACHE_DURATION = 10* 60 * 1000; // 24 Stunden
const STORAGE_PATH = "./data"; // Pfad zum Speichern der ICS-Datei (Docker-Volume)

export async function filterICSV2(req, res) {
    let { icsUrl, filter } = req.query;

    icsUrl = await decompress(icsUrl);
    filter = await decompress(filter);

    console.log("ICS-URL: ", icsUrl, " Filter: ", filter, "API_Version: 2");

    if (!icsUrl) {
        console.error("Invalid Args");
        res.status(500).send("Invalid URL-Args. Probably the arguments are not decompressable.");
        return;
    }

    const filename = crypto.createHash("md5").update(icsUrl).digest("hex") + ".ics";
    const filepath = path.join(STORAGE_PATH, filename);
    const currentTime = Date.now();

    let icsData;

    try {
        // Überprüfen, ob die gespeicherte Datei existiert und aktuell ist
        if (filename in cache) {
            const fileAge = currentTime - cache[filename].lastDownload;

            if (fileAge < CACHE_DURATION) {
                icsData = cache[filename].icsData
            } else {
                console.log("Stored ICS file is outdated. Downloading new file...");
                icsData = await downloadAndUpdateICS(icsUrl, filepath);
                cache[filename] = {
                    icsData: icsData,
                    lastDownload: currentTime
                };
            }
        } else {
            console.log("No stored ICS file found. Downloading new file...");
            icsData = await downloadAndUpdateICS(icsUrl, filepath);
            cache[filename] = {
                icsData: icsData,
                lastDownload: currentTime
            };
        }

        const last_sync = cache[filename].lastDownload
        //console.log("ROW ICS DATA")
        //console.log(icsData)

        // ICS-Daten parsen und filtern
        // Parse the ICS data and extract events
        const jcalData = ical.parse(icsData);
        const comp = new ical.Component(jcalData);
        const events = comp.getAllSubcomponents("vevent");

        let filterData = {};
        if (filter) {
            filterData = JSON.parse(decodeURIComponent(filter));
        }

        // Create a map to count occurrences of each summary
        const eventCountMap = new Map();

        // First pass: Count occurrences of each summary
        events.forEach(event => {
            const summary = event.getFirstPropertyValue("summary");
            eventCountMap.set(summary, (eventCountMap.get(summary) || 0) + 1);
        });
        //console.log(eventCountMap)

        // Create a map to track the index of each event
        const eventIndexMap = new Map();

        // Filter events and update their summaries
        const filteredEvents = events.filter(event => {
            const summary = event.getFirstPropertyValue("summary");
            const description = event.getFirstPropertyValue("description") || "";
            const studyGroupMatch = description.match(/Studiengruppe:\s*([^\n]+)/);
            const studyGroup = studyGroupMatch ? studyGroupMatch[1] : "";

            const title = studyGroup ? `${summary} (${studyGroup})` : summary;

            if (filterData["events"]?.includes(title)) {
                // Get the total count of events with the same summary
                const totalCount = eventCountMap.get(summary);
                // Get the current index for this event
                const currentIndex = (eventIndexMap.get(summary) || 0) + 1;
                eventIndexMap.set(summary, currentIndex);

                // Update the summary with the current index and total count
                const newSummary = `${summary} (${currentIndex}/${totalCount})`;
                event.updatePropertyWithValue("summary", newSummary);
                const newDescription = `${description || ""} \n\n Letzter Sync: ${new Date(last_sync).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`;
                event.updatePropertyWithValue("description", newDescription)

                return true;
            }
            return !filterData["events"]; // If no filter is present, include all events
        });
        //console.log("FILTERED_DATA")
        //console.log(filteredEvents)

        const newComp = new ical.Component(["vcalendar", [], []]);
        newComp.addPropertyWithValue('x-published-ttl', 'PT10M');
        const refreshProp = new ical.Property('refresh-interval');
        refreshProp.setParameter('VALUE', 'DURATION');
        refreshProp.setValue('PT10M');
        newComp.addProperty(refreshProp);
        filteredEvents.forEach(event => newComp.addSubcomponent(event));
        const newICSData = newComp.toString();

        res.setHeader("Content-Type", "text/calendar; charset=utf-8");
        res.send(newICSData);

    } catch (error) {
        console.error("Error processing ICS file:", error.message);
        res.status(500).send("Cannot load ICS file. Invalid filter or base URL.");
    }
}

// Hilfsfunktion: ICS-Datei herunterladen und speichern
async function downloadAndUpdateICS(icsUrl, filepath) {
    try {
        const response = await axios.get(icsUrl);

        if (response.status !== 200) {
            throw new Error(`Failed to download ICS file. HTTP status: ${response.status}`);
        }
        const newICSData = response.data;
        if (fs.existsSync(filepath)) {
            const oldICSData = fs.readFileSync(filepath, "utf-8");
            const mergedICSData = mergeICSFiles(oldICSData, newICSData);
            fs.writeFileSync(filepath, mergedICSData, "utf-8");
            return mergedICSData;
        } else {
            fs.writeFileSync(filepath, newICSData, "utf-8");
            return newICSData;
        }
    } catch (error) {
        throw new Error(`Error downloading or saving ICS file: ${error.message}`);
    }
}

// Hilfsfunktion: Events aus alter und neuer ICS-Datei zusammenführen
function mergeICSFiles(oldICSData, newICSData) {
    const oldComp = new ical.Component(ical.parse(oldICSData));
    const newComp = new ical.Component(ical.parse(newICSData));

    const oldEvents = oldComp.getAllSubcomponents("vevent");
    const newEvents = newComp.getAllSubcomponents("vevent");

    const mergedComp = new ical.Component(["vcalendar", [], []]);

    // Das älteste Datum ist das erste Element in newEvents
    const dtStart = newEvents[0].getFirstPropertyValue("dtstart");
    const oldestDate = dtStart ? new Date(dtStart.toString()) : new Date();


    // Füge alte Events hinzu, die vor dem jüngsten Datum liegen
    for (const event of oldEvents) {
        const dtStart = event.getFirstPropertyValue("dtstart");
        const eventDate = dtStart ? new Date(dtStart.toString()) : new Date();

        if (eventDate < oldestDate) {
            mergedComp.addSubcomponent(event);
        } else {
            break; // Stoppe die Schleife, wenn das erste Event gefunden wurde, das nicht passt
        }
    }

    // Füge alle neuen Events hinzu
    newEvents.forEach(event => mergedComp.addSubcomponent(event));

    return mergedComp.toString();
}
