import React, { useState, useEffect } from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Upload.css";
import HeaderNav from "../../components/Header/HeaderNav";
import LoginHeaderNav from "../../components/Header/LoginHeaderNav";
import CalorieBarChart from "../../components/CalorieBarChart/CalorieBarChart";

import Uploader from "../../components/Uploader/Uploader";
import MenuList from "../../components/MenuList/MenuList";
import dummyImg from "../../assets/img/dummy.png";
import { Link, useParams } from "react-router-dom";

// upload 컴포넌트
function Upload() {
  const jsonLocalStorage = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
      return JSON.parse(localStorage.getItem(key));
    },
  };

  const username = jsonLocalStorage.getItem("username"); // localStorage의 사용자 이름 가져오기
  const { formattedDate } = useParams(); // params의 현재 날짜 가져오기 format: 00000000

  const year = String(formattedDate).substr(0, 4);
  const month = String(formattedDate).substr(4, 2);
  const day = String(formattedDate).substr(6, 2);
  console.log(year, month, day); // format: 0000 00 00

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");

  const [nextForm, setNextForm] = useState(false); // form 전환 상태 관리

  const [uploadStatus, setUploadStatus] = useState(""); // 업로드 상태 관리

  const [nutritions, setNutritions] = useState(null); // bar 그래프로 표현되는, 해당 날짜의 영양성분 data
  const [menuList, setMenuList] = useState([]); // 해당 날짜의 식단 리스트

  // test용 menu item
  const menuItems = [
    { id: 1, name: "닭가슴살 샐러드" },
    { id: 2, name: "무언가" },
    { id: 3, name: "무언가" },
    { id: 4, name: "무언가" },
    { id: 5, name: "무언가" },
  ];

  // 컴포넌트 렌더링 시 실행
  useEffect(() => {
    fetchData();
  }, []);

  // 해당 날짜의 식단 리스트와 섭취한 영양성분 가져오기
  const fetchData = async () => {
    try {
      const calMenu = await fetch(
        "서버의_API_URL/칼로리_및_메뉴_가져오기_엔드포인트"
        // API_URL에 params의 data 추가해서 넣으면 될듯
      );
      const calMenuData = await calMenu.json();
      console.log(calMenuData);

      setNutritions(calMenuData.nutritions);
      setMenuList(calMenuData.menuList);
    } catch (error) {
      console.error("데이터를 가져오는 동안 오류가 발생했습니다:", error);
    }
  };

  // 파일 입력 시 미리보기로 보여줌
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  // 1차 업로드) 서버로 사진 post
  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }
    // const formData = new FormData();
    // formData.append("photo", selectedFile);

    // fetch("api/upload/", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     // setFoodName(data.foodName);
    //     // setCalories(data.calories);
    //     setNextForm(true);
    //   })
    //   .catch((error) => console.error("Error:", error));
    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const response = await fetch("api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFoodName(data.foodName); // 사진의 이름
        setCalories(data.calories); // 사진의 칼로리
        setNextForm(true); // 다음 form으로 전환 (최종 업로드 form으로 전환)
        setUploadStatus("업로드 완료");
      } else {
        setUploadStatus("업로드 실패");
      }
    } catch (error) {
      console.error("Error:", error);
      setUploadStatus("업로드 실패");
    }
  };

  // 최종 업로드
  const handleResultUpload = async () => {
    if (!selectedFile || !foodName || !calories) {
      return;
    }

    // const formData = new FormData();
    // formData.append("photo", selectedFile);
    // formData.append("foodName", foodName);
    // formData.append("calories", calories);

    // fetch("api/result", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Upload successful:", data);
    //     setNextForm(false);
    //   })
    //   .catch((error) => console.error("Error:", error));

    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      formData.append("foodName", foodName);
      formData.append("calories", calories);

      const response = await fetch("api/result", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // 성공적으로 결과를 전송한 경우 처리할 내용 작성
        const data = await response.json();
        console.log("Upload successful:", data);
        setNextForm(false);
      } else {
        // 전송 실패한 경우 처리할 내용 작성
        console.log("error!");
      }

      const calMenu = await fetch(
        "서버의_API_URL/칼로리_및_메뉴_가져오기_엔드포인트"
      );
      const calMenuData = await response.json();

      setNutritions(calMenuData.nutritions);
      setMenuList(calMenuData.menuList);
    } catch (error) {
      console.error("Error:", error);
      // 전송 실패한 경우 처리할 내용 작성
    }
  };

  return (
    <div>
      {username && <LoginHeaderNav username={username} />}
      {!username && <HeaderNav />}
      <div className="main upload-main">
        <div className="common-inner upload-content">
          <div className="upload-container">
            <div className="container-sub upload-left-container">
              <div className="upload-box">
                <div className="upload-date">
                  {year}년 {month}월 {day}일
                </div>
                <div className="upload-img-info">
                  <div className="upload-img">
                    {previewURL && (
                      <div>
                        <img
                          src={previewURL || dummyImg}
                          alt="Preview"
                          // style={{ maxWidth: "100%" }}
                        />
                      </div>
                    )}
                    <input type="file" onChange={handleFileChange} />
                  </div>

                  {nextForm && (
                    <div className="upload-info">
                      <div className="food-info">
                        <div className="food-name">
                          {foodName || "닭가슴살 샐러드 "}
                        </div>
                        <div className="food-cal">{calories || "820kcal"}</div>
                      </div>
                      <div className="cal-info">탄수화물 {"190g"}</div>
                      <div className="cal-info">단백질 {"20g"}</div>
                    </div>
                  )}
                </div>
                <div className="upload-buttons">
                  {nextForm && (
                    <div className="modified-name">수정 이름 칸: </div>
                  )}
                  {!nextForm && (
                    <button onClick={handleUpload}>다음 단계</button>
                  )}
                  {nextForm && (
                    <button onClick={handleResultUpload}>결과 제출하기</button>
                  )}
                </div>
              </div>
              <div className="menu-box">
                <div className="menu-box-title">식단</div>
                <div className="menu">
                  <MenuList menuItems={menuList} />
                </div>
              </div>
            </div>
            <div className="container-sub upload-right-container">
              <div className="nutrition-box">
                <ul className="nutrition-list">
                  <li className="nutrition-item">
                    <span className="title">
                      {/* {nutritions && nutritions.calorie} */}
                      칼로리
                    </span>
                    <CalorieBarChart
                      width="320"
                      percent="0.7"
                      // color="rgb(62, 122, 235)"
                      color="rgba(46, 204, 113, 0.72)"
                    />
                    <span className="content">
                      {/* {nutritions && nutritions.calorie}/1280kcal */}
                      872/1280kcal
                    </span>
                  </li>
                  <li className="nutrition-item">
                    <span className="title">
                      {/* {nutritions && nutritions.calorie} */}
                      탄수화물
                    </span>
                    <CalorieBarChart
                      width="320"
                      percent="0.4"
                      color="rgb(216, 100, 169)"
                    />
                    <span className="content">
                      {/* {nutritions && nutritions.calorie}/1280kcal */}
                      222/520g
                    </span>
                  </li>
                  <li className="nutrition-item">
                    <span className="title">
                      {/* {nutritions && nutritions.calorie} */}
                      단백질
                    </span>
                    <CalorieBarChart
                      width="320"
                      percent="0.84"
                      color="rgb(122, 168, 116)"
                    />
                    <span className="content">
                      {/* {nutritions && nutritions.calorie}/1280kcal */}
                      59/70g
                    </span>
                  </li>
                </ul>
              </div>
              <div className="radial-graph-box"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
