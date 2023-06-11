import React from "react";
import "../../styles/reset.css";
import "./LoginHeaderNav.css";
import mainIcon from "../../assets/img/main_icon.png";
import { Link, useNavigate } from "react-router-dom";

// 헤더 컴포넌트
function LoginHeaderNav({ username }) {
  const navigate = useNavigate();

  const jsonLocalStorage = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
      return JSON.parse(localStorage.getItem(key));
    },
  };

  const handleLogout = () => {
    const token = jsonLocalStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    const apiUrl = "/api/accounts/logout/";
    fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("로그아웃 요청 성공");
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.error("로그아웃 요청 실패");
        }
      })
      .catch((error) => {
        console.error("로그아웃 요청 오류:", error);
      });
  };

  return (
    <div className="header">
      <div className="common-inner header-content">
        <div className="header_left">
          <Link to="/" className="title">
            <img src={mainIcon} alt="홈 아이콘" />
            <span>Cal로리</span>
          </Link>
          <ul className="nav_list">
            <li className="nav_item">
              <Link to="/calendar">식단 업로드</Link>
            </li>
            <li className="nav_item">
              <Link to="/daily">Daily 식단</Link>
            </li>
            <li className="nav_item">
              <Link to="/stats">식단 통계</Link>
            </li>
          </ul>
        </div>
        <div className="header_right">
          <span className="button user_btn">
            <Link to="/mypage" className="username">
              {username} 님
            </Link>
          </span>
          <span className="button logout_btn" onClick={handleLogout}>
            로그아웃
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginHeaderNav;
