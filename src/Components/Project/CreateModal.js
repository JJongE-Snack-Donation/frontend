// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import StatusMessage from "./StatusMessage"; // StatusMessage 가져오기
// import api from "../../Api";
// import "../../Styles/Modal.css";
// import "../../Styles/DatePicker.css";
// import "react-datepicker/dist/react-datepicker.css";
// import x from "../../Assets/Imgs/btn/project/x.svg";
// import asterisk from "../../Assets/Imgs/etc/asterisk.svg";

// const Modal = ({ isOpen, onClose, onAdd }) => {
//   const [project, setProject] = useState({
//     project_name: "",
//     address: "",
//     status: "준비 중",
//     start_date: null,
//     end_date: null,
//     user: localStorage.getItem("username"),
//     email: localStorage.getItem("email"),
//     manager_organization: "",
//     memo: "",
//   });

//   const [isNameValid, setIsNameValid] = useState(false);
//   const [isDuplicate, setIsDuplicate] = useState(null);
//   const [showMessage, setShowMessage] = useState(false);

//   const handleNameChange = (e) => {
//     const project_name = e.target.value;
//     setProject({ ...project, project_name: project_name });
//     setIsNameValid(project_name.trim().length > 0);
//     setIsDuplicate(null);
//   };

//   //초기화
//   const handleReset = () => {
//     setProject({
//       project_name: "",
//       address: "",
//       status: "준비 중",
//       start_date: null,
//       end_date: null,
//       user: localStorage.getItem("username"),
//       email: localStorage.getItem("email"),
//       manager_organization: "",
//       memo: "",
//     });
//     setIsNameValid(false);
//     setIsDuplicate(null);
//     setShowMessage(false);
//   };

//   const handleCheckDuplicate = async () => {
//     if (!isNameValid) return;
//     try {
//       const response = await api.get(`/project/check-name`,
//         { 
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//           params: { name: project.project_name } 
//         }
//       );
//       if (response.status === 200) {
//         setIsDuplicate(false);
//         setShowMessage(true);
//         setTimeout(() => setShowMessage(false), 2000);
//       }
//     } catch (err) {
//       console.error("Error checking duplicate:", err);
//     }
//   };

//   const formattedProject = {
//     ...project,
//     start_date: project.start_date ? project.start_date.toISOString().split("T")[0] : null,
//     end_date: project.end_date ? project.end_date.toISOString().split("T")[0] : null,
//   };

//   const handleAdd = async () => {
//     if (isDuplicate === false) {
//       try {
//         // 프로젝트 추가 요청
//         console.log(formattedProject);
//         const response = await api.post(
//           "/project",
//           JSON.stringify({
//             ...formattedProject,
//             status: "준비 완료", // 상태 변경
//           }),
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
  
//         if (response.status === 200) {
//           handleReset();
//           onClose();
//           onAdd();
//         }
//       } catch (error) {
//         console.error("프로젝트 추가 요청 중 오류 발생:", error);
//       }
//     }
//   };  

//   // 등록 버튼 활성화 조건
//   const isFormValid =
//     project.project_name.trim() &&
//     project.address.trim() &&
//     project.start_date &&
//     project.end_date &&
//     isDuplicate === false;

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="row-container modal-header">
//           <h2>프로젝트 추가</h2>
//           <button className="close-button" onClick={onClose}>
//             <img src={x} alt="close" />
//           </button>
//         </div>
//         <div className="row-container">
//           <img src={asterisk} alt="asterisk" className="asterisk" />
//           <p>프로젝트 이름</p>
//         </div>
//         <div className="row-container input-container">
//           <input
//             type="text"
//             placeholder="프로젝트 이름을 입력하세요"
//             value={project.project_name}
//             onChange={handleNameChange}
//           />
//           <button
//             className={`check-button ${isNameValid ? "active" : ""}`}
//             onClick={handleCheckDuplicate}
//             disabled={!isNameValid}
//           >
//             중복확인
//           </button>
//         </div>
//         {/* 성공/실패 메시지 컴포넌트 */}
//         <StatusMessage
//           isSuccess={!isDuplicate} // 성공 여부
//           message={
//             isDuplicate
//               ? "중복된 프로젝트 이름입니다."
//               : "사용 가능한 프로젝트 이름입니다."
//           }
//           showMessage={showMessage}
//         />
//         <div className="row-container">
//           <img src={asterisk} alt="asterisk" className="asterisk" />
//           <p>프로젝트 기간</p>
//         </div>
//         <div className="row-container input-container">
//           <DatePicker
//             selectsRange
//             startDate={project.start_date}
//             endDate={project.end_date}
//             onChange={(dates) => {
//               const [start, end] = dates;
//               setProject({ ...project, start_date: start, end_date: end });
//             }}
//             isClearable={false}
//             dateFormat="yyyy-MM-dd"
//             placeholderText="날짜를 선택하세요"
//             monthsShown={2}
//             shouldCloseOnSelect={false}
//             showPopperArrow={false}
//           />
//         </div>
//         <div className="row-container">
//           <img src={asterisk} alt="asterisk" className="asterisk" />
//           <p>주소</p>
//         </div>
//         <div className="row-container input-container">
//           <input
//             type="text"
//             placeholder="프로젝트 주소를 입력하세요"
//             value={project.address}
//             onChange={(e) => setProject({ ...project, address: e.target.value })}
//           />
//         </div>
//         <div className="row-container">
//           <p>소속</p>
//         </div>
//         <div className="row-container input-container">
//           <input
//             type="text"
//             placeholder="소속을 입력하세요"
//             value={project.manager_organization}
//             onChange={(e) => setProject({ ...project, manager_organization: e.target.value })}
//           />
//         </div>
//         <div className="row-container">
//           <p>담당자 계정</p>
//         </div>
//         <div className="row-container input-container">
//           <input type="text" value={project.user} disabled />
//         </div>
//         <div className="row-container">
//           <p>이메일</p>
//         </div>
//         <div className="row-container input-container">
//           <input type="text" value={project.email} disabled />
//         </div>
//         <div className="row-container">
//           <p>메모</p>
//         </div>
//         <div className="row-container input-container">
//           <input
//             type="text"
//             placeholder="메모를 입력하세요"
//             value={project.memo}
//             onChange={(e) => setProject({ ...project, memo: e.target.value })}
//           />
//         </div>
//         <div className="row-container modal-footer">
//           <button onClick={onClose}>취소</button>
//           <button onClick={handleAdd} className="active" disabled={!isFormValid}>
//             등록
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
