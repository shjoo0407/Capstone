import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Upload.css";
import HeaderNav from "../../components/Header/HeaderNav";
import MainImg from "../../assets/img/main_img.png";
import { Link } from "react-router-dom";

function Upload() {
  return (
    <div>
      <HeaderNav />
      <div className="test">Upload 페이지 입니다.</div>
    </div>
  );
}
export default Upload;
