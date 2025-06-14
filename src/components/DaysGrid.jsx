import React from 'react';

const DaysGrid = ({ firstDayOfMonth, daysInMonth, currentDate, currentMonth, currentYear, onDateClick }) => {
  return (
    <div className="days">
      {[...Array(firstDayOfMonth).keys()].map((_, index) => (
        <span key={index} className="empty-day"></span>
      ))}
      {[...Array(daysInMonth).keys()].map((day) => (
        <span
          key={day + 1}
          className={
            day + 1 === currentDate.getDate() &&
            currentMonth === currentDate.getMonth() &&
            currentYear === currentDate.getFullYear()
              ? "current-day"
              : ""
          }
          onClick={() => onDateClick(day + 1)}
        >
          {day + 1}
        </span>
      ))}
    </div>
  );
};

export default DaysGrid;