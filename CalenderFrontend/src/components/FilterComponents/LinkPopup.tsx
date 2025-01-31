"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
interface ICSLinkPopupProps {
    filterLink: string
    isOpen: boolean
    onClose: () => void
}

export function ICSLinkPopup({ filterLink, isOpen, onClose }: ICSLinkPopupProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [experimentalAPI, setExperimentalAPI] = useState(true);
    const [link, setLink] = useState(filterLink)

    const handleCopy = () => {
        navigator.clipboard.writeText(link)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    useEffect(() => {
        let urladdon = "";
        if(experimentalAPI){
            urladdon="&version=2"
        }
        setLink(`${filterLink}${urladdon}`)
    }, [filterLink, experimentalAPI]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-blue-500" />
                        <span>Filtered ICS Link</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
                        <input
                            type="text"
                            value={link}
                            readOnly
                            className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none"
                        />
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                            {isCopied ? "Copied!" : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
                    >
                        Open ICS File
                    </a>
                    <p className="text-sm text-gray-500">
                        You can use this link to insert the ICS file into your calendar application.
                    </p>
                    <div className="flex">
                        <Checkbox
                                id={`1`}
                                checked={experimentalAPI}
                                onCheckedChange={() => {setExperimentalAPI(!experimentalAPI)} }
                            />
                            <label
                                htmlFor={`1`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left ml-2"
                            >
                                Experimental API
                            </label>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}


