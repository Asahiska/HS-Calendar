import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import ical from 'ical.js';
import CalendarIframe from "./CalenderIframe";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Copy } from 'lucide-react'

const EventFilterPage = () => {
    const ICS_SERVICE = import.meta.env.VITE_ICS_SERVICE_URL

    const [icsLink, setIcsLink] = useState<string>('');
    const [events, setEvents] = useState<string[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [filterLink, setFilterLink] = useState<string>('');
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const handleLoadICS = async () => {
        try {
            const proxyURL = `${ICS_SERVICE}filtered-calendar.ics/?icsUrl=${icsLink}`;
            const response = await axios.get(proxyURL);
            const icsData = response.data;
            console.log(response.data)

            const jcalData = ical.parse(icsData);
            const comp = new ical.Component(jcalData);
            const events = comp.getAllSubcomponents('vevent');

            // Extract event names and ensure uniqueness
            const eventNames = [...new Set(events.map(event => event.getFirstPropertyValue('summary')))]
                .sort((a, b) => a.localeCompare(b));

            // Update the state with the sorted event names
            setEvents(eventNames);
        } catch (error) {
            console.error('Error fetching ICS file:', error);
        }
    };

    const handleCheckboxChange = (eventName: string) => {
        setSelectedEvents(prev =>
            prev.includes(eventName)
                ? prev.filter(e => e !== eventName)
                : [...prev, eventName]
        );
    };

    const handleGenerateFilterLink = () => {
        const jsonPayload = JSON.stringify({ events: selectedEvents });
        const encodedPayload = encodeURIComponent(jsonPayload);
        const newFilterLink = `${ICS_SERVICE}filtered-calendar.ics/?filter=${encodedPayload}&icsUrl=${icsLink}`;
        console.log(newFilterLink)
        setFilterLink(newFilterLink);
    };

    const handleCopy = () => {
        navigator.clipboard
            .writeText(filterLink)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch((err) => console.error("Error copying:", err));
    };

    return (
        <div className="flex m-0 p-0 flex-col items-center justify-center bg-gray-100 w-screen h-screen">
            <Card className="p-6 shadow-lg rounded-lg w-1/2">
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
                <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                  <ul className="space-y-2">
                    {events.map((eventName, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`event-${index}`}
                          checked={selectedEvents.includes(eventName)}
                          onCheckedChange={() => handleCheckboxChange(eventName)}
                        />
                        <label
                          htmlFor={`event-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {eventName}
                        </label>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
  
              <Button onClick={handleGenerateFilterLink} className="w-full">
                Generate Filter Link
              </Button>
  
              {filterLink && (
                <Alert>
                  <CalendarIcon className="h-4 w-4" />
                  <AlertTitle>Filtered ICS Link</AlertTitle>
                  <AlertDescription>
                    <div className="flex items-center space-x-2">
                      <Link className="text-blue-500 hover:underline" href={filterLink} target="_blank" rel="noopener noreferrer">
                        Link To ICS file
                      </Link>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        {isCopied ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      You can use the Link above to insert the ICS file into your Calendar
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
  
        {filterLink && (
          <Card className="w-full max-w-2xl mx-auto mt-4">
            <CardHeader>
              <CardTitle>Calendar Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarIframe srcUrl={filterLink}></CalendarIframe>
            </CardContent>
          </Card>
        )}
        </div>
    );
};

export default EventFilterPage; 