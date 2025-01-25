import React from "react";
import "../../Styles/Table.css";
import arrow from "../../Assets/Imgs/btn/project/arrow-right.svg";
import write from "../../Assets/Imgs/btn/project/write.svg";
import trash from "../../Assets/Imgs/btn/project/trash.svg";

const ProjectTable = ({ projects, onDelete, onEdit, onSelect }) => {
  return (
    <table>
      <thead>
        <tr>
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
          <tr key={project.id}>
            <td>{project.id ?? "-"}</td> {/* 번호가 없으면 "-" 표시 */}
            <td>{project.name ?? "없음"}</td> {/* 프로젝트 이름 기본값 */}
            <td>{project.address ?? "주소 없음"}</td> {/* 주소 기본값 */}
            <td>
              <span className={`status ${project.status === "준비 완료" ? "completed" : "pending"}`}>
                {project.status ?? "상태 없음"}
              </span>
            </td>
            <td>
              {/* 시작 날짜 렌더링, Date 객체라면 문자열로 변환 */}
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString("ko-KR")
                : "날짜 없음"}
            </td>
            <td>
              {/* 종료 날짜 렌더링 */}
              {project.endDate
                ? new Date(project.endDate).toLocaleDateString("ko-KR")
                : "날짜 없음"}
            </td>
            <td>
              {/* 생성일자 렌더링 */}
              {project.createdDate
                ? new Date(project.createdDate).toLocaleDateString("ko-KR")
                : "날짜 없음"}
            </td>
            <td>{project.user ?? "사용자 없음"}</td>
            <td>
              <div className="tb-btn-container">
                <button className="select" onClick={() => onSelect(project.id)}>
                  <img src={arrow} alt="arrow" />
                </button>
                <button className="edit" onClick={() => onEdit(project.id)}>
                  <img src={write} alt="write" />
                </button>
                <button className="delete" onClick={() => onDelete(project.id)}>
                  <img src={trash} alt="trash" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectTable;
