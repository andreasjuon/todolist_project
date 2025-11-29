//TODO DESIGN:
//Better design for tasks and projects
//automatic styling depending on importance

//TODO FUNCTIONALITY
//Complete button functionality for tasks
//Edit functionality for tasks and projects (maybe save current contents, replace by user form if necessary, then add task and delete old task?)
//Filter functionality for display

import "./styles.css";
import { Project, ToDoItem, createButton } from "./utils/helpers";
import { DataManager } from "./utils/data_manager";
import { Displayer } from "./utils/displayer";

const toggleButton = document.getElementById("toggleSidebar");
toggleButton.addEventListener("click", () => {
    if (projectTasks.classList.contains("sidebar-open")) {
        projectTasks.classList.replace("sidebar-open", "sidebar-closed");
    } else if (projectTasks.classList.contains("sidebar-closed")) {
        projectTasks.classList.replace("sidebar-closed", "sidebar-open");
    } else {
        // fallback: if neither class exists, open sidebar
        projectTasks.classList.add("sidebar-open");
    }
});



document.addEventListener("DOMContentLoaded", () => {

    const DOM = {
        projectDisplay: document.querySelector("#projectList"),
        taskDisplay: document.querySelector("#taskList"),
        addTaskButton: document.querySelector("button#addTask"),
        addTaskDialog: document.querySelector("#add_task_dialog"),
        addTaskForm: document.querySelector("#add_task_form"),
        titleInputAdd: document.querySelector("#add_title"),
        descriptionInputAdd: document.querySelector("#add_description"),
        dueDateInputAdd: document.querySelector("#add_duedate"),
        priorityInputAdd: document.querySelector("#add_priority"),
        selectProjectDropdown: document.querySelector("select#select_project"),
        cancelTaskButton: document.querySelector("#cancelTask"),
        newProjectInput: document.querySelector("#new_project_input"),
        addProjectButton: document.querySelector("button#addProject"),
        addProjectDialog: document.querySelector("#add_project_dialog"),
        addProjectForm: document.querySelector("#add_project_form"),
        ProjectTitleInputAdd: document.querySelector("#add_project_title"),
        ProjectDescriptionInputAdd: document.querySelector("#add_project_description"),
        projectColorInputAdd: document.querySelector("#add_project_color"),
        cancelProjectButton: document.querySelector("#cancelProject")
    };

    const formManipulator = {
        clearTaskForm: function() {
            DOM.titleInputAdd.value = "";
            DOM.descriptionInputAdd.value = "";
            DOM.newProjectInput.value = "";
            DOM.selectProjectDropdown.selectedIndex = 0;
            DOM.dueDateInputAdd.value = "";
        },
        clearProjectForm: function() {
            DOM.ProjectTitleInputAdd.value = "";
            DOM.ProjectDescriptionInputAdd.value = "";
            DOM.projectColorInputAdd.value = ""
        }
    }
    

    // Initialization
    window.userProject = DataManager();
    window.userDisplayer = Displayer(window.userProject); 
    window.userDisplayer.displayProjects(window.userProject.getProjects(), DOM.projectDisplay)
    window.userDisplayer.displayTasks(window.userProject.getTasks(), DOM.taskDisplay)
    console.log(window.userProject.getTasks())

    // Removing tasks
    DOM.taskDisplay.addEventListener("click", (e) => {
        const taskToModify = e.target;
        const taskToModifyID = taskToModify.parentElement.dataset.taskId;
        if (taskToModify.className === "remove") {
            window.userProject.deleteTask(taskToModifyID);
        }
        if (taskToModify.className === "done") {
            if (index !== -1) myLibrary[index].toggleRead();
        }
        window.userDisplayer.displayTasks(window.userProject.getTasks(), DOM.taskDisplay);
    })

    // Adding Task
    function populateProjectDropdown(projectList, dropdown) {
        dropdown.innerHTML = `<option value="" selected disabled>Select an existing project</option>`;
        projectList.forEach(project => {
            const option = document.createElement("option");
            option.value = project.projectId; // store ID
            option.textContent = project.title; // display title
            dropdown.appendChild(option);
        });
    }
    DOM.addTaskButton.addEventListener("click", (e) => {
        DOM.addTaskDialog.showModal();
        populateProjectDropdown(window.userProject.getProjects(), DOM.selectProjectDropdown);
    })
    DOM.addTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = DOM.titleInputAdd.value.trim();
        const description = DOM.descriptionInputAdd.value.trim();
        const dueDate = DOM.dueDateInputAdd.value;
        const priority = DOM.priorityInputAdd.value;
        let projectId;
        if (DOM.newProjectInput.value.trim() !== "") {
            // User entered a new project
            const newTitle = DOM.newProjectInput.value.trim();
            // Check if project with this title already exists
            let existing = window.userProject.getProjects().find(p => p.title === newTitle);
            if (!existing) {
                window.userProject.addProject(newTitle, "Added from task", "blue");
                existing = window.userProject.getProjects().find(p => p.title === newTitle);
            }
            projectId = existing.projectId;
        } else {
            // Use selected existing project - need to find by title
            const selectedTitle = DOM.selectProjectDropdown.value;
            const selectedProject = window.userProject.getProjects().find(p => p.title === selectedTitle);
            projectId = selectedProject ? selectedProject.projectId : window.userProject.getProjects()[0].projectId; // fallback to Inbox
        }
        // Add task using project ID
        window.userProject.addTask(title, description, projectId, dueDate, priority);
        // Refresh display
        window.userDisplayer.displayTasks(window.userProject.getTasks(), DOM.taskDisplay);
        window.userDisplayer.displayProjects(window.userProject.getProjects(), DOM.projectDisplay);
        // Clear form
        formManipulator.clearTaskForm();
        DOM.addTaskDialog.close();
    });
    DOM.cancelTaskButton.addEventListener("click", (e) => {
        formManipulator.clearTaskForm();
        DOM.addTaskDialog.close();
    });

    // Adding Project
    DOM.addProjectButton.addEventListener("click", (e) => {
        DOM.addProjectDialog.showModal();
    })
    DOM.addProjectForm.addEventListener("submit", (event) => {
        event.preventDefault();
        window.userProject.addProject(
            DOM.ProjectTitleInputAdd.value,
            DOM.ProjectDescriptionInputAdd.value,
            DOM.projectColorInputAdd.value
        );
        window.userDisplayer.displayProjects(window.userProject.getProjects(), DOM.projectDisplay);
        formManipulator.clearProjectForm();
        DOM.addProjectDialog.close();
    });
    DOM.cancelProjectButton.addEventListener("click", (e) => {
        formManipulator.clearProjectForm();
        DOM.addProjectDialog.close();
    });

});
