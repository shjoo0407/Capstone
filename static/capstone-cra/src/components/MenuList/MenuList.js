import React, { useState } from "react";
import "./MenuList.css";
import cutleryIcon from "../../assets/img/cutlery.png";
import deleteIcon from "../../assets/img/delete.png";

const MenuList = ({ menuItems }) => {
  const [deleteStatus, setDeleteStatus] = useState("");

  const handleDelete = (menuId) => {
    fetch(`api/menu/${menuId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setDeleteStatus("메뉴가 삭제되었습니다.");
        } else {
          setDeleteStatus("메뉴 삭제 실패");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setDeleteStatus("메뉴 삭제 실패");
      });
  };

  return (
    <div>
      {menuItems.map((menu) => (
        <div className="menu-item" key={menu.id}>
          <div className="menu-item-left">
            <img src={cutleryIcon} alt="포크 아이콘" />
            <span>{menu.name}</span>
          </div>

          <div className="menu-item-right">
            <input type="button" onClick={() => handleDelete(menu.id)}></input>
          </div>
          {/* <button onClick={() => handleDelete(menu.id)}></button> */}
        </div>
      ))}
      {/* {deleteStatus && <div>{deleteStatus}</div>} */}
    </div>
  );
};

export default MenuList;
