import React, { useState } from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Calendar.css";
import leftArrow from "../../assets/img/left-arrow.png";
import rightArrow from "../../assets/img/right-arrow.png";
import HeaderNav from "../../components/Header/HeaderNav";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(previousMonth);
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setCurrentDate(nextMonth);
  };

  // 날짜 클릭 시 페이지 라우팅 (/calendar/해당날짜)
  const handleDateClick = (year, month, day) => {
    const formattedDate = `${year}${month.toString().padStart(2, "0")}${day
      .toString()
      .padStart(2, "0")}`;
    navigate(`/calendar/${formattedDate}`);
  };

  // 현재 월의 일 수를 계산하는 함수
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 현재 월의 캘린더 데이터 생성
  const generateCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const calendarData = [];

    // 이전 달의 날짜
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      calendarData.push({
        year: day.getFullYear(),
        month: day.getMonth() + 1,
        day: day.getDate(),
        isCurrentMonth: false,
      });
    }

    // 현재 달의 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      calendarData.push({
        year: day.getFullYear(),
        month: day.getMonth() + 1,
        day: day.getDate(),
        isCurrentMonth: true,
      });
    }

    return calendarData;
  };

  const calendarData = generateCalendarData();
  const monthYearLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <HeaderNav />
      <div className="main">
        <div className="common-inner main-content">
          <div className="month-container">
            <div className="calendar-header">
              <button onClick={goToPreviousMonth} className="btn-left">
                <img
                  className="arrow-img"
                  src={leftArrow}
                  alt="왼쪽 화살표 버튼"
                />
              </button>
              <span>{monthYearLabel}</span>
              <button onClick={goToNextMonth} className="btn-right">
                <img
                  className="arrow-img"
                  src={rightArrow}
                  alt="오른쪽 화살표 버튼"
                />
              </button>
            </div>
            <div className="calendar">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div className="calendar-day-label" key={day}>
                  {day}
                </div>
              ))}
              {calendarData.map((item, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    item.isCurrentMonth ? "current-month" : "other-month"
                  }`}
                  onClick={() =>
                    handleDateClick(item.year, item.month, item.day)
                  }
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
