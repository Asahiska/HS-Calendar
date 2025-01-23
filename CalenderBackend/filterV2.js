import fs from "fs";
import path from "path";
import axios from "axios";
import ical from "ical.js";
import crypto from "crypto";
import { decompress } from "./functions.js";

const cache = {}; // Cache für ICS-Daten
const CACHE_DURATION = 20 * 1000; // 24 Stunden
const STORAGE_PATH = "./data"; // Pfad zum Speichern der ICS-Datei (Docker-Volume)

export async function filterICSV2(req, res) {
    let { icsUrl, filter } = req.query;

    icsUrl = await decompress(icsUrl);
    filter = await decompress(filter);

    console.log("ICS-URL: ", icsUrl, " Filter: ", filter);

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
        if (fs.existsSync(filepath)) {
            const fileStats = fs.statSync(filepath);
            const fileAge = currentTime - fileStats.mtimeMs;

            if (fileAge < CACHE_DURATION) {
                console.log("Using stored ICS file.");
                icsData = fs.readFileSync(filepath, "utf-8");
            } else {
                console.log("Stored ICS file is outdated. Downloading new file...");
                icsData = await downloadAndUpdateICS(icsUrl, filepath);
            }
        } else {
            console.log("No stored ICS file found. Downloading new file...");
            icsData = await downloadAndUpdateICS(icsUrl, filepath);
        }

        // ICS-Daten parsen und filtern
        const jcalData = ical.parse(icsData);
        const comp = new ical.Component(jcalData);
        const events = comp.getAllSubcomponents("vevent");

        let filterData = {};
        if (filter) {
            filterData = JSON.parse(decodeURIComponent(filter));
        }

        let counter = 1;
        const filteredEvents = events.filter(event => {
            const summary = event.getFirstPropertyValue("summary");
            const description = event.getFirstPropertyValue("description") || "";
            const studyGroupMatch = description.match(/Studiengruppe:\s*([^\n]+)/);
            const studyGroup = studyGroupMatch ? studyGroupMatch[1] : "";

            const title = studyGroup ? `${summary} (${studyGroup})` : summary;

            if (filterData["events"]?.includes(title)) {
                const newDescription = `${description}\nCounter: ${counter}`;
                event.updatePropertyWithValue("description", newDescription);
                counter++;
                return true;
            }
            return !filterData["events"]; // Wenn kein Filter vorhanden, alle Events einschließen
        });

        const newComp = new ical.Component(["vcalendar", [], []]);
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
        console.log("TRY LOAD ICS FROM STORAGE")
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

    console.log("merge ICS FIles")
    const oldEvents = oldComp.getAllSubcomponents("vevent");
    const newEvents = newComp.getAllSubcomponents("vevent");

    const mergedComp = new ical.Component(["vcalendar", [], []]);

    // Füge alle neuen Events hinzu
    newEvents.forEach(event => mergedComp.addSubcomponent(event));

    // Finde das jüngste Datum in den neuen Events
    const newestDate = newEvents.reduce((latest, event) => {
        const dtStart = event.getFirstPropertyValue("");
        const eventDate = dtStart && new Date(dtStart.toString());
        return eventDate > latest ? eventDate : latest;
    }, new Date(0)); // Start mit der ältesten Zeit

    // Füge alte Events hinzu, die vor dem jüngsten Datum liegen
    oldEvents.forEach(event => {
        const dtStart = event.getFirstPropertyValue("dtstart");
        const eventDate = dtStart && new Date(dtStart.toString());

        if (eventDate < newestDate) {
            mergedComp.addSubcomponent(event);
        }
    });

    return mergedComp.toString();
}
