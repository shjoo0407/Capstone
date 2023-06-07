import React, { useState } from "react";
import "../../styles/reset.css";
import "../../styles/common.css";
import "./Upload.css";
import HeaderNav from "../../components/Header/HeaderNav";
import Uploader from "../../components/Uploader/Uploader";
import MenuList from "../../components/MenuList/MenuList";
import dummyImg from "../../assets/img/dummy.png";
import { Link, useParams } from "react-router-dom";

// upload 컴포넌트
function Upload() {
  const { formattedDate } = useParams();
  const year = String(formattedDate).substr(0, 4);
  const month = String(formattedDate).substr(4, 2);
  const day = String(formattedDate).substr(6, 2);
  console.log(year, month, day);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");

  // test용 menu item
  const menuItems = [
    { id: 1, name: "닭가슴살 샐러드" },
    { id: 2, name: "무언가" },
    { id: 3, name: "무언가" },
    { id: 4, name: "무언가" },
    { id: 5, name: "무언가" },
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  // 1차 업로드
  const handleUpload = () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);

    fetch("api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setFoodName(data.foodName);
        setCalories(data.calories);
      })
      .catch((error) => console.error("Error:", error));
  };

  // 최종 업로드
  const handleResultUpload = () => {
    if (!selectedFile || !foodName || !calories) {
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("foodName", foodName);
    formData.append("calories", calories);

    fetch("api/result", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log("Upload successful:", data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <HeaderNav />
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
                  {/* 나중에 변수 하나 만들어서 보일 거 안 보일 거로.. 해야 함 */}
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
                </div>
                <div className="modified-name">수정 이름 칸: </div>
                <div className="upload-buttons">
                  <button onClick={handleUpload}>다음 단계</button>
                  <button onClick={handleResultUpload}>결과 제출하기</button>
                </div>
              </div>
              <div className="menu-box">
                <div className="menu-box-title">식단</div>
                <div className="menu">
                  <MenuList menuItems={menuItems} />
                </div>
              </div>
            </div>
            <div className="container-sub upload-right-container">
              <div className="nutrition-box">
                <div className="upload-date">
                  {year}년 {month}월 {day}일의 upload page 입니다.
                </div>
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
