import React, { useState } from "react";
import "../../Styles/Project.css";
import add from "../../Assets/Imgs/btn/project/add.svg";
import change from "../../Assets/Imgs/btn/project/change.svg";
import ProjectTable from "./ProjectTable";
import Modal from "./CreateModal";


const StepOne = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const account = "current_user";
    const email = "current_user@example.com";
    const [projects, setProjects] = useState([
        {
          id: 1,
          name: "테스트1",
          address: "인천광역시 동구 송현1.2동",
          status: "준비 완료",
          startDate: "2024-11-13",
          endDate: "2024-12-18",
          createdDate: "2024-11-07 01:01:34",
          user: "wkit",
          email: "0000@gmail.com",
          afffiliation: "테스트",
          memo: "테스트",
        },
        {
          id: 2,
          name: "테스트2",
          address: "인천광역시 동구 송현1.2동",
          status: "준비 중",
          startDate: "2024-11-13",
          endDate: "2024-12-18",
          createdDate: "2024-11-07 01:01:34",
          user: "wkit",
          email: "0000@gmail.com",
          afffiliation: "테스트",
          memo: "테스트",
        }
        // 필요시 데이터를 추가
      ]);
    
    const handleDelete = (id) => {
        setProjects(projects.filter((project) => project.id !== id));
    };
    
    const handleEdit = (id) => {
        console.log(`Editing project with id: ${id}`);
        // 수정 기능 추가
    };
    
    const handleSelect = (id) => {
        console.log(`Selecting project with id: ${id}`);
        // 선택 기능 추가
    };
    
    const handleAdd = (project) => {
        // 기존 프로젝트 목록에서 최대 id를 가져옴
        const maxId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) : 0;
        const newProject = {
            ...project,
            id: maxId + 1, // 새로운 id는 최대 id + 1
        };
        setProjects([...projects, newProject]); // 프로젝트 목록에 추가
    };    

    const openModal = () => setIsModalOpen(true); // 모달 열기
    const closeModal = () => setIsModalOpen(false); // 모달 닫기

    return (
        <>
            <div className="project-add-container">
                <button className="add"  onClick={openModal}>
                    <img src={add} alt="add"/>
                </button>
                <button className="change">
                    <img src={change} alt="change" />
                </button>
            </div>
            <ProjectTable
            projects={projects}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onSelect={handleSelect}
            />
            <Modal 
            isOpen={isModalOpen} 
            onClose={closeModal}
            account={account}
            email={email}
            onAdd={handleAdd}
            />
        </>
    );
};

export default StepOne;
