import React, { useState } from "react";
import "./MenuList.css";
import cutleryIcon from "../../assets/img/cutlery.png";
import deleteIcon from "../../assets/img/delete.png";
import { Link, useParams } from "react-router-dom";

// upload 페이지의 menu list
const MenuList = ({ menuItems, handleDelete }) => {
  const [deleteStatus, setDeleteStatus] = useState("");
  const { formattedDate } = useParams(); // params의 현재 날짜 가져오기 format: 00000000

  // delete 버튼 클릭 시
  // const handleDelete = (menuId) => {
  //   fetch(`api/menu/${menuId}`, {
  //     method: "DELETE",
  //   })
  //     // 다시 컴포넌트 불러와야 함.
  //     .then((response) => {
  //       if (response.ok) {
  //         setDeleteStatus("메뉴가 삭제되었습니다.");
  //       } else {
  //         setDeleteStatus("메뉴 삭제 실패");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       setDeleteStatus("메뉴 삭제 실패");
  //     });
  // };
  console.log(menuItems);

  return (
    <div>
      {/* {menuItems.map((menu) => (
        <div className="menu-item" key={menu.id}>
          <div className="menu-item-left">
            <img src={cutleryIcon} alt="포크 아이콘" />
            <span>{menu}</span>
          </div>

          <div className="menu-item-right">
            <input type="button" onClick={() => handleDelete(menu.id)}></input>
          </div>
        </div>
      ))} */}

      {menuItems.map((menu, index) => (
        <div className="menu-item" key={index}>
          <div className="menu-item-left">
            <img src={cutleryIcon} alt="포크 아이콘" />
            <span>{menu}</span>
          </div>

          <div className="menu-item-right">
            <input
              type="button"
              onClick={() => handleDelete(index, formattedDate)}
            ></input>
          </div>
        </div>
      ))}
      {/* 임시용 삭제 상태 문구 */}
      {deleteStatus && <div>{deleteStatus}</div>}
    </div>
  );
};

export default MenuList;
