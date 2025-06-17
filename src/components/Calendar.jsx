import React, { useState, useEffect } from "react";
import Event from "./Event";
import "./Calendar.css";
import EventPopup from "./EventPopup";
import { isSameday ,daysOfWeek, monthsOfYear} from "../helper";
function Calendar() {

  const currentDate = new Date();
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem("calendarEvents");
    return stored ? JSON.parse(stored) : [];
  });
  const [calendar, setCalendar] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    selectedDate: currentDate.getDate(),
  });
 
  const [ui, setUI] = useState({
    showDayEvent: false,
    showEventPopup: false,
  });

  const [eventData, setEventData] = useState({
    title: "",
    text: "",
    time: { hours: "", minutes: "" },
    editingIndex: null,
  });

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);
 const daysInMonth = new Date(calendar.month, calendar.month + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendar.year, calendar.month, 1).getDay();

  const prevMonth = () => {
    setCalendar((prev) => ({
      ...prev,
      month: prev.month === 0 ? 11 : prev.month - 1,
      year: prev.month === 0 ? prev.year - 1 : prev.year,
    }));
      setUI({showEventPopup:false, showDayEvent:false})

  };
  const nextMonth = () => {
    setCalendar((prev) => ({
      ...prev,
      month: prev.month === 11 ? 0 : prev.month + 1,
      year: prev.month === 11 ? prev.year + 1 : prev.year,
    }));
      setUI({showEventPopup:false, showDayEvent:false})
  };
  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    setEventData((prev) => ({
      ...prev,
      time: { ...prev.time, [name]: value },
    }));
  };
  const handleDateClick = (day) => {
    const clickedDate = new Date(calendar.year, calendar.month, day);
    const today = new Date();
    if (clickedDate >= today || isSameday(clickedDate, today)) {
      setCalendar((prev) => ({ ...prev, selectedDate: day }));
      setUI({ showDayEvent: true, showEventPopup: true });
      setEventData({
        title: "",
        text: "",
        time: { hours: "", minutes: "" },
        editingIndex: null,
      });
    }
  };

  const handleEventSubmit = () => {
    if (!eventData.title.trim()) {
      alert("Event Title is required.");
      return;
    }

    const formattedDate = `${calendar.selectedDate}-${calendar.month + 1}-${
      calendar.year
    }`;
    const newEvent = {
      date: formattedDate,
      title: eventData.title,
      text: eventData.text,
      time: `${eventData.time.hours.padStart(
        2,
        "0"
      )}:${eventData.time.minutes.padStart(2, "0")}`,
    };

    const updatedEvents = [...events];

    if (eventData.editingIndex !== null) {
      updatedEvents[eventData.editingIndex] = newEvent;
    } else {
      updatedEvents.push(newEvent);
    }

    setEvents(updatedEvents);
    setEventData({
      title: "",
      text: "",
      time: { hours: "", minutes: "" },
      editingIndex: null,
    });
    setUI((prev) => ({ ...prev, showEventPopup: false }));
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
      editingIndex: index,
    });

    setCalendar({
      selectedDate: parseInt(day),
      month: parseInt(month) - 1,
      year: parseInt(year),
    });

    setUI((prev) => ({ ...prev, showEventPopup: true }));
  };

  const handleDalete = (index) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
    const remaining = updatedEvents.filter(
      (event) =>
        event.date ===
        `${calendar.selectedDate}-${calendar.month + 1}-${calendar.year}`
    );
    if (remaining.length === 0) {
      setUI({ showDayEvent: false, showEventPopup: false });
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.date ===
      `${calendar.selectedDate}-${calendar.month + 1}-${calendar.year}`
  );

  return (
    <>
      <div className="calendar-app">
        <div className="calendar">
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
            {daysOfWeek.map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
          <div className="days">
            {[...Array(firstDayOfMonth).keys()].map((_, index) => (
              <span key={index} className="empty-day"></span>
            ))}
            {[...Array(daysInMonth).keys()].map((day) => (
              <span
                key={day + 1}
                className={
                  day + 1 === currentDate.getDate() &&
                  calendar.month === currentDate.getMonth() &&
                  calendar.year === currentDate.getFullYear()
                    ? "current-day"
                    : ""
                }
                onClick={() => handleDateClick(day + 1)}
              >
                {day + 1}
              </span>
            ))}
          </div>
        </div>
        <div className="events">
          {ui.showEventPopup && (
            <EventPopup
              eventData={eventData}
              setEventData={setEventData}
              handleTimeChange={handleTimeChange}
              handleEventSubmit={handleEventSubmit}
              onClose={() =>
                setUI((prev) => ({ ...prev, showEventPopup: false }))
              }
            />
          )}
          {ui.showDayEvent ? (
            <div className="modal-backdrop">
              <div className="modal-content">
                <h2>
                  Events on {calendar.selectedDate}-{calendar.month + 1}-
                  {calendar.year}
                </h2>

                {filteredEvents.length > 0 ? (
                  <ul>
                    {filteredEvents.map((event) => {
                      const actualIndex = events.findIndex(
                        (e) =>
                          e.date === event.date &&
                          e.title === event.title &&
                          e.text === event.text &&
                          e.time === event.time
                      );
                      return (
                        <Event
                          key={actualIndex}
                          event={event}
                          index={actualIndex}
                          showDate={false}
                          onEdit={handleEditEvent}
                          onDelete={handleDalete}
                        />
                      );
                    })}
                  </ul>
                ) : (
                  <p className="event no-event">No events for this day</p>
                )}

                <i
                  className="button bx bx-x"
                  onClick={() =>
                    setUI({ showDayEvent: false, showEventPopup: false })
                  }
                ></i>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="event-text"> All Events </h2>
              {events.length!=0?events.map((event, index) => (
                <Event
                  key={index}
                  event={event}
                  index={index}
                  onEdit={handleEditEvent}
                  onDelete={handleDalete}
                />
              )): (
                  <p className="event no-event">No events</p>
                )
            }
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Calendar;
