import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./Layouts/SidebarLayout";
import AuthLayout from "./Layouts/AuthLayout";
import Home from './Page/Home.js';
import Project from './Page/Project.js';
import Camera from './Page/camera.js';
import ImageInquiry from './Page/ImageInquiry.js';
import GeneralInspection from './Page/GInspection.js';
import ExceptionInspection from './Page/ExInspection.js';
import './Assets/Font/Font.css';

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
            {/* 기본 레이아웃 (사이드바 포함) */}
            <Route element={<SidebarLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/project" element={<Project />} />
              <Route path="/camera" element={<Camera />} />
              <Route path="/image-inquiry" element={<ImageInquiry />} />
              <Route path="/general-inspection" element={<GeneralInspection />} />
              <Route path="/exception-inspection" element={<ExceptionInspection />} />
            </Route>

            {/* 인증 레이아웃 (사이드바 미포함) */}
            <Route element={<AuthLayout />}>
            </Route>
          </Routes>
      </Router>
    </div>
  );
}

export default App;

