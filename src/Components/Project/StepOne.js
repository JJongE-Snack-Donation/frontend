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
            <ProjectTable/>
            <Modal 
            isOpen={isModalOpen} 
            onClose={closeModal}
            account={account}
            email={email}
            />
        </>
    );
};

export default StepOne;
