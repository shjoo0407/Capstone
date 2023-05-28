import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./MyPage.css";
import HeaderNav from "../../components/Header/HeaderNav";
import { Link } from "react-router-dom";

function UserInfoContent(props) {
  return (
    <div className="userinfo-content">
      <div className="userinfo-label">{props.label}</div>
      <div className="userinfo-value">{props.value}</div>
    </div>
  );
}

function MyPage() {
  return (
    <div>
      <HeaderNav />
      <div class="main stats-main">
        <div class="common-inner main-content mypage-content">
          <div className="mypage-title">000 님</div>
          <div className="userinfo-container">
            <div className="userinfo-box">
              <div className="userinfo-title">기본정보</div>
              <UserInfoContent label="아이디" value="asd" />
              <UserInfoContent label="이름" value="000" />
              <UserInfoContent label="생년월일" value="1994-05-28" />
              <UserInfoContent label="성별" value="남성" />
            </div>
            <div className="userinfo-box">
              <div className="userinfo-title">신체정보</div>
              <div class="info-with-btn">
                <UserInfoContent label="키" value="171cm" />
                <button className="userinfo-btn">수정</button>
              </div>
              <div class="info-with-btn">
                <UserInfoContent label="몸무게" value="66kg" />
                <button className="userinfo-btn">수정</button>
              </div>
            </div>
            <div className="userinfo-title"></div>
            <div className="delete-box">
              <button className="userinfo-btn delete-account">회원탈퇴</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MyPage;
