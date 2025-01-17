import React from 'react';

interface CalendarIframeProps {
    srcUrl: string;
}

const CalendarIframe = ({ srcUrl }) => {
    const url = import.meta.env.VITE_CALENDER_SERVICE_URL  + '/calendar.html?language=de&url=' + encodeURIComponent(srcUrl)
    return (
        <div>
            {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
            <iframe
                id="open-web-calendar"
                src={url}
                sandbox="allow-scripts allow-same-origin allow-top-navigation"
                height="600px"
                width="100%"
            ></iframe>
        </div>
    );
};

export default CalendarIframe; 