import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Join.css";
import HeaderNav from "../../components/Header/HeaderNav";
import { Link } from "react-router-dom";

function Join() {
  return (
    <div>
      <HeaderNav />
      <div className="test">Join 페이지 입니다.</div>
    </div>
  );
}
export default Join;
