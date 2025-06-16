import React, { useState, useEffect } from "react";
import "./Calender.css";

function Calender() {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const monthsOfYear = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentDate = new Date();

  const [calendar, setCalendar] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    selectedDate: currentDate.getDate(),
  });

  const [ui, setUI] = useState({
    showModal: false,
    showAllEvent: true,
    showEventPopup: false,
  });

  const [eventData, setEventData] = useState({
    title: '',
    text: '',
    time: { hours: '', minutes: '' },
    editingIndex: null,
  });

  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem("calendarEvents");
    return stored ? JSON.parse(stored) : [];
  });

  const daysInMonth = new Date(calendar.year, calendar.month + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendar.year, calendar.month, 1).getDay();

  const prevMonth = () => {
    setCalendar(prev => ({
      ...prev,
      month: prev.month === 0 ? 11 : prev.month - 1,
      year: prev.month === 0 ? prev.year - 1 : prev.year
    }));
  };

  const nextMonth = () => {
    setCalendar(prev => ({
      ...prev,
      month: prev.month === 11 ? 0 : prev.month + 1,
      year: prev.month === 11 ? prev.year + 1 : prev.year
    }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    let val = value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    setEventData(prev => ({
      ...prev,
      time: { ...prev.time, [name]: value }
    }));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(calendar.year, calendar.month, day);
    const today = new Date();
    if (clickedDate >= today || isSameday(clickedDate, today)) {
      setCalendar(prev => ({ ...prev, selectedDate: day }));
      setEventData({ title: '', text: '', time: { hours: '', minutes: '' }, editingIndex: null });
      setUI({ showModal: true, showAllEvent: false, showEventPopup: true });
    }
  };

  const handleEventSubmit = () => {
    if (!eventData.title.trim()) {
      alert("Event Title is required.");
      return;
    }

    const formattedDate = `${calendar.selectedDate}-${calendar.month + 1}-${calendar.year}`;
    const newEvent = {
      date: formattedDate,
      title: eventData.title,
      text: eventData.text,
      time: `${eventData.time.hours.padStart(2, "0")}:${eventData.time.minutes.padStart(2, "0")}`,
    };

    let updatedEvents;
    if (eventData.editingIndex !== null) {
      updatedEvents = [...events];
      updatedEvents.splice(eventData.editingIndex, 0, newEvent);
    } else {
      updatedEvents = [...events, newEvent];
    }

    setEvents(updatedEvents);
    setEventData({ title: '', text: '', time: { hours: '', minutes: '' }, editingIndex: null });
    setUI(prev => ({ ...prev, showEventPopup: false }));
  };

  const isSameday = (day1, day2) => {
    return (
      day1.getDate() === day2.getDate() &&
      day1.getMonth() === day2.getMonth() &&
      day1.getFullYear() === day2.getFullYear()
    );
  };

  const handleEditEvent = (index) => {
    const event = events[index];
    const [day, month, year] = event.date.split("-");
    setEventData({
      title: event.title,
      text: event.text,
      time: {
        hours: event.time.split(":")[0],
        minutes: event.time.split(":")[1],
      },
      editingIndex: index
    });
    setCalendar({ month: parseInt(month) - 1, year: parseInt(year), selectedDate: parseInt(day) });
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
    setUI(prev => ({ ...prev, showEventPopup: true }));
  };

  const handleDelete = (index) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  // Your existing return statement remains unchanged
  return (
    <div className="calender-app">
      <div className="calender">
        <h1 className="heading">Calendar</h1>
        <div className="navigate-date">
          <h2 className="month">{monthsOfYear[calendar.month]}</h2>
          <h2 className="year">{calendar.year}</h2>
          <div className="buttons">
            <i className="bx bx-chevron-left" onClick={prevMonth}></i>
            <i className="bx bx-chevron-right" onClick={nextMonth}></i>
          </div>
        </div>
        <div className="weekdays">
          {daysOfWeek.map((day, idx) => (
  <span key={idx} className={idx === 0 || idx === 6 ? "weekend" : ""}>{day}</span>
))}

        </div>
        <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={index} className="empty-day"></span>
          ))}
          {[...Array(daysInMonth).keys()].map((day) => {
            const date = new Date(calendar.year, calendar.month, day + 1);
            const isToday = isSameday(date, currentDate);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            return (
              <span
                key={day + 1}
                className={`${isToday ? "current-day" : ""} ${isWeekend ? "weekend-day" : ""}`.trim()}
                onClick={() => handleDateClick(day + 1)}
              >
                {day + 1}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calender;
