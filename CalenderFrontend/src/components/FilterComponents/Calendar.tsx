import { Calendar } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

dayjs.extend(timezone)

const localizer = dayjsLocalizer(dayjs)


export default function MyCalendar(input:any){
    return(
        <Card className="p-6 shadow-lg rounded-lg m-6 w-3/4">
            <CardHeader>
                <CardTitle>Event Preview</CardTitle>
            </CardHeader>
            <CardContent className={"w-full"}>
                <div>
                    <Calendar
                        events={input.calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        localizer={localizer}/>
                </div>
            </CardContent>
        </Card>
    )
}
