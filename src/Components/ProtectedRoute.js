import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api";  // API 호출 인스턴스 경로에 맞게 수정

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);  // 권한 상태

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      // 토큰이 없으면 /login으로 이동
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // 토큰 유효성 검사
        const response = await api.get("/admin/check-auth", {
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.status === 200) {
          setIsAuthorized(true);  // 유효하면 접근 허용
          console.log("토큰 유효성 검사 성공");
        } else {
          //localStorage.removeItem("token");
          navigate("/login");  // 유효하지 않으면 로그인 페이지로 이동
        }
      } catch (error) {
        console.error("토큰 유효성 검사 실패:", error);
        //localStorage.removeItem("token");  // 오류 발생 시 토큰 삭제
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);

  // 유효성 검사 중에는 아무것도 렌더링하지 않음 (로딩 상태 처리 가능)
  if (!isAuthorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
