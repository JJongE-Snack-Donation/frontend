import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import "../Styles/Layouts.css";

const SidebarLayout = () => {
  return (
    <div className="sidebar-layout">
      <Sidebar />
      <div className="content">
        <Outlet /> {/* 자식 라우트가 렌더링되는 위치 */}
      </div>
    </div>
  );
};

export default SidebarLayout;
