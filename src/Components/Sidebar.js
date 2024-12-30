import React, { useState } from "react";
import "../Styles/Components.css";
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as Icon1 } from "../Assets/images/btn/project_btn.svg";
import { ReactComponent as Icon2 } from "../Assets/images/btn/inspection_btn.svg";
import { ReactComponent as Arrow } from "../Assets/images/btn/arrow_down.svg";
import { ReactComponent as Icon3 } from "../Assets/images/btn/image_btn.svg";
import { ReactComponent as Icon4 } from "../Assets/images/btn/g_inspection_btn.svg";
import { ReactComponent as Icon5 } from "../Assets/images/btn/ex_inspection_btn.svg";
import { ReactComponent as Icon6 } from "../Assets/images/btn/camera_btn.svg";


const Sidebar = () => {
  const location = useLocation();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleSubMenu = () => {
    setIsSubMenuOpen((prev) => !prev);
  };

  return (
    <div className="sidebar">
      <div className="logo">쫑태통로</div>
      <nav>
        <ul>
          <li className={isActive("/project") ? "active" : ""}>
            <Link to="/project">
              <Icon1 className= "menu-icon" />
              프로젝트
            </Link>
          </li>
          <li onClick={toggleSubMenu} className={isSubMenuOpen ? "toggled" : ""}>
              <Icon2 className={`menu-icon ${isSubMenuOpen ? "toggled" : ""}`} />
              <span className="menu-text">이벤트 검수</span>
              <Arrow className={`arrow-icon ${isSubMenuOpen ? "toggled" : ""}`} />
          </li>
          {isSubMenuOpen && (
              <ul className="sub-menu">
                <li className={isActive("/general-inspection") ? "active" : ""}>
                  <Link to="/general-inspection">
                    <Icon4 className="menu-icon"/>
                    일반 검수
                  </Link>
                </li>
                <li className={isActive("/exception-inspection") ? "active" : ""}>
                  <Link to="/exception-inspection">
                    <Icon5 className="menu-icon"/>
                    예외 검수
                  </Link>
                </li>
              </ul>
            )}
          <li className={isActive("/image-inquiry") ? "active" : ""}>
            <Link to="/image-inquiry">
              <Icon3 className="menu-icon" />
                이미지 조회
            </Link>
          </li>
          <li className={isActive("/camera") ? "active" : ""}>
            <Link to="/camera">
              <Icon6 className="menu-icon" />
              카메라 정보
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
