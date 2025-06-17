 export const isSameday=(day1, day2)=>{
      return (day1.getDate() === day2.getDate() &&
              day1.getMonth() === day2.getMonth() &&
              day1.getFullYear() === day2.getFullYear());
    }
 export const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
 export  const monthsOfYear = [ "January", "February", "March","April", "May", "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];