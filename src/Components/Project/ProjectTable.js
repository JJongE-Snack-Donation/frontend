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
