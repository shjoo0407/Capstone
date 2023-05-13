import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Success.css";
import HeaderNav from "../../components/Header/HeaderNav";
import { Link } from "react-router-dom";

function Success() {
  return (
    <div>
      <HeaderNav />
      <div className="test">Success 페이지 입니다.</div>
    </div>
  );
}
export default Success;
