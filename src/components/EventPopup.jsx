// EventPopup.jsx
import React from "react";

const EventPopup = ({
  eventData,
  setEventData,
  handleTimeChange,
  handleEventSubmit,
  onClose
}) => {
  return (
    <div className="event-popup">
      <div className="time-input">
        <div className="event-popup-time">Time</div>
        <input
          type="number"
          name="hours"
          min={0}
          max={24}
          placeholder="00"
          className="hours"
          value={eventData.time.hours}
          onChange={handleTimeChange}
        />
        <input
          type="number"
          name="minutes"
          min={0}
          max={60}
          className="minutes"
          placeholder="00"
          value={eventData.time.minutes}
          onChange={handleTimeChange}
        />
      </div>

      <input
        className="event-title-input"
        type="text"
        name="event-title"
        placeholder="Enter Event Title"
        value={eventData.title}
        onChange={(e) =>
          setEventData((prev) => ({ ...prev, title: e.target.value }))
        }
        required
      />

      <textarea
        className="description"
        placeholder="Enter Event Text (Maximum 60 Characters)"
        value={eventData.text}
        onChange={(e) => {
          if (e.target.value.length <= 60) {
            setEventData((prev) => ({ ...prev, text: e.target.value }));
          }
        }}
      ></textarea>

      <button className="event-popup-btn" onClick={handleEventSubmit}>
        {eventData.editingEvent ? "Update Event" : "Add Event"}
      </button>

      <button className="close-event-popup" onClick={onClose}>
        <i className="bx bx-x"></i>
      </button>
    </div>
  );
};

export default EventPopup;