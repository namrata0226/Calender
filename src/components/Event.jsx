
const Event = ({ event, index, showDate = true, onEdit, onDelete }) => {
  
  return (
    <li className="event">
      <div className="event-date-wrapper">
        {showDate && <div className="event-date">{event.date}</div>}
        
        <div className="event-time">{event.time}</div>
      </div>
      <div className="event-text text">
        <div className="event-heading">{event.title}</div>
        <div className="description">{event.text}</div>
      </div>
      <div className="event-buttons">
        <i className="bx bxs-edit-alt" onClick={() => onEdit(index)}></i>
        <i className="bx bx-x" onClick={() => onDelete(index)}></i>
      </div>
    </li>
  );
};

export default Event;
