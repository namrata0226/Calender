const DayEvent = ({ selectedDate, currentMonth, currentYear, events, onClose }) => {
  const formattedDate = `${selectedDate}-${currentMonth + 1}-${currentYear}`;
  const dayEvents = events.filter((e) => e.date === formattedDate);

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Events on {formattedDate}</h2>
        {dayEvents.length ? (
          <ul>
            {dayEvents.map((event, idx) => (
              <li key={idx} className="event">
                <div className="event-date-wrapper">
                  <div className="event-time">{event.time}</div>
                </div>
                <div className="event-text">
                  <div className="event-heading">{event.title}</div>
                  <div className="description">{event.text}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="event no-event">No events for this day</p>
        )}
        <i className="button bx bx-x" onClick={onClose}></i>
      </div>
    </div>
  );
};

export default DayEvent;
