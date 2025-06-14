import React ,{useState, useEffect}from "react";
import "./Calender.css";
function Calender() {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const monthsOfYear = ["January","February","March","April","May","June","July","August","September","October", "November", "December",
  ];
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] =useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const[selectedDate, setSelectedDate] = useState(currentDate.getDate());
     const [showModal, setShowModal] = useState(false);
      const[showAllEvent,setShowAllEvent]=useState(true);
    const[showEventPopup, setShowEventPopup] = useState(false);
    const[events, setEvents] = useState(() => {
  const stored = localStorage.getItem("calendarEvents");
  return stored ? JSON.parse(stored) : [];});
    const[eventTime, setEventTime] = useState({hours: '', minutes: ''});
    const [eventTitle, setEventTitle] = useState("");
    const[eventText, setEventText] = useState("");
    const [editingEvent, setEditingEvent]=useState(null)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
 
    const prevMonth=()=>{
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
        setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
    }
    const nextMonth=()=>{
        setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
        setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
    }
    const handleTimeChange=(e)=>{
        const {name, value} =e.target

        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 2) val = val.slice(0, 2);
        setEventTime((prevTime)=>({...prevTime,[name]:value}))
  
    }
    const handleDateClick = (day) => {
      const clickedDate = new Date(currentYear, currentMonth, day);
      const today = new Date();
      if (clickedDate >= today || isSameday(clickedDate, today)) {
        setSelectedDate(day);
        setShowEventPopup(true);
        setShowModal(true);
        setEventText("");
        setEventTime({ hours: '', minutes: '' });
        setEditingEvent(null)
        setShowAllEvent(false)
      }
    };
    const handleEventSubmit = () => {
  if (!eventTitle.trim()) {
    alert("Event Title is required.");
    return;
  }

  const formattedDate = `${selectedDate}-${currentMonth + 1}-${currentYear}`;

  const newEvent = {
    date: formattedDate,
    title: eventTitle,
    text: eventText,
    time: `${eventTime.hours.padStart(2, "0")}:${eventTime.minutes.padStart(2, "0")}`,
  };

  let updatedEvents;

  if (editingEvent !== null) {
    updatedEvents = [...events];
    updatedEvents.splice(editingEvent, 0, newEvent);
  } else {
    updatedEvents = [...events, newEvent];
  }

  setEvents(updatedEvents);
  setEventTitle("");
  setEventText("");
  setEventTime({ hours: "", minutes: "" });
  setShowEventPopup(false);
  setEditingEvent(null);
};

   
    const isSameday=(day1, day2)=>{
      return (day1.getDate() === day2.getDate() &&
              day1.getMonth() === day2.getMonth() &&
              day1.getFullYear() === day2.getFullYear());
    }
   const handleEditEvent = (index) => {
  const event = events[index];
  const [day, month, year] = event.date.split("-");
  setEventTitle(event.title);
  setEventText(event.text);
  setEventTime({
    hours: event.time.split(":")[0],
    minutes: event.time.split(":")[1],
  });
  setSelectedDate(parseInt(day));
  setCurrentMonth(parseInt(month));
  setCurrentYear(parseInt(year));
  setEditingEvent(index);

  const updatedEvents = [...events];
  updatedEvents.splice(index, 1);
  setEvents(updatedEvents);
  setShowEventPopup(true);
};

    const handleDalete=(index)=>{
 const updatedEvents = [...events];
  updatedEvents.splice(index, 1);
  setEvents(updatedEvents);
    }
 useEffect(() => {
  localStorage.setItem("calendarEvents", JSON.stringify(events));
}, [events]);
  return (
    <>
      <div className="calender-app">
        <div className="calender">
          <h1 className="heading">Calender</h1>
          <div className="navigate-date">
            <h2 className="month">{monthsOfYear[currentMonth]}</h2>
            <h2 className="year">{currentYear}</h2>
            <div className="buttons">
              <i className="bx bx-chevron-left"onClick={prevMonth}></i>
              <i className="bx bx-chevron-right" onClick={nextMonth}></i>
            </div>
          </div>
          <div className="weekdays">
            {daysOfWeek.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={index} className="empty-day"></span> 
            ))}
                {[...Array(daysInMonth).keys()].map((day) => (
                <span key={day + 1} className={day + 1 === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() ? "current-day" : ""} onClick={() => handleDateClick(day + 1)}>
                    {day + 1}
                </span>
                ))}
          </div>
        </div>
        <div className="events">
            {showEventPopup && <div className="event-popup">
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
                onChange={(e) => {handleTimeChange(e);}}
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
                className="minutes"
                placeholder="00"
                value={eventTime.minutes}
                onChange={(e) => handleTimeChange(e)}
              />
            </div>
            <input className="event-title-input" type="text"value={eventTitle} name="event-title" placeholder="Enter Event Title" onChange={(e)=>setEventTitle(e.target.value)} required/>
            <textarea className="description"placeholder="Enter Event Text (Maximum 60 Characters)" value={eventText} onChange={(e) => {
                if(e.target.value.length<=60)
                    setEventText(e.target.value)
            } }></textarea>
            <button className="event-popup-btn" onClick={handleEventSubmit}>{editingEvent?"Update Event":"Add Event"}</button>
            <button className="close-event-popup">
              <i className="bx bx-x" onClick={() => setShowEventPopup(false)}></i>
            </button>
          </div>}
             {showModal && (
                <div className="modal-backdrop">
  
    <div className="modal-content">
      <h2>Events on {selectedDate}-{currentMonth + 1}-{currentYear}</h2>
      {events.filter(event => event.date === `${selectedDate}-${currentMonth + 1}-${currentYear}`).length ? (
        <ul >
          {events
            .filter(event => event.date === `${selectedDate}-${currentMonth + 1}-${currentYear}`)
            .map((event, idx) => (
              <li key={idx} className="event" >
              <div className="event-date-wrapper">  
   <div className="event-time">{event.time}</div>
     </div>
<div className="event-text">
                <div className=" event-heading">{event.title}</div>
                 <div className="description">{event.text}</div>
                </div>
              
              </li>
          ))}
        </ul>

      ) : (
        <p className="event no-event">No events for this day</p>
      )} 
        <i className='button bx bx-x' onClick={()=> { setShowModal(false);
            setShowAllEvent(true)}}></i>
   
    </div>
  
  </div>
)}
          {showAllEvent &&
          <div>
          
             {events.map((event,index)=>(

<div className="event" key={index}>
   
            <div className="event-date-wrapper">
              <div className="event-date">{event.date}</div>
              <div className="event-time">{event.time}</div>
            </div>
            <div className="event-text text">
                <div className="event-heading">{event.title}</div>
            <div className="description">{event.text}</div></div>
            
            <div className="event-buttons">
              <i className="bx bxs-edit-alt" onClick={()=>handleEditEvent(index)}></i>
              <i className="bx bx-x" onClick={()=>handleDalete(index)} ></i>
            </div>
          </div>
            ))}
            </div>
          }
       
          
        </div>
      </div>
    </>
  );
}

export default Calender;
