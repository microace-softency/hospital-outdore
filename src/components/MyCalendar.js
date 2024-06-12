import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setDate(now);
      setCurrentTime(formatTime(now));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const onChange = (newDate) => {
    setDate(newDate);
    setCurrentTime(formatTime(newDate));
  };

  function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  }

  return (
    <div>
      {/* <h2 style={{ display: 'flex', justifyContent: 'center' }}>My Calendar</h2> */}
      <div>
        <Calendar onChange={onChange} value={date} />
      </div>
      <h2 style={{ display: 'flex', justifyContent: 'center' }}>Time: {currentTime}</h2>
    </div>
  );
}

export default MyCalendar;
