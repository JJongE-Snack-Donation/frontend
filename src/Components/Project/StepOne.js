import React, { useState } from "react";
import "../../Styles/Project.css";
import add from "../../Assets/Imgs/btn/project/add.svg";
import change from "../../Assets/Imgs/btn/project/change.svg";
import ProjectTable from "./ProjectTable";
import Modal from "./CreateModal";
import EditModal from "./EditModal";
import StatusMessage from "./StatusMessage";

const StepOne = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
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
        },
    ]);

    const [statusMessage, setStatusMessage] = useState(""); // 상태 메시지
    const [isSuccess, setIsSuccess] = useState(false); // 성공 여부
    const [showMessage, setShowMessage] = useState(false); // 메시지 표시 여부

    const handleDelete = (id) => {
        const deletedProject = projects.find((project) => project.id === id);
        setProjects(projects.filter((project) => project.id !== id));

        // 메시지 설정
        setStatusMessage(`${deletedProject.name}(이)가 삭제되었습니다.`);
        setIsSuccess(true);
        setShowMessage(true);

        // 3초 후 메시지 숨기기
        setTimeout(() => setShowMessage(false), 3000);
    };

    const handleAdd = (project) => {
        const maxId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) : 0;
        const newProject = {
            ...project,
            id: maxId + 1,
        };
        setProjects([...projects, newProject]);

        // 메시지 설정
        setStatusMessage("프로젝트가 성공적으로 등록되었습니다.");
        setIsSuccess(true);
        setShowMessage(true);

        // 3초 후 메시지 숨기기
        setTimeout(() => setShowMessage(false), 3000);
    };

    const handleEdit = (id) => {
        const projectToEdit = projects.find((project) => project.id === id);
        setSelectedProject(projectToEdit);
        setIsEditModalOpen(true);
    };
      
    const handleUpdate = (updatedProject) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          )
        );
    
        setStatusMessage("프로젝트가 성공적으로 수정되었습니다.");
        setIsSuccess(true);
        setShowMessage(true);
    
        setTimeout(() => setShowMessage(false), 3000); // 3초 후 메시지 숨김
        setIsEditModalOpen(false); // 수정 모달 닫기
    };

    const handleSelect = (id) => {
        console.log(`Selecting project with id: ${id}`);
        // 선택 기능 추가
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            {/* 상태 메시지 표시 */}
            <StatusMessage
                isSuccess={isSuccess}
                message={statusMessage}
                showMessage={showMessage}
            />

            <div className="project-add-container">
                <button className="add" onClick={openModal}>
                    <img src={add} alt="add" />
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
            <EditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                projectData={selectedProject}
                onUpdate={handleUpdate}
            />          
        </>
    );
};

export default StepOne;
