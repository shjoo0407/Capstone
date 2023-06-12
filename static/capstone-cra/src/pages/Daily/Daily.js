import React, { useState, useEffect } from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Daily.css";
import leftArrow from "../../assets/img/left-arrow.png";
import rightArrow from "../../assets/img/right-arrow.png";
import HeaderNav from "../../components/Header/HeaderNav";
import LoginHeaderNav from "../../components/Header/LoginHeaderNav";
import CalorieBarChart from "../../components/CalorieBarChart/CalorieBarChart";

import { Link } from "react-router-dom";

function Daily() {
  const jsonLocalStorage = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
      return JSON.parse(localStorage.getItem(key));
    },
  };
  const username = jsonLocalStorage.getItem("username");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  // upload 페이지 로드 시 받는 권장섭취량 & 실제 섭취량 정보
  const [cal, setCal] = useState([]);
  const [carbon, setCarbon] = useState([]);
  const [protein, setProtein] = useState([]);
  const [fat, setFat] = useState([]);

  // const fetchData = async () => {
  //   try {
  //     const token = jsonLocalStorage.getItem("token");
  //     if (!token) {
  //       console.error("토큰이 없습니다!");
  //       return;
  //     }
  //     const data = await fetch(`../api/main/calendar/${formattedDate}/`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     // API_URL에 params의 data 추가해서 넣으면 될듯
  //     const dataJson = await data.json();
  //     console.log(dataJson);
  //     setMenuList(dataJson.menulist);
  //     setCal([dataJson.calorie.recommended, dataJson.calorie.actual]);
  //     setCarbon([
  //       dataJson.carbonhydrate.recommended,
  //       dataJson.carbonhydrate.actual,
  //     ]);
  //     setProtein([dataJson.protein.recommended, dataJson.protein.actual]);
  //     setFat([dataJson.fat.recommended, dataJson.fat.actual]);

  //     console.log(menuList, cal, carbon, protein, fat);
  //     console.log("연결...... 완료......");
  //   } catch (error) {
  //     console.error("데이터를 가져오는 동안 오류가 발생했습니다:", error);
  //   }
  // };
  const getPercent = (recommended, actual) => {
    const result = (actual / recommended).toFixed(2);
    console.log("result: ", result);
    if (result >= 1) {
      return 1;
    }
    return result;
  };
  // 이전 달로 이동
  const goToPreviousMonth = () => {
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(previousMonth);
    setSelectedButton(null);
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setCurrentDate(nextMonth);
    setSelectedButton(null);
  };

  // 날짜 클릭 시 페이지 라우팅 (/calendar/해당날짜)
  const handleDateClick = async (index, year, month, day) => {
    const formattedDate = `${year}${month.toString().padStart(2, "0")}${day
      .toString()
      .padStart(2, "0")}`;
    console.log(formattedDate);
    // navigate(`/calendar/${formattedDate}`);
    setSelectedButton(index);
    try {
      const token = jsonLocalStorage.getItem("token");

      // 토큰 유무 확인
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      const response = await fetch(`../api/main/calendar/${formattedDate}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const dataJson = await response.json();
        setData(dataJson);
        setCal([dataJson.calorie.recommended, dataJson.calorie.actual]);
        setCarbon([
          dataJson.carbonhydrate.recommended,
          dataJson.carbonhydrate.actual,
        ]);
        setProtein([dataJson.protein.recommended, dataJson.protein.actual]);
        setFat([dataJson.fat.recommended, dataJson.fat.actual]);

        console.log(cal, carbon, protein, fat);
      } else {
        throw new Error("GET 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("GET 요청 오류:", error);
    }
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
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 요일 반환
    console.log("firstDayOfWeek", firstDayOfWeek);

    const calendarData = [];
    console.log(calendarData);

    // 서버 get 요청 용 formatted date (000000)
    const getFormattedDate = (year, month, day) => {
      const formattedDate = `${year.toString().substr(2, 2)}${month
        .toString()
        .padStart(2, "0")}${day.toString().padStart(2, "0")}`;
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
      {username && <LoginHeaderNav username={username} />}
      {!username && <HeaderNav />}

      <div className="main">
        <div className="common-inner main-content daily-content">
          <div className="daily-daily">
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
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div className="calendar-day-label" key={day}>
                      {day}
                    </div>
                  )
                )}
                {calendarData.map((item, index) => (
                  <div
                    key={index}
                    className={`daily-day ${
                      item.isCurrentMonth ? "current-month" : "other-month"
                    }`}
                    onClick={() =>
                      handleDateClick(index, item.year, item.month, item.day)
                    }
                    style={{
                      backgroundColor:
                        selectedButton === index
                          ? "rgba(60, 179, 113, 0.6)"
                          : "white",
                    }}
                  >
                    {item.day}
                  </div>
                ))}
              </div>
            </div>
            <div className="container-sub upload-right-container">
              <div className="nutrition-box">
                <ul className="nutrition-list">
                  <li className="nutrition-item">
                    <span className="title">칼로리</span>
                    <CalorieBarChart
                      width="320"
                      percent={getPercent(cal[0], cal[1])}
                      color="rgba(46, 204, 113, 0.72)"
                    />
                    <span className="content">
                      {cal[1]}/{cal[0]}kcal
                    </span>
                  </li>
                  <li className="nutrition-item">
                    <span className="title">탄수화물</span>
                    <CalorieBarChart
                      width="320"
                      percent={getPercent(carbon[0], carbon[1])}
                      color="rgb(216, 100, 169)"
                    />
                    <span className="content">
                      {carbon[1]}/{carbon[0]}g
                    </span>
                  </li>
                  <li className="nutrition-item">
                    <span className="title">단백질</span>
                    <CalorieBarChart
                      width="320"
                      percent={getPercent(protein[0], protein[1])}
                      color="rgb(122, 168, 116)"
                    />
                    <span className="content">
                      {protein[1]}/{protein[0]}g
                    </span>
                  </li>
                  <li className="nutrition-item">
                    <span className="title">지방</span>
                    <CalorieBarChart
                      width="320"
                      percent={getPercent(fat[0], fat[1])}
                      color="rgb(235, 176, 45)"
                    />
                    <span className="content">
                      {fat[1]}/{fat[0]}g
                    </span>
                  </li>
                </ul>
              </div>
              <div className="radial-graph-box"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Daily;
