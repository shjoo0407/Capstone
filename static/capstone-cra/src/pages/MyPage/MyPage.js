import React, { useEffect, useState } from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./MyPage.css";
import HeaderNav from "../../components/Header/HeaderNav";
import LoginHeaderNav from "../../components/Header/LoginHeaderNav";
import { useNavigate } from "react-router-dom";

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
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const jsonLocalStorage = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
      return JSON.parse(localStorage.getItem(key));
    },
  };

  const username = jsonLocalStorage.getItem("username");

  const fetchData = async () => {
    try {
      const token = jsonLocalStorage.getItem("token");

      // 토큰 유무 확인
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      const apiUrl = "/api/accounts/mypage/";
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setUserInfo(responseData);
      } else {
        throw new Error("GET 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("GET 요청 오류:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsonLocalStorage.getItem("token");

        // 토큰 유무 확인
        if (!token) {
          throw new Error("토큰이 없습니다.");
        }

        const apiUrl = "api/accounts/mypage/";
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setUserInfo(responseData);
          console.log(userInfo);
        } else {
          throw new Error("GET 요청에 실패했습니다.");
        }
      } catch (error) {
        console.error("GET 요청 오류:", error);
      }
    };

    fetchData();
  }, []);

  const handlePutButtonClick = (e) => {
    const type = e.target.value;
    const token = jsonLocalStorage.getItem("token");
    const userInput = prompt("수정할 내용을 입력하세요.");
    if (userInput !== null) {
      const apiUrl = "api/accounts/mypage/"; // PUT 요청을 보낼 API 엔드포인트 URL
      const requestData = {
        // 요청 데이터에 포함할 내용
        type: type,
        data: userInput,
        token: token,
      };

      console.log(requestData);

      fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("PUT 요청 응답:", data);
          fetchData();
        })
        .catch((error) => {
          console.error("PUT 요청 오류:", error);
        });
    }
  };

  // 회원탈퇴
  const handleDelete = () => {
    const token = jsonLocalStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    const apiUrl = "api/accounts/mypage/";
    fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("DELETE 요청 성공");
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.error("DELETE 요청 실패");
        }
      })
      .catch((error) => {
        console.error("DELETE 요청 오류:", error);
      });
  };

  return (
    <div>
      {username && <LoginHeaderNav username={username} />}
      {!username && <HeaderNav />}
      <div className="main stats-main">
        <div className="common-inner main-content mypage-content">
          <div className="mypage-title">
            {(userInfo && userInfo.name) || "무언가"} 님
          </div>
          <div className="userinfo-container">
            <div className="userinfo-box">
              <div className="userinfo-title">기본정보</div>
              <UserInfoContent
                label="아이디"
                value={(userInfo && userInfo.id) || "아이디"}
              />
              <UserInfoContent
                label="이름"
                value={(userInfo && userInfo.name) || "무언가"}
              />
              <UserInfoContent
                label="생년월일"
                value={(userInfo && userInfo.birthdate) || "생년월일"}
              />
              <UserInfoContent
                label="성별"
                value={(userInfo && userInfo.gender) || "성별"}
              />
            </div>
            <div className="userinfo-box">
              <div className="userinfo-title">신체정보</div>
              <div className="info-with-btn">
                <UserInfoContent
                  label="키"
                  value={(userInfo && userInfo.height) || "키"}
                />
                <button
                  className="userinfo-btn"
                  value="height"
                  onClick={handlePutButtonClick}
                >
                  수정
                </button>
              </div>
              <div className="info-with-btn">
                <UserInfoContent
                  label="몸무게"
                  value={(userInfo && userInfo.weight) || "몸무게"}
                />
                <button
                  className="userinfo-btn"
                  value="weight"
                  onClick={handlePutButtonClick}
                >
                  수정
                </button>
              </div>
            </div>
            <div className="userinfo-title"></div>
            <div className="delete-box">
              <button
                className="userinfo-btn delete-account"
                onClick={handleDelete}
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MyPage;
