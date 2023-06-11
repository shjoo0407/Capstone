import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Success.css";
import HeaderNav from "../../components/Header/HeaderNav";
import LoginHeaderNav from "../../components/Header/LoginHeaderNav";
import WelcomeImg from "../../assets/img/welcome.png";

import { Link } from "react-router-dom";

function Success() {
  const jsonLocalStorage = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
      return JSON.parse(localStorage.getItem(key));
    },
  };
  const username = jsonLocalStorage.getItem("username");

  return (
    <div>
      {username && <LoginHeaderNav username={username} />}
      {!username && <HeaderNav />}
      <div className="main">
        <div className="success-content">
          <div className="success-title">회원가입 완료!</div>
          <div className="success-subtitle">
            로그인 후 Cal로리 서비스를 이용해보세요.
          </div>
          <img src={WelcomeImg} alt="환영 사진" className="success-img" />
        </div>
      </div>
    </div>
  );
}
export default Success;
