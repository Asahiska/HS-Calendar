import { Calendar } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

dayjs.extend(timezone)

const localizer = dayjsLocalizer(dayjs)


export default function MyCalendar(input:any){

    const calendarEvents = input.calendarEvents;
    const selEvents = input.selectedEvents;
    const toast = input.toast;
    const CustomEvent = ({ event }:{event:any}) => (
        <div>
            <strong>{event.title}</strong>
            <div style={{ fontSize: "0.8em"}}>{event.room}</div>
        </div>
    );
    
    // Liste von bis zu 15 Farben, die zu ShadCN passen
    const shadcnColors = [
      "#f44336",
      "#e81e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#9e9e9e",
      "#9e9e9e",
    ];
    
    // Funktion, um den Style basierend auf dem Event dynamisch zu generieren
    const eventPropGetter = (event: any): any => {
      // Suche den Index des Events in der selEvents-Liste
      const eventIndex = selEvents.indexOf(event.title);
    
      // Wenn der Event-Title nicht in selEvents vorkommt, Standardfarbe verwenden
      if (eventIndex === -1) {
        return { style: { backgroundColor: "bg-gray-300" } };
      }
    
      // Wähle die Farbe aus der Liste und gehe zyklisch durch die Farben
      const colorClass = shadcnColors[eventIndex % shadcnColors.length];
    
      // Verwende die ShadCN-Klasse für die Hintergrundfarbe
      return  { style: { backgroundColor: colorClass } };
    };

    const handleEventClick = (event:any) => {
        toast({
            title: event.title,
            description: event.description,
        }) // Speichere das angeklickte Event
    };
    

    return(
        <Card className="p-6 shadow-lg rounded-lg m-6 w-full lg:w-3/4">
            <CardHeader>
                <CardTitle>Event Preview</CardTitle>
            </CardHeader>
            <CardContent className={"w-full"}>
                <div>
                    <Calendar
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 750 }}
                        localizer={localizer}
                        eventPropGetter={(eventPropGetter)}
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
