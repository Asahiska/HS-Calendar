import { Calendar, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import { dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { useEffect, useRef, useState } from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

dayjs.extend(timezone)

const localizer = dayjsLocalizer(dayjs)


export default function MyCalendar(input:any){

    const calendarEvents = input.calendarEvents;
    const selEvents = input.selectedEvents;
    const toast = input.toast;

    // The calendar otherwise defaults to today's real-world date, which is
    // usually irrelevant to a fixed semester schedule — Agenda view in
    // particular only looks 30 days ahead of the current date, so it can end
    // up completely empty. Jump once to the nearest actual event instead.
    const [date, setDate] = useState(new Date());
    const hasAutoNavigated = useRef(false);

    useEffect(() => {
        if (hasAutoNavigated.current || calendarEvents.length === 0) return;
        hasAutoNavigated.current = true;

        const now = new Date();
        const starts: Date[] = calendarEvents
            .map((e: any) => e.start as Date)
            .sort((a: Date, b: Date) => a.getTime() - b.getTime());
        const upcoming = starts.find((d) => d >= now);
        setDate(upcoming ?? starts[0]);
    }, [calendarEvents]);
    const CustomEvent = ({ event }:{event:any}) => (
        <div className="modern-event">
            <span className="modern-event-time">
                {dayjs(event.start).format("HH:mm")}&ndash;{dayjs(event.end).format("HH:mm")}
            </span>
            <span className="modern-event-title">{event.title}</span>
            {event.room && <span className="modern-event-room">{event.room}</span>}
        </div>
    );

    // Pastel rainbow palette (coolors.co/palette/ffadad-ffd6a5-fdffb6-caffbf-9bf6ff-a0c4ff-bdb2ff-ffc6ff),
    // each hue paired with a light tint background and a deeper readable text color.
    const eventColorPalette = [
        { dot: "#FFADAD", bg: "#FFEBEB", text: "#C23B3B" }, // pastel red
        { dot: "#FFD6A5", bg: "#FFF5E9", text: "#B5651D" }, // pastel orange
        { dot: "#FDFFB6", bg: "#FFFFED", text: "#8A7B0A" }, // pastel yellow
        { dot: "#CAFFBF", bg: "#F2FFEF", text: "#2F7D32" }, // pastel green
        { dot: "#9BF6FF", bg: "#E6FDFF", text: "#0E7C86" }, // pastel cyan
        { dot: "#A0C4FF", bg: "#E7F0FF", text: "#2D4A86" }, // pastel blue
        { dot: "#BDB2FF", bg: "#EFECFF", text: "#5B4FA6" }, // pastel purple
        { dot: "#FFC6FF", bg: "#FFF1FF", text: "#A83FA8" }, // pastel pink
    ];

    // Hash the title itself so a course's color is stable and doesn't depend on
    // the order it happened to be checked in (selection order was previously
    // used as the palette index, which skewed heavily toward whichever colors
    // land on courses selected first/most consistently).
    const hashTitle = (title: string): number => {
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
      }
      return hash;
    };

    // Funktion, um den Style basierend auf dem Event dynamisch zu generieren
    const eventPropGetter = (event: any): any => {
      // Wenn der Event-Title nicht in selEvents vorkommt, Standardfarbe verwenden
      if (selEvents.indexOf(event.title) === -1) {
        return { style: { backgroundColor: "rgba(255,255,255,0.18)", borderLeftColor: "rgba(255,255,255,0.7)", color: "#fff" } };
      }

      // Wähle die Farbe aus der Liste basierend auf dem Titel
      const color = eventColorPalette[hashTitle(event.title) % eventColorPalette.length];

      return {
        style: {
          backgroundColor: color.bg,
          borderLeftColor: color.dot,
          color: color.text,
        },
      };
    };

    const handleEventClick = (event:any) => {
        toast({
            title: event.title,
            description: event.description,
        }) // Speichere das angeklickte Event
    };
    

    return(
        <Card className="p-6 rounded-lg mx-6 mb-6 mt-2 w-full lg:w-3/4 bg-transparent border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-white">Event Preview</CardTitle>
            </CardHeader>
            <CardContent className={"w-full"}>
                <div>
                    <Calendar
                        className="modern-calendar"
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 750 }}
                        localizer={localizer}
                        eventPropGetter={(eventPropGetter)}
                        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                        defaultView={Views.MONTH}
                        date={date}
                        onNavigate={setDate}
                        formats={{
                            timeGutterFormat: 'HH:mm',
                          }}
                        min={new Date(2023, 0, 1, 6, 0, 0)} // Zeigt ab 6:00
                        max={new Date(2023, 0, 1, 21, 0, 0)} // Zeigt bis 21:00
                        onSelectEvent={handleEventClick}
                        components={{
                            event: CustomEvent, // Eigene Event-Darstellung
                        }}
                    />

                </div>
            </CardContent>
        </Card>
    )
}
