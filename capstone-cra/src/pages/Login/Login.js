import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Login.css";
import HeaderNav from "../../components/Header/HeaderNav";
import MainImg from "../../assets/img/main_img.png";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <HeaderNav />
      <div className="test">Login 페이지 입니다.</div>
    </div>
  );
}
export default Login;
