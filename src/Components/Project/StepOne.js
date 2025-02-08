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
    

    const handleDelete = async(_id) => {
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

    const handleAdd = () => {
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
      
    const handleUpdate = async (updatedProject) => {
        console.log("수정할 프로젝트:", updatedProject);
        try {
            // API 호출 (수정 요청)
            const response = await api.put(`/project/${updatedProject._id}`, updatedProject, {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                }
            });
    
            // 서버로부터 수정된 프로젝트 데이터 가져오기
            const updatedData = response.data.data.project;
    
            // 상태 업데이트 및 project.id 덮어쓰기
            setProjects((prevProjects) =>
                prevProjects.map((project) => {
                    if (project._id === updatedData._id) {
                        return { ...updatedData, id: updatedProject.id };  // project.id를 유지
                    }
                    return project;
                })
            );
    
            // 성공 메시지 출력
            setStatusMessage("프로젝트가 성공적으로 수정되었습니다.");
            setIsSuccess(true);
            setShowMessage(true);
    
            setTimeout(() => setShowMessage(false), 3000); // 3초 후 메시지 숨김
            setIsEditModalOpen(false); // 수정 모달 닫기
        } catch (error) {
            // 500 에러 처리 및 상태 메시지 설정
            if (error.response && error.response.status === 500) {
                setStatusMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.");
            } else if (error.response && error.response.status === 400) {
                setStatusMessage("잘못된 요청입니다. 입력 데이터를 확인하세요.");
            } else {
                setStatusMessage("프로젝트 수정 중 오류가 발생했습니다.");
            }
    
            console.error("프로젝트 수정 실패:", error);
            setIsSuccess(false);
            setShowMessage(true);
    
            setTimeout(() => setShowMessage(false), 3000); // 3초 후 메시지 숨김
        }
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
