import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {CalendarIcon, Copy} from "lucide-react";
import axios from "axios";
import ical from "ical.js";
import {useEffect, useState} from "react";
import {compressUrlParam} from "@/components/Functions/urlBuilder.tsx";

const ICS_SERVICE = import.meta.env.VITE_ICS_SERVICE_URL

interface eventFilter  {
    name: string,
    course: string,
}

export default function LoadEvents (states:any) {

    const {
        icsLink, setIcsLink,
        events, setEvents,
        selectedEvents, setSelectedEvents,
        filterLink, setFilterLink,
        calendarEvents, setCalendarEvents
    } = states.states



    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [calendarRawEvents, setCalendarRawEvents] = useState([]);


    const handleLoadICS = async () => {
        try {
            const proxyURL = `${ICS_SERVICE}filtered-calendar.ics/?icsUrl=${icsLink}`;
            const response = await axios.get(proxyURL);
            const icsData = response.data;

            const jcalData = ical.parse(icsData);
            const comp = new ical.Component(jcalData);
            const events = comp.getAllSubcomponents('vevent');

            const calendarEvents = events.map(event => {
                const summary:string = event.getFirstPropertyValue('summary') as string;
                const start = new Date(event.getFirstPropertyValue('dtstart'));
                const end = new Date(event.getFirstPropertyValue('dtend'));
                const isAllDay = false;
                const description:string = event.getFirstPropertyValue('description'); // Extrahiere die DESCRIPTION

                // Extrahiere die Studiengruppe aus der DESCRIPTION
                const studyGroupMatch = description.match(/Studiengruppe:\s*([^\n]+)/);
                const studyGroup = studyGroupMatch ? studyGroupMatch[1] : '';

                // Füge die Studiengruppe am Ende des Titels hinzu
                const title = studyGroup ? `${summary} (${studyGroup})` : summary;

                return {
                    title,  // Titel mit Studiengruppe
                    start,
                    end,
                    allDay: isAllDay,
                };
            });

            setCalendarEvents(calendarEvents);
            setCalendarRawEvents(calendarEvents);

            // Extract event names and ensure uniqueness
            const eventNames = [...new Set(calendarEvents.map(event => event.title))]
                .sort((a, b) => a.localeCompare(b));

            // Update the state with the sorted event names
            setEvents(eventNames);

        } catch (error) {
            console.error('Error fetching ICS file:', error);
        }
    };


    const handleCheckboxChange = (eventName: string) => {
        setSelectedEvents(prev =>
            prev.includes(eventName)
                ? prev.filter(e => e !== eventName)
                : [...prev, eventName]
        );

    };

    useEffect(() => {
        console.log(selectedEvents); // Hier wird der aktualisierte Wert angezeigt

        const filteredEvents = calendarRawEvents.filter(event => selectedEvents.includes(event.title));
        setCalendarEvents(filteredEvents);

        console.log(filteredEvents); // Hier wird die gefilterte Liste der Ereignisse angezeigt
    }, [selectedEvents]);

// Gzip-Komprimierung und Linkgenerierung
    const handleGenerateFilterLink = async () => {
        // Erstelle JSON-Payload
        const jsonPayload = JSON.stringify({ events: selectedEvents });

        // Komprimieren des JSON-Payloads
        const compressedPayload = await compressUrlParam(jsonPayload, 'gzip');

        // Komprimieren des ICS-Links
        const compressedIcsLink = await compressUrlParam(icsLink, 'gzip');

        // Erstellen des neuen Filter-Links
        const newFilterLink = `${ICS_SERVICE}filtered-calendar.ics/?filter=${encodeURIComponent(compressedPayload)}&icsUrl=${encodeURIComponent(compressedIcsLink)}`;

        console.log(newFilterLink); // Gib den generierten Link aus

        // Setze den Filter-Link im Zustand
        setFilterLink(newFilterLink);
    };

    const handleCopy = () => {
        navigator.clipboard
            .writeText(filterLink)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch((err) => console.error("Error copying:", err));
    };

    return(
        <Card className="p-6 shadow-lg rounded-lg m-6 w-3/4">
            <CardHeader>
                <CardTitle>Filter ICS Events</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Enter ICS file link"
                            value={icsLink}
                            onChange={(e) => setIcsLink(e.target.value)}
                        />
                        <Button onClick={handleLoadICS}>Load Events</Button>
                    </div>

                    <Separator />

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Select Events to Keep</h2>
                        <ScrollArea className="h-[350px] w-full border rounded-md p-4">
                            <ul className="space-y-2">
                                {events.map((eventName, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`event-${index}`}
                                            checked={selectedEvents.includes(eventName)}
                                            onCheckedChange={() => handleCheckboxChange(eventName)}
                                        />
                                        <label
                                            htmlFor={`event-${index}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {eventName}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </div>

                    <Button onClick={handleGenerateFilterLink} className="w-full max-w-64">
                        Generate Filter Link
                    </Button>

                    {filterLink && (
                        <Alert>
                            <CalendarIcon className="h-4 w-4" />
                            <AlertTitle>Filtered ICS Link</AlertTitle>
                            <AlertDescription>
                                <div className="flex items-center space-x-2">
                                    <a className="text-blue-500 hover:underline" href={filterLink} target="_blank" rel="noopener noreferrer">
                                        Link To ICS-File
                                    </a>
                                    <Button variant="outline" size="sm" onClick={handleCopy}>
                                        {isCopied ? "Copied!" : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    You can use the Link above to insert the ICS file into your Calendar
                                </p>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

