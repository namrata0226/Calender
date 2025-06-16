import React ,{useState, useEffect}from "react";
import "./Calender.css";
function Calender() {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const monthsOfYear = ["January","February","March","April","May","June","July","August","September","October", "November", "December",
  ];
  const currentDate = new Date();
    const[events, setEvents] = useState(() => {
  const stored = localStorage.getItem("calendarEvents");
  return stored ? JSON.parse(stored) : [];});
const [calendar, setCalendar] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    selectedDate: currentDate.getDate(),
  });
   const daysInMonth = new Date(calendar.month, calendar.month + 1, 0).getDate();
    const firstDayOfMonth = new Date(calendar.year, calendar.month, 1).getDay();
 
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
    const prevMonth=()=>{
      setCalendar(prev => ({
      ...prev,
      month: prev.month === 0 ? 11 : prev.month - 1,
      year: prev.month === 0 ? prev.year - 1 : prev.year
    }));
  
     }
    const nextMonth=()=>{
         setCalendar(prev => ({
      ...prev,
      month: prev.month ===11 ? 0 : prev.month + 1,
      year: prev.month === 11 ? prev.year + 1 : prev.year
    }))}
    const handleTimeChange=(e)=>{
        const {name, value} =e.target

        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 2) val = val.slice(0, 2);
   setEventData(prev => ({
      ...prev,
      time: { ...prev.time, [name]: value }
    }));
    }
    const handleDateClick = (day) => {
      const clickedDate = new Date(calendar.year, calendar.month, day);
      const today = new Date();
      if (clickedDate >= today || isSameday(clickedDate, today)) {
        // setSelectedDate(day);
setCalendar((prev)=>({...prev, selectedDate:day}))
        setUI({ showModal: true, showAllEvent: false, showEventPopup: true });
         setEventData({ title: '', text: '', time: { hours: '', minutes: '' }, editingIndex: null });
       
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
    time: `${(eventData.time.hours || '00').padStart(2, "0")}:${(eventData.time.minutes || '00').padStart(2, "0")}`

  };

  let updatedEvents;

  if (eventData.editingEvent !== null) {
    updatedEvents = [...events];
    updatedEvents.splice(eventData.editingEvent, 0, newEvent);
  } else {
    updatedEvents = [...events, newEvent];
  }

  setEvents(updatedEvents);
 
  setEventData({ title: '', text: '', time: { hours: '', minutes: '' }, editingIndex: null });
  setUI({ showModal: true, showAllEvent: false, showEventPopup: false });
};

   
    const isSameday=(day1, day2)=>{
      return (day1.getDate() === day2.getDate() &&
              day1.getMonth() === day2.getMonth() &&
              day1.getFullYear() === day2.getFullYear());
    }
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
  // setSelectedDate(parseInt(day));
  setCalendar({selectedDate:parseInt(day),month:parseInt(month), year:parseInt(year)})

  const updatedEvents = [...events];
  updatedEvents.splice(index, 1);
  setEvents(updatedEvents);
  setUI((prev)=>({...prev,showEventPopup:true }))
  // setUI({ showModal: false, showAllEvent: true, showEventPopup: true });

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
            <h2 className="month">{monthsOfYear[calendar.month]}</h2>
            <h2 className="year">{calendar.year}</h2>
            <div className="buttons">
              <i className="bx bx-chevron-left"onClick={prevMonth}></i>
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
                <span key={day + 1} className={day + 1 === currentDate.getDate() && calendar.month === currentDate.getMonth() && calendar.year === currentDate.getFullYear() ? "current-day" : ""} onClick={() => handleDateClick(day + 1)}>
                    {day + 1}
                </span>
                ))}
          </div>
        </div>
        <div className="events">
            {ui.showEventPopup && <div className="event-popup">
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
                onChange={(e) => {handleTimeChange(e);}}

              />
              <input
                type="number"
                name="minutes"
                min={0}
                max={60}
                className="minutes"
                placeholder="00"
                value={eventData.time.minutes}
                onChange={(e) => handleTimeChange(e)}
              />
            </div>
            <input className="event-title-input" type="text"value={eventData.title} name="event-title" placeholder="Enter Event Title" onChange={(e)=>
              setEventData((prev)=>({...prev, title:e.target.value}))
            } required/>
            <textarea className="description"placeholder="Enter Event Text (Maximum 60 Characters)" value={eventData.text} onChange={(e) => {
                if(e.target.value.length<=60)
              setEventData((prev)=>({...prev, text:e.target.value}))
            } }></textarea>
            <button className="event-popup-btn" onClick={handleEventSubmit}>{eventData.editingEvent?"Update Event":"Add Event"}</button>
            <button className="close-event-popup">
              <i className="bx bx-x" onClick={() =>
               setUI(prev => ({ ...prev, showEventPopup: false }))
              }></i>
            </button>
          </div>}
             {ui.showModal && (
                <div className="modal-backdrop">
  
    <div className="modal-content">
      <h2>Events on {calendar.selectedDate}-{calendar.month + 1}-{calendar.year}</h2>
      {events.filter(event => event.date === `${calendar.selectedDate}-${calendar.month + 1}-${calendar.year}`).length ? (
        <ul >
          {events
            .filter(event => event.date === `${calendar.selectedDate}-${calendar.month + 1}-${calendar.year}`)
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
        <i className='button bx bx-x' onClick={()=>setUI({ showModal: false, showAllEvent: true, showEventPopup: false })}></i>
   
    </div>
  
  </div>
)}
          {ui.showAllEvent &&
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
