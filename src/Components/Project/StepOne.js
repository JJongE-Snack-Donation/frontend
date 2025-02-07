import React, { useState, useEffect } from "react";
import api from "../../Api";
import "../../Styles/Project.css";
import add from "../../Assets/Imgs/btn/project/add.svg";
import change from "../../Assets/Imgs/btn/project/change.svg";
import ProjectTable from "./ProjectTable";
import Modal from "./CreateModal";
import EditModal from "./EditModal";
import StatusMessage from "./StatusMessage";

const StepOne = ({ nextStep, setSelectedProjectId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [statusMessage, setStatusMessage] = useState(""); // 상태 메시지
    const [isSuccess, setIsSuccess] = useState(false); // 성공 여부
    const [showMessage, setShowMessage] = useState(false); // 메시지 표시 여부

    useEffect(() => {
        fetchProjectInfo();
    }, []);

    //프로젝트 조회
    const fetchProjectInfo = async () => {
        try {
            const response = await api.get("/project", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
    
            const projectsWithId = response.data.data.projects
                .slice() // 원본 배열을 복사하여 역순으로 변경해도 안전하게 함
                .reverse()
                .map((project, index) => ({
                    ...project,
                    id: index + 1  // 순차적으로 1, 2, 3... 부여
                }));
    
            console.log("Projects with custom IDs (reversed):", projectsWithId);
            setProjects(projectsWithId);
        } catch (error) {
            console.error(error);
        }
    };    
    

    const handleDelete = async (_id) => {
        try {
            // API 호출 (삭제 요청)
            await api.delete(`/project/${_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            fetchProjectInfo();
    
            // 삭제된 프로젝트 정보 찾기
            const deletedProject = projects.find((project) => project._id === _id);
    
            // 로컬 상태에서 제거
            setProjects(projects.filter((project) => project._id !== _id));
    
            // 성공 메시지 설정
            setStatusMessage(`${deletedProject.project_name}(이)가 삭제되었습니다.`);
            setIsSuccess(true);
            setShowMessage(true);
    
            // 3초 후 메시지 숨기기
            setTimeout(() => setShowMessage(false), 3000);
        } catch (error) {
            console.error("프로젝트 삭제 실패:", error);
    
            // 에러 메시지 표시
            setStatusMessage("프로젝트 삭제 중 오류가 발생했습니다.");
            setIsSuccess(false);
            setShowMessage(true);
    
            // 3초 후 메시지 숨기기
            setTimeout(() => setShowMessage(false), 3000);
        }
    };    

    const handleAdd = (project) => {
        /*
        const maxId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) : 0;
        const newProject = {
            ...project,
            id: maxId + 1,
        };
        setProjects([...projects, newProject]);
        */
        fetchProjectInfo();
        // 메시지 설정
        setStatusMessage("프로젝트가 성공적으로 등록되었습니다.");
        setIsSuccess(true);
        setShowMessage(true);

        // 3초 후 메시지 숨기기
        setTimeout(() => setShowMessage(false), 3000);
    };

    const handleEdit = (_id) => {
        const projectToEdit = projects.find((project) => project._id === _id);
        console.log("편집할 프로젝트:", projectToEdit);
        setSelectedProject(projectToEdit);
        setIsEditModalOpen(true);
    };
      
    const handleUpdate = (updatedProject) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          )
        );
        fetchProjectInfo();
    
        setStatusMessage("프로젝트가 성공적으로 수정되었습니다.");
        setIsSuccess(true);
        setShowMessage(true);
    
        setTimeout(() => setShowMessage(false), 3000); // 3초 후 메시지 숨김
        setIsEditModalOpen(false); // 수정 모달 닫기
    };

    const handleSelect = (id) => {
        setSelectedProjectId(id); // 선택된 프로젝트 ID 저장
        nextStep(); // 다음 단계로 이동
    };

    const handleReverseOrder = () => {
        setProjects((prevProjects) => [...prevProjects].reverse());
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
                <button className="change" onClick={handleReverseOrder}>
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
