import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Now you can use this component with different numbers of rows and columns by passing numRows and numCols as props:
//{/* <CalendarGrid numRows={5} numCols={7} /> */}

const CalendarGrid = ({ numRows, numCols }) => {
  const weeks = Array.from({ length: numRows }, (_, weekIndex) =>
    Array.from({ length: numCols }, (_, dayIndex) => weekIndex * numCols + dayIndex + 1)
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Calendar</h2>
      <div className="row">
        {[...Array(numCols).keys()].map((day, index) => (
          <div key={index} className="col text-center font-weight-bold">
            {`Day ${day + 1}`}
          </div>
        ))}
      </div>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="row mt-2">
          {week.map((day, dayIndex) => (
            <div key={dayIndex} className="col text-center border">
              {day}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
