import React from 'react';

const CalendarIframe = ({ srcUrl }) => {
    const url = `${process.env.REACT_APP_CALENDAR_URL}${encodeURIComponent(srcUrl)}`;
    return (
        <>
        <div>
            {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
            <iframe id="open-web-calendar"
                    src={url}
                    sandbox="allow-scripts allow-same-origin allow-top-navigation"
                    height="600px" width="100%"></iframe>
        </div>
        </>)
};

export default CalendarIframe;
