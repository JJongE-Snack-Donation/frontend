import React from "react";
import "../Styles/Components.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">쫑태통로</div>
      <nav>
        <ul>
          <li>메뉴 1</li>
          <li>메뉴 2</li>
          <li>메뉴 3</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
