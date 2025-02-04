import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {Search} from "lucide-react";
import { Button } from "../ui/button"
export default function EventSelector({ events, selectedEvents, setSelectedEvents }:{events:[string], selectedEvents:[string], setSelectedEvents: any}) {
    const [searchQuery, setSearchQuery] = useState("")

    const handleCheckboxChange = (eventName: string) => {
        setSelectedEvents((prev: string[]) =>
            prev.includes(eventName) ? prev.filter((e) => e !== eventName) : [...prev, eventName],
        )
    }

    const filteredEvents = events.filter((eventName) => eventName.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="space-y-4">

            <div className="relative flex">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    id="search"
                    type="text"
                    placeholder="Suche nach Events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8  max-w-56"
                />
                <Button className="ml-3" variant="outline" onClick={() => {setSearchQuery(""); setSelectedEvents([])}}>Clear Filter</Button>
            </div>
            <ScrollArea className="h-[350px] w-full border rounded-md p-4">
                <ul className="space-y-2">
                    {filteredEvents.map((eventName: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                            <Checkbox
                                id={`event-${index}`}
                                checked={selectedEvents.includes(eventName)}
                                onCheckedChange={() => handleCheckboxChange(eventName)}
                            />
                            <label
                                htmlFor={`event-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left"
                            >
                                {eventName}
                            </label>
                        </li>
                    ))}
                </ul>
            </ScrollArea>
        </div>
    )
}

