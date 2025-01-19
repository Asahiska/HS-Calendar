import {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LoadEvents from "@/components/FilterComponents/LoadEvents.tsx";
import MyCalendar from "@/components/FilterComponents/Calendar.tsx";


const EventFilterPage = () => {
    const [icsLink, setIcsLink] = useState<string>('');
    const [events, setEvents] = useState<string[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [filterLink, setFilterLink] = useState<string>('');

    const [calendarEvents, setCalendarEvents] = useState([]);

    const all_states = {
        icsLink, setIcsLink,
        events, setEvents,
        selectedEvents, setSelectedEvents,
        filterLink, setFilterLink,
        calendarEvents, setCalendarEvents
    }

    return (
        <div className="flex m-0 p-0 flex-col items-center justify-center bg-gray-100 w-screen min-h-screen">
            <LoadEvents states = {all_states}/>
            <MyCalendar states = {all_states}></MyCalendar>
        </div>
    );
};

export default EventFilterPage; 