import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import axios from "axios";
import ical from "ical.js";
import { ArrowDown, ArrowUp } from "lucide-react"
import {useEffect, useState} from "react";
import {compressUrlParam} from "@/components/Functions/urlBuilder.tsx";
import {CalendarEvent} from "@/components/EventFilterPage.tsx";
import EventSelector from "@/components/FilterComponents/EventSelector.tsx";
import {ICSLinkPopup} from "@/components/FilterComponents/LinkPopup.tsx";

const ICS_SERVICE = import.meta.env.VITE_ICS_SERVICE_URL

export default function LoadEvents ({states , toast}: {states:any, toast:any}) {

    const {
        icsLink, setIcsLink,
        events, setEvents,
        selectedEvents, setSelectedEvents,
        filterLink, setFilterLink,
        setCalendarEvents
    } = states



    const [calendarRawEvents, setCalendarRawEvents] = useState<CalendarEvent[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true)


    // Load saved events from localStorage on initial render
    useEffect(() => {
        const savedEvents = localStorage.getItem("selectedEvents");
        if (savedEvents) {
            handleLoadICS().then()
            setSelectedEvents(JSON.parse(savedEvents));
            setIsVisible(false)
            console.log("RESTORE SELECTED")
        }
        const l = localStorage.getItem("icsURL");
        if (l && l!=="") {
            setIcsLink(JSON.parse(l));
        }
    }, []);


    // Save selected events to localStorage
    const saveSelectedEvents = () => {
        localStorage.setItem("selectedEvents", JSON.stringify(selectedEvents));
        localStorage.setItem("icsURL", JSON.stringify(icsLink));
        toast({title:"Stored inside the Browser"});
    };

    const handleLoadICS = async () => {
        try {
            const proxyURL = `${ICS_SERVICE}filtered-calendar.ics/?icsUrl=${encodeURIComponent(await compressUrlParam(icsLink))}`;
            const response = await axios.get(proxyURL);
            const icsData = response.data;

            const jcalData = ical.parse(icsData);
            const comp = new ical.Component(jcalData);
            const events = comp.getAllSubcomponents('vevent');

            const calendarEvents = events.map(event => {
                const summary:string = event.getFirstPropertyValue('summary') as string;
                const startValue = event.getFirstPropertyValue('dtstart');
                const start: Date = startValue ? new Date(startValue.toString()) : new Date();
                const endValue = event.getFirstPropertyValue('dtend')
                const end:Date=  endValue ? new Date(endValue.toString()) : new Date();
                const isAllDay = false;
                const description:string = event.getFirstPropertyValue('description') as string; // Extrahiere die DESCRIPTION

                // Extrahiere die Studiengruppe aus der DESCRIPTION
                const studyGroupMatch = description.match(/Studiengruppe:\s*([^\n]+)/);
                const studyGroup = studyGroupMatch ? studyGroupMatch[1] : '';
                // Extrahiere die Studiengruppe aus der DESCRIPTION
                const roomGroupMatch = description.match(/Raum:\s*([^\n]+)/);
                const roomGroup = roomGroupMatch ? roomGroupMatch[1] : '';

                // Füge die Studiengruppe am Ende des Titels hinzu
                const title = studyGroup ? `${summary} (${studyGroup})` : summary;

                return {
                    title,  // Titel mit Studiengruppe
                    start,
                    end,
                    description: description,
                    room:roomGroup,
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

        } catch (error:any) {
            console.error('Error fetching ICS file:', error);
            if (error.isAxiosError && error.response) {
                const { status, data } = error.response;
                const errorMessage = `Server Error ${status}: ${data?.message || JSON.stringify(data)}`;
                toast({
                    variant: "destructive",
                    title: "Error fetching ICS file",
                    description: `${errorMessage}`,
                  })
            }else{
                toast({
                    variant: "destructive",
                    title: "Error fetching ICS file",
                    description: `ERROR: ${error.message}`,
                  })
            }
            
        }
    };

    useEffect(() => {
        const filteredEvents:CalendarEvent[] = calendarRawEvents.filter(event => selectedEvents.includes(event.title));
        setCalendarEvents(filteredEvents);
    }, [selectedEvents, calendarRawEvents]);

// Gzip-Komprimierung und Linkgenerierung
    const handleGenerateFilterLink = async () => {
        // Erstelle JSON-Payload
        // Ermitteln der nicht ausgewählten Events
        const unselectedEvents = events.filter(
            (event:any) => selectedEvents.some((selected:any) => selected === event)
        );
        const jsonPayload = JSON.stringify({ events: unselectedEvents });

        // Komprimieren des JSON-Payloads
        const compressedPayload = await compressUrlParam(jsonPayload, 'gzip');

        // Komprimieren des ICS-Links
        const compressedIcsLink = await compressUrlParam(icsLink, 'gzip');

        // Erstellen des neuen Filter-Links
        const newFilterLink = `${ICS_SERVICE}filtered-calendar.ics/?filter=${encodeURIComponent(compressedPayload)}&icsUrl=${encodeURIComponent(compressedIcsLink)}`;

        console.log(newFilterLink); // Gib den generierten Link aus

        // Setze den Filter-Link im Zustand
        setFilterLink(newFilterLink);
        setIsPopupOpen(true)
    };

    return (
        <>
            <div className={"flex flex-row justify-start rounded-lg mt-6 w-full lg:w-3/4"}>
            <Button className={"w-56 mt-5"} onClick={() => setIsVisible(!isVisible)}> {isVisible ? <ArrowUp/>: <ArrowDown/>} {isVisible ? "Hide Filter-Options" : "Show Filter-Options"}</Button>
            </div>
            {isVisible && (
                <Card className="p-6 shadow-lg rounded-lg m-6 w-full lg:w-3/4">
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
                                <EventSelector
                                    events={events}
                                    selectedEvents={selectedEvents}
                                    setSelectedEvents={setSelectedEvents}
                                />
                            </div>
                            <div className={"flex"}>
                            <Button onClick={handleGenerateFilterLink} className="w-full max-w-56 flex">
                                Generate Filter Link
                            </Button>

                                <Button variant="outline" className={"ml-3"} onClick={saveSelectedEvents}>
                                    Save Selection
                                </Button>

                            </div>

                            <ICSLinkPopup filterLink={filterLink} isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
                        </div>
                    </CardContent>
                </Card>
                )}
        </>
)
}

