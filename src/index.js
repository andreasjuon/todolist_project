console.log("Starting the todolist script, mate!")
import "./styles.css";

class Project {
    constructor(title, description, color) {
        this.title = title;
        this.description = description;
        this.color = color;
        this.projectId = crypto.randomUUID();
    }

}

class ToDoItem {
    constructor(title, description, project, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.complete = false;
        this.taskId = crypto.randomUUID();
    }
}

// EventManager: manages events that affect the project and todo lists; and can provide these lists
function EventManager(user = "test user"){

    // internal project and task list, not exposed
    let inbox = new Project("Inbox", "This is the default project.", "red");
    let projectList = [inbox];//Inbox is default project
    let taskList = [
        new ToDoItem("Test", "test test test!", inbox.projectId, "13.4.1929", "3")
    ];//But task list is empty

    // new tasks
    const addTask = (title, description, project, dueDate, priority) =>{
        const newTask = new ToDoItem(title, description, project, dueDate, priority)
        taskList.push(newTask);
    }

    // delete task
    const deleteTask = (taskID) => {
        let taskIndex = taskList.findIndex(obj => obj.taskID === taskID)
        taskList.splice(taskIndex, 1);
    }

    // new project
    const addProject = (title, description, color = "green") => {
        const newProject = new Project(title, description, color);
        projectList.push(newProject);
        };

    // delete project
    const deleteProject = (projectName) => {
        let projectIndex = projectList.findIndex(p => p.title === projectName)
        projectList.splice(projectIndex, 1);
        taskList = taskList.filter(task => task.project !== title);
    }

    // get all projects from task list and repopulate list
    const pullProjectsFromTasks = () => {
        const uniqueProjectTitles = [...new Set(taskList.map(task => task.project))];

        uniqueProjectTitles.forEach(title => {
            // Only add if it doesn't already exist
            if (!projectList.some(p => p.title === title)) {
                projectList.push(new Project(title, "Added from task", "blue")); // default color and description
            }
        });
    };


    // export projects
    const getProjects = () => projectList;

    // export projects
    const getTasks = () => taskList;

    return { addTask, deleteTask, addProject, deleteProject, getProjects, getTasks, pullProjectsFromTasks };
}

// Displayer: Filters these underlying lists, displays them, etc.
function Displayer(app) {

   let displayedTasks = app.getTasks();
   const displayedProjects = app.getProjects();
   let filterList = [
        task => task.complete === false// by default: only display tasks that are incomplete
    ];

   const filterTasks = (filterList) => {

        // empty displayList
       displayedTasks = [];

        // select tasks that satisfy all filters
       app.getTasks().forEach(task => {
            // Check against all filters
            const passesAllFilters = filterList.every(filterFn => filterFn(task));//returns true if task passes all filters
           if (passesAllFilters) {
                displayedTasks.push(task);
            }
        })

       return displayedTasks;
    }
    
    function displayTasks(taskList, taskDisplay) {
        taskDisplay.innerHTML = ""; // clear old content
        taskList.forEach(function (item, index) {
            //create new task
            const task = document.createElement("div");
            task.className = "task";
            //add all attributes except ID and info
            for (const [key, value] of Object.entries(item)) {

                const el = document.createElement("p");

                // do not display taskId but store it
                if (key === "taskId") {
                    task.dataset.taskID = value;
                    continue; // skip adding a <p> for taskId
                }

                // Map project ID to title
                if (key === "project") {
                    const projectObj = window.userProject.getProjects().find(p => p.projectId === value);
                    el.textContent = projectObj ? projectObj.title : "Unknown Project";
                } else if (key === "complete") {
                    el.textContent = value ? "Task complete!" : "Task not yet complete!";
                } else {
                    el.textContent = value;
                }

                el.className = key; 
                task.appendChild(el);
            }
            //add remove button
            let removeButton = document.createElement("button");
            removeButton.className = "remove";
            removeButton.textContent = "Remove";
            task.appendChild(removeButton);
            //add done button
            let doneButton = document.createElement("button");
            doneButton.className = "done";
            if (item.complete === true) { doneButton.textContent = "Not complete"; task.classList.add("complete"); };
            if (item.complete === false) { doneButton.textContent = "Complete"; task.classList.add("incomplete"); };
            task.appendChild(doneButton);
            //add task to tasklist
            taskDisplay.appendChild(task);
        })
    }

    function displayProjects(projectList, projectDisplay) {
        projectDisplay.innerHTML = ""; // clear old content
        projectList.forEach(function (item, index) {
            //create new project
            const project = document.createElement("div");
            project.className = "project";
            //add all attributes except ID and info
            for (const [key, value] of Object.entries(item)) {
                if (key === "projectId") {
                    project.dataset.projectID = value;
                }
                if (key === "projectId" || key === "info") continue;
                const el = document.createElement("p");
                el.className = key;       // e.g., 'author', 'title', etc.
                el.textContent = value;
                project.appendChild(el);
            }
            //add remove button
            let removeButton = document.createElement("button");
            removeButton.className = "remove";
            removeButton.textContent = "Remove";
            project.appendChild(removeButton);
            //add project to projectlist
            projectDisplay.appendChild(project);
        })

    }

    return { displayTasks, displayProjects }

    }



//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


document.addEventListener("DOMContentLoaded", () => {

    const projectDisplay = document.querySelector("#projectList");
    const taskDisplay = document.querySelector("#taskList");

    // Initialization

    window.userProject = EventManager();
    window.userDisplayer = Displayer(window.userProject); 
    window.userDisplayer.displayProjects(window.userProject.getProjects(), projectDisplay)
    window.userDisplayer.displayTasks(window.userProject.getTasks(), taskDisplay)
    console.log(window.userProject.getTasks())

    // Removing projects?

    taskDisplay.addEventListener("click", (e) => {
        const taskToModify = e.target;
        const taskToModifyID = taskToModify.parentElement.dataset.taskID;

        if (taskToModify.className === "remove") {
            window.userProject.deleteTask(taskToModifyID);
        }
        if (taskToModify.className === "done") {
            if (index !== -1) myLibrary[index].toggleRead();
            //continue here. toggle the read status; maybe also adjust CSS so the background color is different or something
        }
        // refresh the view
        window.userDisplayer.displayTasks(window.userProject.getTasks(), taskDisplay);
    })

    // Adding Task?

    function populateProjectDropdown(projectList, dropdown) {
        dropdown.innerHTML = `<option value="" selected disabled>Select an existing project</option>`;
        projectList.forEach(project => {
            const option = document.createElement("option");
            option.value = project.projectId; // store ID
            option.textContent = project.title; // display title
            dropdown.appendChild(option);
        });
    }

    const addTaskButton = document.querySelector("button#addTask");
    const addTaskDialog = document.querySelector("#add_task_dialog");
    const addTaskForm = document.querySelector("#add_task_form");

    const titleInputAdd = document.querySelector("#add_title");
    const descriptionInputAdd = document.querySelector("#add_description");
    //const projectInputAdd = document.querySelector("#select_project");
    const dueDateInputAdd = document.querySelector("#add_duedate");
    const priorityInputAdd = document.querySelector("#add_priority");
    const selectProjectDropdown = document.querySelector("select#select_project");

    addTaskButton.addEventListener("click", (e) => {
        addTaskDialog.showModal();
        console.log("Projects: " + window.userProject.getProjects());
        console.log("selectProjectDropdown" + selectProjectDropdown);
        populateProjectDropdown(window.userProject.getProjects(), selectProjectDropdown);
        console.log("selectProjectDropdown" + selectProjectDropdown);

        //window.userProject.addTask()
    })

    addTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = titleInputAdd.value.trim();
        const description = descriptionInputAdd.value.trim();
        const dueDate = dueDateInputAdd.value;
        const priority = priorityInputAdd.value;
        const newProjectInput = document.querySelector("#new_project_input");

        let projectId;

        if (newProjectInput.value.trim() !== "") {
            // User entered a new project
            const newTitle = newProjectInput.value.trim();

            // Check if project with this title already exists
            let existing = window.userProject.getProjects().find(p => p.title === newTitle);
            if (!existing) {
                window.userProject.addProject(newTitle, "Added from task", "blue");
                existing = window.userProject.getProjects().find(p => p.title === newTitle);
            }
            projectId = existing.projectId;

        } else {
            // Use selected existing project - need to find by title
            const selectedTitle = selectProjectDropdown.value;
            const selectedProject = window.userProject.getProjects().find(p => p.title === selectedTitle);
            projectId = selectedProject ? selectedProject.projectId : window.userProject.getProjects()[0].projectId; // fallback to Inbox
        }

        // Add task using project ID
        window.userProject.addTask(title, description, projectId, dueDate, priority);

        // Refresh display
        window.userDisplayer.displayTasks(window.userProject.getTasks(), taskDisplay);
        window.userDisplayer.displayProjects(window.userProject.getProjects(), projectDisplay);

        // Clear form
        titleInputAdd.value = "";
        descriptionInputAdd.value = "";
        newProjectInput.value = "";
        selectProjectDropdown.selectedIndex = 0;
        addTaskDialog.close();
        //window.userProject.pullProjectsFromTasks()
    });

    // Adding Project?
    const addProjectButton = document.querySelector("button#addProject");
    const addProjectDialog = document.querySelector("#add_project_dialog");
    const addProjectForm = document.querySelector("#add_project_form");

    const ProjectTitleInputAdd = document.querySelector("#add_project_title");
    const ProjectDescriptionInputAdd = document.querySelector("#add_project_description");
    const projectColorInputAdd = document.querySelector("#add_project_color");

    //title, description, color

    addProjectButton.addEventListener("click", (e) => {
        addProjectDialog.showModal();
        //window.userProject.addTask()
    })

    addProjectForm.addEventListener("submit", (event) => {
        event.preventDefault();
        window.userProject.addProject(
            ProjectTitleInputAdd.value,
            ProjectDescriptionInputAdd.value,
            projectColorInputAdd.value
        );
        window.userDisplayer.displayProjects(window.userProject.getProjects(), projectDisplay);
        addProjectDialog.close();
    });



});
