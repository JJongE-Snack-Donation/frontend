import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./Layouts/SidebarLayout";
import AuthLayout from "./Layouts/AuthLayout";
import Home from './Page/Home.js';
import './Assets/Font/Font.css';

function App() {
  return (
    <Router>
        <Routes>
          {/* 기본 레이아웃 (사이드바 포함) */}
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* 인증 레이아웃 (사이드바 미포함) */}
          <Route element={<AuthLayout />}>
          </Route>
        </Routes>
    </Router>
  );
}

export default App;

