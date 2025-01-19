import {useState} from 'react';
import LoadEvents from "@/components/FilterComponents/LoadEvents.tsx";
import MyCalendar from "@/components/FilterComponents/Calendar.tsx";

export type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
};

const EventFilterPage = () => {
    const [icsLink, setIcsLink] = useState<string>('');
    const [events, setEvents] = useState<string[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [filterLink, setFilterLink] = useState<string>('');

    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

    const all_states = {
        icsLink, setIcsLink,
        events, setEvents,
        selectedEvents, setSelectedEvents,
        filterLink, setFilterLink,
        setCalendarEvents
    }

    return (
        <div className="flex m-0 p-0 flex-col items-center justify-center bg-gray-100 w-screen min-h-screen">
            <LoadEvents states = {all_states}/>
            <MyCalendar calendarEvents = {calendarEvents}></MyCalendar>
        </div>
    );
};

export default EventFilterPage; 