import React from "react";
import "../Styles/Components.css";
import { ReactComponent as Icon1 } from "../Assets/images/btn/project_btn.svg";
import { ReactComponent as Icon2 } from "../Assets/images/btn/inspection_btn.svg";
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">쫑태통로</div>
      <nav>
        <ul>
          <li>
            <Icon1 className="menu-icon"/>
            프로젝트
          </li>
          <li>
            <Icon2 className="menu-icon"/>
            이벤트 검수
          </li>
          <li>메뉴 3</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
