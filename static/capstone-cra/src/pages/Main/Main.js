import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Main.css";
import HeaderNav from "../../components/Header/HeaderNav";
import LoginHeaderNav from "../../components/Header/LoginHeaderNav";
import MainImg from "../../assets/img/main_img.png";
import { Link } from "react-router-dom";

function Main() {
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
        <div className="common-inner main-content">
          <div className="slogan slogan-main">
            Cal로리와 함께, 쉽고 빠른 식단관리
          </div>
          <div className="slogan slogan-sub">
            사진 찍어 칼로리 파악부터 건강한 식습관까지
          </div>
          {!username && (
            <span className="button start-btn">
              <Link to="/Login">시작하기 →</Link>
            </span>
          )}
          <img src={MainImg} alt="음식 사진" className="main-img" />
        </div>
      </div>
    </div>
  );
}

export default Main;
