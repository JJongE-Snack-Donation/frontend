import React from "react";
import "../../Styles/Project.css";
import add from "../../Assets/Imgs/btn/project/add.svg";
import change from "../../Assets/Imgs/btn/project/change.svg";

import ProjectTable from "./ProjectTable";


const StepOne = () => {
    return (
        <>
            <div className="project-add-container">
                <button className="add">
                    <img src={add} alt="add" />
                </button>
                <button className="change">
                    <img src={change} alt="change" />
                </button>
            </div>
            <ProjectTable />
        </>
    );
};

export default StepOne;
