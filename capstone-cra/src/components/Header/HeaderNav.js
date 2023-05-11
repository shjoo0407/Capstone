import React from "react";
import "../../styles/reset.css";
import "./HeaderNav.css";
import mainIcon from "../../assets/img/main_icon.png";
import { Link } from "react-router-dom";

// 헤더 컴포넌트
function HeaderNav() {
  return (
    <div className="header">
      <div className="common-inner header-content">
        <div className="header_left">
          {/* <a href="./index.html" className="title">
            <img src={mainIcon} alt="홈 아이콘" />
            <span>Cal로리</span>
          </a> */}
          <Link to="/" className="title">
            <img src={mainIcon} alt="홈 아이콘" />
            <span>Cal로리</span>
          </Link>
          <ul className="nav_list">
            <li className="nav_item">
              {/* <a href="./upload.html">식단 업로드</a> */}
              <Link to="/upload">식단 업로드</Link>
            </li>
            <li className="nav_item">
              {/* <a href="#">Daily 식단</a> */}
              <Link to="/daily">Daily 식단</Link>
            </li>
            <li className="nav_item">
              {/* <a href="#">식단 통계</a> */}
              <Link to="/stats">식단 통계</Link>
            </li>
          </ul>
        </div>
        <div className="header_right">
          <span className="button login_btn">
            <Link to="/login">Login</Link>
          </span>
          <span className="button join_btn">
            <Link to="/join">Join</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default HeaderNav;
