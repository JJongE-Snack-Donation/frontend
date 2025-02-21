import React, { useState } from "react";
import "../../Styles/Table.css";
import arrow from "../../Assets/Imgs/btn/project/arrow-right.svg";
import write from "../../Assets/Imgs/btn/project/write.svg";
import trash from "../../Assets/Imgs/btn/project/trash.svg";
import noticeReverse from "../../Assets/Imgs/etc/notice_reverse.svg";

const ProjectTable = ({ projects, onDelete, onEdit, onSelect }) => {
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null); // 삭제 확인 중인 프로젝트 ID

  const handleDeleteClick = (id) => {
    setConfirmingDeleteId((prevId) => (prevId === id ? null : id)); // 토글 방식으로 열기/닫기
  };

  const handleCancelDelete = () => {
    setConfirmingDeleteId(null); // 삭제 확인 취소
  };

  const handleConfirmDelete = (_id) => {
    onDelete(_id); // 부모 컴포넌트에서 삭제 처리
    setConfirmingDeleteId(null); // 삭제 확인 창 닫기
  };

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
            <td>{project.id ?? "-"}</td>
            <td>{project.project_name ?? "없음"}</td>
            <td>{project.address ?? "주소 없음"}</td>
            <td>
              <span
                className={`status ${
                  project.status === "준비 완료" ? "completed" : "pending"
                }`}
              >
                {project.status ?? "상태 없음"}
              </span>
            </td>
            <td>
              {project.start_date
                ? new Date(project.start_date).toLocaleDateString("ko-KR")
                : "날짜 없음"}
            </td>
            <td>
              {project.end_date
                ? new Date(project.end_date).toLocaleDateString("ko-KR")
                : "날짜 없음"}
            </td>
            <td>
              {project.created_at
                ? `${new Date(project.created_at).toLocaleDateString(
                    "ko-KR"
                  )} ${new Date(project.created_at).toLocaleTimeString("ko-KR")}`
                : "날짜 없음"}
            </td>
            <td>{project.manager_name ?? "사용자 없음"}</td>
            <td>
              <div className="tb-btn-container">
                <button className="select" onClick={() => onSelect(project._id)}>
                  <img src={arrow} alt="arrow" />
                </button>
                <button className="edit" onClick={() => onEdit(project._id)}>
                  <img src={write} alt="write" />
                </button>

                {/* 삭제 확인 버튼 */}
                <div className="delete-container">
                  <button
                    className="delete"
                    onClick={() => handleDeleteClick(project.id)}
                  >
                    <img src={trash} alt="trash" />
                  </button>
                  {confirmingDeleteId === project.id && (
                    <div className="delete-confirm-popup">
                      <div className="popup-btn-container">
                        <img src={noticeReverse} alt="notice" />
                        <p>정말로 삭제하시겠습니까?</p>
                      </div>
                      <div className="popup-btn-container">
                        <button
                          className="cancel-delete"
                          onClick={handleCancelDelete}
                        >
                          취소
                        </button>
                        <button
                          className="confirm-delete"
                          onClick={() => handleConfirmDelete(project._id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectTable;
