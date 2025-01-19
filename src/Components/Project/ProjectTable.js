import React, { useState } from "react";
import "../../Styles/Table.css";

const ProjectTable = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "테스트1",
      address: "인천광역시 동구 송현1.2동",
      status: "진행 완료",
      startDate: "2024-11-13",
      endDate: "2024-12-18",
      createdDate: "2024-11-07 01:01:34",
      user: "wkit",
    },
    // 필요시 데이터를 추가
  ]);

  return (
    <div style={{ margin: "20px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th>번호</th>
            <th>프로젝트 이름</th>
            <th>주소</th>
            <th>상태</th>
            <th>시작 날짜</th>
            <th>종료 날짜</th>
            <th>생성일자</th>
            <th>사용자</th>
            <th>옵션</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} style={{ textAlign: "center" }}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.address}</td>
              <td>
                <span className={`status ${project.status === "진행 완료" ? "completed" : "pending"}`}>
                    {project.status}
                </span>
              </td>
              <td>{project.startDate}</td>
              <td>{project.endDate}</td>
              <td>{project.createdDate}</td>
              <td>{project.user}</td>
              <td>
                <button style={{ marginRight: "10px" }}>수정</button>
                <button style={{ color: "red" }}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
