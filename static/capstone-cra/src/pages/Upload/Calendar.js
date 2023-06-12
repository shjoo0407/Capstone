import React, { useState, useEffect } from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Calendar.css";
import leftArrow from "../../assets/img/left-arrow.png";
import rightArrow from "../../assets/img/right-arrow.png";
import spoon from "../../assets/img/spoon.png";
import HeaderNav from "../../components/Header/HeaderNav";
import LoginHeaderNav from "../../components/Header/LoginHeaderNav";

import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();
  const API_URL = "/api/main/upload/";

  const jsonLocalStorage = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
      return JSON.parse(localStorage.getItem(key));
    },
  };

  const username = jsonLocalStorage.getItem("username"); // 사용자 이름
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
  const [data, setData] = useState(null); // 날짜별 총 칼로리 (GET)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsonLocalStorage.getItem("token");
        // 토큰 유무 확인
        if (!token) {
          throw new Error("토큰이 없습니다.");
        }

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const responseJson = await response.json();
          setData(responseJson);
        } else {
          throw new Error("GET 요청에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // 이전 달로 이동하기
  const goToPreviousMonth = () => {
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(previousMonth);
  };

  // 다음 달로 이동하기
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
  const generateCalendarData = (data) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 요일 반환

    const calendarData = []; // 캘린더 데이터
    const result = {}; // 받은 data를 기반으로 일별 총 칼로리를 object 형태로 저장

    console.log("GET해서 받아온 일별 총 칼로리입니다: ", data); // get해서 받은 data 출력

    data.forEach((item) => {
      result[item.date] = item.total_calories;
    });
    console.log("생성된 object입니다:", result);

    // formatted date: 00000000
    const getFormattedDate = (year, month, day) => {
      const formattedDate = `${year}${month.toString().padStart(2, "0")}${day
        .toString()
        .padStart(2, "0")}`;
      return formattedDate;
    };

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
      const formattedDay = getFormattedDate(
        day.getFullYear(),
        day.getMonth() + 1,
        day.getDate()
      );
      // result에 key가 있으면, kcal을 calendarData에 저장
      if (result.hasOwnProperty(formattedDay)) {
        calendarData.push({
          year: day.getFullYear(),
          month: day.getMonth() + 1,
          day: day.getDate(),
          isCurrentMonth: true,
          kcal: result[formattedDay],
        });
      } else {
        calendarData.push({
          year: day.getFullYear(),
          month: day.getMonth() + 1,
          day: day.getDate(),
          isCurrentMonth: true,
        });
      }
    }

    return calendarData;
  };

  // useEffect에서 api를 호출중일 때를 위해
  if (!data) {
    return null;
  }

  const calendarData = generateCalendarData(data);
  const monthYearLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {username && <LoginHeaderNav username={username} />}
      {!username && <HeaderNav />}
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
                  <div>{item.day}</div>
                  {item.kcal !== undefined && (
                    <div className="calendar-kcal">
                      <img
                        className="spoon-img"
                        src={spoon}
                        alt="숟가락과 포크 이미지"
                      />
                      <span>{item.kcal}kcal</span>
                    </div>
                  )}
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
