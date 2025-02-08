import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./Layouts/SidebarLayout";
import AuthLayout from "./Layouts/AuthLayout";
import Project from './Pages/Project.js';
import Camera from './Pages/Cam.js';
import ImageInquiry from './Pages/ImageInquiry.js';
import GeneralInspection from './Pages/GInspection.js';
import ExceptionInspection from './Pages/ExInspection.js';
import Login from './Pages/Login.js';
import './Assets/Font/Font.css';
import ProtectedRoute from "./Components/ProtectedRoute";  // 경로에 맞게 수정

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* 보호된 라우트 */}
          <Route
            element={
              <ProtectedRoute>
                <SidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/project" element={<Project />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/image-inquiry" element={<ImageInquiry />} />
            <Route path="/general-inspection" element={<GeneralInspection />} />
            <Route path="/exception-inspection" element={<ExceptionInspection />} />
          </Route>

          {/* 인증 레이아웃 */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
