import React, { useState } from "react";
import "./DatePicker.css";

const DatePicker = ({ days = 14 }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

  const generateDates = () => {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        key: date.toDateString(),
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "2-digit" }),
      };
    });
  };

  const dates = generateDates();

  return (
    <div className="d-flex overflow-auto gap-2 date-picker-container p-2">
      {dates.map(({ key, day, dateNum, month }) => (
        <div
          key={key}
          className={`text-center px-3 py-2 rounded border ${
            selectedDate === key
              ? "selected-date text-white bg-primary"
              : "bg-light"
          }`}
          onClick={() => setSelectedDate(key)}
          style={{ cursor: "pointer", minWidth: "60px" }}
        >
          <div className="small text-muted">{month}</div>
          <div className="fs-4 fw-bold">{String(dateNum).padStart(2, "0")}</div>
          <div className="small">{day}</div>
        </div>
      ))}
    </div>
  );
};

export default DatePicker;
