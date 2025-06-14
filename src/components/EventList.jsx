import React from 'react';

const EventList = ({ events, handleEdit, handleDelete }) => {
  return (
    <div>
      {events.map((event, index) => (
        <div className="event" key={index}>
          <div className="event-date-wrapper">
            <div className="event-date">{event.date}</div>
            <div className="event-time">{event.time}</div>
          </div>
          <div className="event-text text">
            <div className="event-heading">{event.title}</div>
            <div className="description">{event.text}</div>
          </div>
          <div className="event-buttons">
            <i className="bx bxs-edit-alt" onClick={() => handleEdit(index)}></i>
            <i className="bx bx-x" onClick={() => handleDelete(index)}></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;