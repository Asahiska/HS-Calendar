import {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import LoadEvents from "@/components/FilterComponents/LoadEvents.tsx";
import MyCalendar from "@/components/FilterComponents/Calendar.tsx";
import { useToast } from "@/hooks/use-toast";
import { SKED_BASE } from "@/components/Functions/programData";

export type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
};

// Course codes lead with a 2-digit year (e.g. "24BTS-EAT"). Force the chosen
// Year onto every code, same as semester is appended onto every code, so
// setting Year after picking courses always wins rather than being ignored.
function applyYearOverride(code: string, year: string): string {
    const y = year.trim();
    if (!y || !/^\d{2}/.test(code)) return code;
    const twoDigit = y.length >= 4 ? y.slice(-2) : y.padStart(2, "0");
    return twoDigit + code.slice(2);
}

// Rebuilds the ICS links selected on the previous page from the URL itself
// (?courses=code1,code2&sem=5&year=23), so a bookmarked/shared link
// reproduces the same calendar without depending on router navigation state.
function icsLinksFromSearchParams(searchParams: URLSearchParams): string[] {
    const courses = searchParams.get("courses");
    if (!courses) return [];
    const sem = searchParams.get("sem")?.trim();
    const year = searchParams.get("year") ?? "";
    return courses
        .split(",")
        .map((code) => code.trim())
        .filter(Boolean)
        .map((code) => applyYearOverride(code, year))
        .map((code) => `${SKED_BASE}${code}${sem ? `-${sem}` : ""}.ics`);
}

const EventFilterPage = () => {
    const [searchParams] = useSearchParams();
    const initialIcsLinks = icsLinksFromSearchParams(searchParams);
    const [icsLinks, setIcsLinks] = useState<string[]>(
        initialIcsLinks.length > 0 ? initialIcsLinks : [import.meta.env.VITE_EXAMPLE_URL]
    );
    const [events, setEvents] = useState<string[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [filterLink, setFilterLink] = useState<string>('');


    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

    const { toast } = useToast()

    const all_states = {
        icsLinks, setIcsLinks,
        events, setEvents,
        selectedEvents, setSelectedEvents,
        filterLink, setFilterLink,
        setCalendarEvents
    }

    return (
        <div className="relative flex m-0 p-0 flex-col items-center justify-center bg-page w-screen min-h-screen">
            <LoadEvents states = {all_states}  toast={toast}/>
            <MyCalendar calendarEvents = {calendarEvents} selectedEvents = { selectedEvents } toast={toast}></MyCalendar>
        </div>
    );
};

export default EventFilterPage; 