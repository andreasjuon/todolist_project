//TODO DESIGN:
//Better design for tasks and projects
//automatic styling depending on importance

//TODO FUNCTIONALITY
//Filter functionality for display; if show complete true -> remove that filter to false; if unchecked add again; also add checkbox for each project. if unchecked, add filter that removes this project from view
//Pubsub?

import "./styles.css";
import { Project, ToDoItem, createButton } from "./utils/helpers";
import { DataManager } from "./utils/data_manager";
import { Displayer } from "./utils/displayer";




document.addEventListener("DOMContentLoaded", () => {

    const DOM = {
        toggleButton: document.getElementById("toggleSidebar"),
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
        cancelProjectButton: document.querySelector("#cancelProject"),
        changeSettingsButton: document.querySelector("#changeSettings"),
        settingsDialog: document.querySelector("#settings_dialog"),
        closeSettingsButton: document.querySelector("#closeSettings"),
        showCompleteCheckbox: document.querySelector("#showComplete")
    };

    DOM.toggleButton.addEventListener("click", () => {
        if (projectTasks.classList.contains("sidebar-open")) {
            projectTasks.classList.replace("sidebar-open", "sidebar-closed");
        } else if (projectTasks.classList.contains("sidebar-closed")) {
            projectTasks.classList.replace("sidebar-closed", "sidebar-open");
        } else {
            // fallback: if neither class exists, open sidebar
            projectTasks.classList.add("sidebar-open");
        }
    });

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

    // Removing task or toggling complete or editing
    DOM.taskDisplay.addEventListener("click", (e) => {

        const pressedButton = e.target;
        console.log(pressedButton);
        const taskToModifyID = pressedButton.parentElement.dataset.taskId;

        if (pressedButton.className === "remove") {
            window.userProject.deleteTask(taskToModifyID);
        }

        if (pressedButton.className === "toggleComplete") {
            console.log("Toggling complete");
            window.userProject.toggleCompleteTask(taskToModifyID);
        }

        if (e.target.classList.contains("edit")) {
            const task = window.userProject.getTasks().find(t => t.taskId === taskToModifyID);
            if (!task) return;
            // Populate form
            DOM.titleInputAdd.value = task.title;
            DOM.descriptionInputAdd.value = task.description;
            DOM.dueDateInputAdd.value = task.dueDate;
            DOM.priorityInputAdd.value = task.priority;
            DOM.selectProjectDropdown.value = task.project; // project ID
            // Populate dropdown
            populateProjectDropdown(window.userProject.getProjects(), DOM.selectProjectDropdown);
            DOM.selectProjectDropdown.value = task.project; // preselect project ID
            // Remove the original task (edit = delete + add)
            window.userProject.deleteTask(taskToModifyID);
            // Open the Add Task dialog
            DOM.addTaskDialog.showModal();
        }

        window.userDisplayer.displayProjects(window.userProject.getProjects(), DOM.projectDisplay);
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
            //const selectedTitle = DOM.selectProjectDropdown.value;
            //const selectedProject = window.userProject.getProjects().find(p => p.title === selectedTitle);
            //projectId = selectedProject ? selectedProject.projectId : window.userProject.getProjects()[0].projectId; // fallback to Inbox

            projectId = DOM.selectProjectDropdown.value || window.userProject.getProjects()[0].projectId;


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
            DOM.projectColorInputAdd.value,
            DOM.addProjectDialog.dataset.projectId
        );
        window.userDisplayer.displayProjects(window.userProject.getProjects(), DOM.projectDisplay);
        window.userDisplayer.displayTasks(window.userProject.getTasks(), DOM.taskDisplay);
        formManipulator.clearProjectForm();
        DOM.addProjectDialog.dataset.projectId = "none"
        DOM.addProjectDialog.close();
    });
    DOM.cancelProjectButton.addEventListener("click", (e) => {
        formManipulator.clearProjectForm();
        DOM.addProjectDialog.dataset.projectId = "none"
        DOM.addProjectDialog.close();
    });

    // Removing or editing project
    DOM.projectDisplay.addEventListener("click", (e) => {

        const projectToModifyID = e.target.parentElement.dataset.projectID;
        console.log(e.target.parentElement.dataset)

        if (e.target.className === "remove") {
            window.userProject.deleteProject(projectToModifyID);
        }

        if (e.target.classList.contains("edit")) {
            const project = window.userProject.getProjects().find(p => p.projectId === projectToModifyID);

            if (!project) return;
            // Populate form
            DOM.ProjectTitleInputAdd.value = project.title;
            DOM.ProjectDescriptionInputAdd.value = project.description;
            DOM.projectColorInputAdd.value = project.color;

            DOM.addProjectDialog.dataset.projectId = project.projectId;
            // Remove the original project (edit = delete + add)
            window.userProject.deleteProject(projectToModifyID, false, false);
            // Open the Add Task dialog
            DOM.addProjectDialog.showModal();
            
        }

        window.userDisplayer.displayProjects(window.userProject.getProjects(), DOM.projectDisplay);
        window.userDisplayer.displayTasks(window.userProject.getTasks(), DOM.taskDisplay);
    })

    // Changing settings
    DOM.changeSettingsButton.addEventListener("click", (e) => {
        console.log("Settings clicked")
        DOM.settingsDialog.showModal();
    });
    DOM.closeSettingsButton.addEventListener("click", (e) => {
        console.log("Settings clicked")
        DOM.settingsDialog.close();
    })

    // Filtering
    DOM.showCompleteCheckbox.addEventListener("change", (event) => {
        if (event.target.checked) {
            // Remove the filter if present
            const index = window.userDisplayer.filterList.indexOf(window.userDisplayer.incompleteFilter);
            if (index > -1) {
                window.userDisplayer.filterList.splice(index, 1);
            }
        } else {
            // Add the filter if not already present
            if (window.userDisplayer.filterList.indexOf(window.userDisplayer.incompleteFilter) === -1) {
                window.userDisplayer.filterList.push(window.userDisplayer.incompleteFilter);
            }
        }
        // Re-render tasks after filter change
        window.userDisplayer.displayTasks(window.userProject.getTasks(), DOM.taskDisplay);
    });


    // Checkbox for projects
    /*
    DOM.projectDisplay.addEventListener('click', (e) => {
        if (e.target.matches('.projectVisibleCheckbox')) {
            const projectId = e.target.dataset.projectId;
            console.log(projectId)
            window.userProject.toggleProjectVisibility(projectId);
            
            const filterStr = `task => task.project !== "${projectId}"`;
            const invisibleFilter = new Function('return ' + filterStr)()
            
            
            console.log(invisibleFilter);

            if (e.target.checked) {
                // If checked, remove the filter (show project)
                window.userDisplayer.filterList = window.userDisplayer.filterList.filter(
                    fn => fn.toString() !== invisibleFilter.toString()
                );
            } else {
                // If unchecked, add the filter (hide project)
                window.userDisplayer.filterList.push(invisibleFilter);
            }

            // Re-render tasks
            window.userDisplayer.displayProjects(window.userProject.getProjects(), DOM.projectDisplay);
            window.userDisplayer.displayTasks(window.userProject.getTasks(), DOM.taskDisplay);
        }
    });
    */

    /*
    const projectFilters = new Map();

    DOM.projectDisplay.addEventListener('click', (e) => {
        if (e.target.matches('.projectVisibleCheckbox')) {
            const projectId = e.target.dataset.projectId;
            console.log(projectId);
            window.userProject.toggleProjectVisibility(projectId);

            if (e.target.checked) {
                // If checked, remove the filter (show project)
                const filterToRemove = projectFilters.get(projectId);
                if (filterToRemove) {
                    window.userDisplayer.filterList = window.userDisplayer.filterList.filter(
                        fn => fn !== filterToRemove
                    );
                    projectFilters.delete(projectId);
                }
            } else {
                // If unchecked, add the filter (hide project)
                const invisibleFilter = task => task.project !== projectId;
                window.userDisplayer.filterList.push(invisibleFilter);
                projectFilters.set(projectId, invisibleFilter);
            }

            // Re-render tasks
            window.userDisplayer.displayProjects(window.userProject.getProjects(), DOM.projectDisplay);
            window.userDisplayer.displayTasks(window.userProject.getTasks(), DOM.taskDisplay);
        }
    });
    */
    const projectFilters = new Map();
    DOM.projectDisplay.addEventListener('click', (e) => {
        if (e.target.matches('.projectVisibleCheckbox')) {
            const projectId = e.target.dataset.projectId;
        
            window.userProject.toggleProjectVisibility(projectId);

            if (e.target.checked) {
                // If checked, remove the filter (show project)
                const filterToRemove = projectFilters.get(projectId);
                if (filterToRemove) {
                    const index = window.userDisplayer.filterList.indexOf(filterToRemove);
                    if (index > -1) {
                        window.userDisplayer.filterList.splice(index, 1); // Modify in-place
                    }
                    projectFilters.delete(projectId);
                }
            } else {
                // If unchecked, add the filter (hide project)
                const invisibleFilter = task => task.project !== projectId;
                window.userDisplayer.filterList.push(invisibleFilter);
                projectFilters.set(projectId, invisibleFilter);
            }
            console.log('Current filterList length:', window.userDisplayer.filterList.length);

            // Re-render tasks
            window.userDisplayer.displayProjects(window.userProject.getProjects(), DOM.projectDisplay);
            window.userDisplayer.displayTasks(window.userProject.getTasks(), DOM.taskDisplay);
        }
    });



});
