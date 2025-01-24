import {useState} from 'react';
import LoadEvents from "@/components/FilterComponents/LoadEvents.tsx";
import MyCalendar from "@/components/FilterComponents/Calendar.tsx";
import { useToast } from "@/hooks/use-toast";

export type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
};

const EventFilterPage = () => {
    const [icsLink, setIcsLink] = useState<string>(import.meta.env.VITE_EXAMPLE_URL);
    const [events, setEvents] = useState<string[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [filterLink, setFilterLink] = useState<string>('');


    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

    const { toast } = useToast()

    const all_states = {
        icsLink, setIcsLink,
        events, setEvents,
        selectedEvents, setSelectedEvents,
        filterLink, setFilterLink,
        setCalendarEvents
    }

    return (
        <div className="flex m-0 p-0 flex-col items-center justify-center bg-gray-100 w-screen min-h-screen">
            <LoadEvents states = {all_states}  toast={toast}/>
            <MyCalendar calendarEvents = {calendarEvents} selectedEvents = { selectedEvents } toast={toast}></MyCalendar>
        </div>
    );
};

export default EventFilterPage; 