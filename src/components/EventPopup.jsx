import React from 'react';

const EventPopup = ({
  eventTitle,
  setEventTitle,
  eventText,
  setEventText,
  eventTime,
  setEventTime,
  onSubmit,
  onClose,
  editingEvent,
  handleTimeChange,
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
          value={eventTime.hours}
          onChange={handleTimeChange}
          onBlur={(e) => {
            const val = e.target.value.padStart(2, '0');
            setEventTime((prev) => ({ ...prev, hours: val }));
          }}
        />
        <input
          type="number"
          name="minutes"
          min={0}
          max={60}
          placeholder="00"
          className="minutes"
          value={eventTime.minutes}
          onChange={handleTimeChange}
        />
      </div>
      <input
        type="text"
        className="event-title-input"
        placeholder="Enter Event Title"
        value={eventTitle}
        onChange={(e) => setEventTitle(e.target.value)}
        required
      />
      <textarea
        className="description"
        placeholder="Enter Event Text (Maximum 60 Characters)"
        value={eventText}
        onChange={(e) => {
          if (e.target.value.length <= 60) setEventText(e.target.value);
        }}
      ></textarea>
      <button className="event-popup-btn" onClick={onSubmit}>
        {editingEvent !== null ? 'Update Event' : 'Add Event'}
      </button>
      <button className="close-event-popup" onClick={onClose}>
        <i className="bx bx-x"></i>
      </button>
    </div>
  );
};

export default EventPopup;