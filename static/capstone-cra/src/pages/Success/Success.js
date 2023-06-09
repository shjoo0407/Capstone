import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Success.css";
import HeaderNav from "../../components/Header/HeaderNav";
import LoginHeaderNav from "../../components/Header/LoginHeaderNav";

import CalorieBarChart from "../../components/CalorieBarChart/CalorieBarChart";

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
      <div className="test">Success 페이지 입니다.</div>
      <CalorieBarChart perc="72%" color="tomato" />
    </div>
  );
}
export default Success;
