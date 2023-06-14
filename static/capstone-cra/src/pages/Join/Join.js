import React, { useState } from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Join.css";
import HeaderNav from "../../components/Header/HeaderNav";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// 회원가입 page
function Join() {
  const jsonLocalStorage = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
      return JSON.parse(localStorage.getItem(key));
    },
  };


  // api url
  const url = "/api/accounts/register/";


  const navigate = useNavigate();

  // form data 상태관리
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    name: "",
    birthdate: "",
    gender: "",
    height: "",
    weight: "",
  });

  // 회원가입 form은 2개, 다음 form으로 넘어갈 수 있도록 상태관리
  const [form1Visible, setForm1Visible] = useState(true);
  const [form2Visible, setForm2Visible] = useState(false);

  // input 값 변경 시, form data setting
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 제출 버튼 클릭 시 이벤트
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...formData });

    // Axios POST 요청 보내기
    axios
      .post(url, formData)
      .then((response) => {
        console.log("회원가입 성공:", response.data);
        navigate("/success");
        // 회원가입 성공 후 처리 로직 작성
      })
      .catch((error) => {
        console.error("회원가입 실패:", error);
        // 회원가입 실패 시 처리 로직 작성
      });
  };

  // 다음 form으로 이동
  const goToNextForm = (e) => {
    setForm1Visible(false);
    setForm2Visible(true);
  };

  return (
    <div>
      <HeaderNav />
      <div className="main">
        <div className="login-content join-content">
          <div className="login-title">Cal로리에 회원가입하기</div>
          {/* 첫번째 form */}
          <form style={{ display: form1Visible ? "block" : "none" }}>
            <ul className="login-list">
              <li className="login-item">
                <label>아이디</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  placeholder="아이디"
                  value={formData.id}
                  onChange={handleChange}
                  required
                />
              </li>
              <li className="login-item">
                <label>비밀번호</label>
                <input
                  type="password"
                  id="pw"
                  name="password"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </li>
              <li className="login-item">
                <label>이름</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="이름"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </li>
              <li className="login-item">
                <label>생년월일</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  required
                />
                <br />
              </li>
            </ul>
            <button
              type="button"
              className="button submit-btn"
              onClick={goToNextForm}
            >
              <a href="#">Continue</a>
            </button>
          </form>
          {/* 두번째 form */}
          <form
            onSubmit={handleSubmit}
            action="url"
            method="POST"
            style={{ display: form2Visible ? "block" : "none" }}
          >
            <ul className="login-list">
              <li className="login-item">
                <label>성별</label>
                <div className="radio-container">
                  <div className="radio-item">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                    />
                    <span>남성</span>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                    />
                    <span>여성</span>
                  </div>
                </div>
              </li>
              <li className="login-item half-item">
                <label>키(cm)</label>
                <div className="half-unit">
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="키"
                    required
                  />
                  <span>cm</span>
                </div>
              </li>
              <li className="login-item half-item">
                <label>몸무게(kg)</label>
                <div className="half-unit">
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                  <span>kg</span>
                </div>
              </li>
            </ul>
            <button type="submit" className="button submit-btn">
              <span>Join</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Join;
