import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
// and, for optional time zone support
import timezone from 'dayjs/plugin/timezone'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

dayjs.extend(timezone)

const localizer = dayjsLocalizer(dayjs)


export default function MyCalendar(states:any){

    const {
        icsLink, setIcsLink,
        events, setEvents,
        selectedEvents, setSelectedEvents,
        filterLink, setFilterLink,
        calendarEvents, setCalendarEvents
    } = states.states

    return(
        <Card className="p-6 shadow-lg rounded-lg m-6 w-3/4">
            <CardHeader>
                <CardTitle>Event Preview</CardTitle>
            </CardHeader>
            <CardContent className={"w-full"}>
                <div>
                    <Calendar
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        localizer={localizer}/>
                </div>
            </CardContent>
        </Card>
    )
}
