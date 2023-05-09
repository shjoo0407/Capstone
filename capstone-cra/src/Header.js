import logo from "./logo.svg";
import React from "react";
import "./reset.css";
import "./index.css";
import "./header.css";

// 헤더
function Header() {
  return (
    <div class="header">
      <div class="common-inner header-content">
        <div class="header_left">
          <a href="./index.html" class="title">
            <img src="../assets/images/main_icon.png" alt="홈 아이콘" />
            <span>Cal로리</span>
          </a>
          <ul class="nav_list">
            <li class="nav_item">
              <a href="./upload.html">식단 업로드</a>
            </li>
            <li class="nav_item">
              <a href="#">Daily 식단</a>
            </li>
            <li class="nav_item">
              <a href="#">식단 통계</a>
            </li>
          </ul>
        </div>
        <div class="header_right">
          <span class="button login_btn">
            <a href="./login.html">Login</a>
          </span>
          <span class="button join_btn">
            <a href="./join.html">Join</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Header;
