import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Upload.css";
import HeaderNav from "../../components/Header/HeaderNav";
import { Link, useParams } from "react-router-dom";

function Upload() {
  const { formattedDate } = useParams();
  const year = String(formattedDate).substr(0, 4);
  const month = String(formattedDate).substr(4, 2);
  const day = String(formattedDate).substr(6, 2);
  console.log(year, month, day);

  return (
    <div>
      <HeaderNav />
      <div className="test">
        {year}년 {month}월 {day}일의 upload page 입니다.
      </div>
    </div>
  );
}
export default Upload;
