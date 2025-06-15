// src/components/Calendar/Calendar.jsx
import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalenderHeader";

import DaysGrid from "./DaysGrid";
import EventPopup from "./EventPopup";
import EventList from "./EventList";
import DayEvent from "./DayEvent";
import "./Calender.css";

function Calendar() {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [showModal, setShowModal] = useState(false);
  const [showAllEvent, setShowAllEvent] = useState(true);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem("calendarEvents");
    return stored ? JSON.parse(stored) : [];
  });

  const [eventTime, setEventTime] = useState({ hours: "", minutes: "" });
  const [eventTitle, setEventTitle] = useState("");
  const [eventText, setEventText] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
  };

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const handleDateClick = (day) => {
    const clicked = new Date(currentYear, currentMonth, day);
    const today = new Date();
    if (clicked >= today || isSameDay(clicked, today)) {
      setSelectedDate(day);
      setShowEventPopup(true);
      setShowModal(true);
      setEventText("");
      setEventTime({ hours: "", minutes: "" });
      setEditingEvent(null);
      setShowAllEvent(false);
    }
  };

  const handleEventSubmit = () => {
    if (!eventTitle.trim()) return alert("Event Title is required.");
    const formattedDate = `${selectedDate}-${currentMonth + 1}-${currentYear}`;
    const newEvent = {
      date: formattedDate,
      title: eventTitle,
      text: eventText,
      time: `${eventTime.hours.padStart(2, "0")}:${eventTime.minutes.padStart(
        2,
        "0"
      )}`,
    };

    const updated =
      editingEvent !== null
        ? [
            ...events.slice(0, editingEvent),
            newEvent,
            ...events.slice(editingEvent),
          ]
        : [...events, newEvent];

    setEvents(updated);
    setEventTitle("");
    setEventText("");
    setEventTime({ hours: "", minutes: "" });
    setShowEventPopup(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (index) => {
    const ev = events[index];
    const [day, month, year] = ev.date.split("-").map(Number);
    setEventTitle(ev.title);
    setEventText(ev.text);
    setEventTime({
      hours: ev.time.split(":")[0],
      minutes: ev.time.split(":")[1],
    });
    setSelectedDate(day);
    setCurrentMonth(month - 1);
    setCurrentYear(year);
    setEditingEvent(index);
    setEvents((prev) => prev.filter((_, i) => i !== index));
    setShowEventPopup(true);
  };

  const handleDeleteEvent = (index) => {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="calendar-app">
      <div className="calendar">
        <CalendarHeader
          month={monthsOfYear[currentMonth]}
          year={currentYear}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
        />

        <DaysGrid
          daysOfWeek={daysOfWeek}
          firstDayOfMonth={firstDayOfMonth}
          daysInMonth={daysInMonth}
          currentDate={currentDate}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onDateClick={handleDateClick}
        />
      </div>

      <div className="events">
        {showEventPopup && (
          <EventPopup
            eventTime={eventTime}
            eventTitle={eventTitle}
            eventText={eventText}
            setEventTime={setEventTime}
            setEventTitle={setEventTitle}
            setEventText={setEventText}
            onSubmit={handleEventSubmit}
            onClose={() => setShowEventPopup(false)}
            editing={editingEvent !== null}
          />
        )}

        {showModal && (
          <DayEvent
            date={`${selectedDate}-${currentMonth + 1}-${currentYear}`}
            events={events}
            onClose={() => {
              setShowModal(false);
              setShowAllEvent(true);
            }}
          />
        )}

        {showAllEvent && (
          <EventList
            events={events}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </div>
  );
}

export default Calendar;
