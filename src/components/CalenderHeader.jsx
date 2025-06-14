import React from 'react';

const CalendarHeader = ({ month, year, onPrev, onNext }) => {
  return (
    <div className="navigate-date">
      <h2 className="month">{month}</h2>
      <h2 className="year">{year}</h2>
      <div className="buttons">
        <i className="bx bx-chevron-left" onClick={onPrev}></i>
        <i className="bx bx-chevron-right" onClick={onNext}></i>
      </div>
    </div>
  );
};

export default CalendarHeader;