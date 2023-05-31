import React from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Login.css";
import HeaderNav from "../../components/Header/HeaderNav";
import { Link } from "react-router-dom";
import axios from "axios";

const url = "api/accounts/login/";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

function Login() {
  const [id, setId] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

  function handleInputChange(e) {
    const userValue = e.target.value;
    console.log(includesHangul(userValue));
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력하실 수 없습니다.");
    }
    setId(userValue);
  }

  function handlePwChange(e) {
    const userValue = e.target.value;
    setPw(userValue);
  }

  function updateLogin(val1, val2) {
    setId(val1);
    jsonLocalStorage.setItem("id", val1);
    setPw(val2);
    console.log(val1, val2);
    const data = {
      id: id,
      password: pw,
    };

    axios
      .post(url, data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (id === "" || pw === "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return;
    }
    updateLogin(id, pw);
  }

  return (
    <div>
      <HeaderNav />
      <div className="main">
        <div className="login-content">
          <div className="login-title">Cal로리에 로그인하기</div>
          <form action="url" method="POST" onSubmit={handleFormSubmit}>
            <ul className="login-list">
              <li className="login-item">
                <label>아이디</label>
                <input
                  type="text"
                  id="id"
                  placeholder="아이디"
                  value={id}
                  onChange={handleInputChange}
                />
                <p style={{ color: "red" }}>{errorMessage}</p>
              </li>
              <li className="login-item">
                <label>비밀번호</label>
                <input
                  type="password"
                  id="pw"
                  placeholder="비밀번호"
                  onChange={handlePwChange}
                />
              </li>
            </ul>
            <button type="submit" className="button submit-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;
