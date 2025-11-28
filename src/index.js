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
        this.taskID = crypto.randomUUID();
    }
}

// EventManager: manages events that affect the project and todo lists; and can provide these lists
function EventManager(user = "test user"){

    // internal project and task list, not exposed
    let projectList = [
        new Project("Inbox", "This is the default project.", "red")
    ];//Inbox is default project
    let taskList = [
        new ToDoItem("Test", "test test test!", "Inbox", "13.4.1929", "3")
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

    // export projects
    const getProjects = () => projectList;

    // export projects
    const getTasks = () => taskList;

    return { addTask, deleteTask, addProject, deleteProject, getProjects, getTasks };
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

                if (key === "taskID") {
                    task.dataset.taskID = value;
                }
                if (key === "taskID" || key === "info") continue;
                const el = document.createElement("p");
                el.className = key;       // e.g., 'author', 'title', etc.
                el.textContent = value;
                if (key === "complete" && value === true) { el.textContent = "Task complete!" }
                if (key === "complete" && value === false) { el.textContent = "Task not yet complete!" }
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
                if (key === "projectID") {
                    project.dataset.projectID = value;
                }
                if (key === "projectID" || key === "info") continue;
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
            //add done button
            let doneButton = document.createElement("button");
            doneButton.className = "done";
            if (item.complete === true) { doneButton.textContent = "Not complete"; project.classList.add("complete"); };
            if (item.complete === false) { doneButton.textContent = "Complete"; project.classList.add("incomplete"); };
            project.appendChild(doneButton);
            //add project to projectlist
            projectDisplay.appendChild(project);
        })

    }

    return { displayTasks, displayProjects }

    }

document.addEventListener("DOMContentLoaded", () => {

    // Reading DOM
    const addTaskButton = document.querySelector("button#addTask");
    const addTaskDialog = document.querySelector("#add_task_dialog");
    const projectDisplay = document.querySelector("#projectList");
    const taskDisplay = document.querySelector("#taskList");

    // Initialization

    window.userProject = EventManager();
    window.userDisplayer = Displayer(window.userProject); 
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

    const addTaskForm = document.querySelector("#add_task_form")
    const titleInputAdd = document.querySelector("#add_title");
    const descriptionInputAdd = document.querySelector("#add_description");
    const projectInputAdd = document.querySelector("#select_project");
    const dueDateInputAdd = document.querySelector("#add_duedate");
    const priorityInputAdd = document.querySelector("#add_priority");

    addTaskButton.addEventListener("click", (e) => {
        addTaskDialog.showModal();
        //window.userProject.addTask()
    })

    addTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        window.userProject.addTask(
            titleInputAdd.value,
            descriptionInputAdd.value,
            projectInputAdd.value,
            dueDateInputAdd.value,
            priorityInputAdd.value
        );
        window.userDisplayer.displayTasks(window.userProject.getTasks(), taskDisplay)
        addTaskDialog.close();
    });
});








/*
const displayTasks = (displayList) =>{
        displayList.forEach(task => {

            const taskDiv = document.createElement("div");

            for (const [key, value] of Object.entries(task)){
                const el = document.createElement("p");
                el.textContent = value;
                el.classList.add(key);
                taskDiv.appendChild(el);
            }

            const removeButton = document.createElement("button");
            removeButton.className = "remove";
            removeButton.textContent = "Remove";
            taskDiv.appendChild(removeButton);

            const toggleCompleteButton = document.createElement("button");
            toggleCompleteButton.className = "complete";
            toggleCompleteButton.textContent = "Complete";
            taskDiv.appendChild(toggleCompleteButton);

            DisplayedTaskList.appendChild(taskDiv);

        })

    }
*/

/*
// displaying tasks
const filterTasks = (filterList) => {

    // empty displayList
    let displayList = [];

    // select tasks that satisfy all filters
    taskList.forEach(task => {
        // Check against all filters
        const passesAnyFilter = filterList.every(filterFn => filterFn(task));//returns true if task passes all filters
        if (passesAnyFilter) {
            displayList.push(task);
        }
    })

    return displayList;
}
*/

/*
const DisplayedTaskList = document.querySelector(".taskList");
// Initialize Lists
let filterList = [
    task => task.complete === false// by default: only display tasks that are incomplete
];//list of all filters applied to display

// Initialize empty display
const events = EventManager();
const tasksFiltered = events.filterTasks(filterList);
events.displayTasks(tasksFiltered);

console.log(events.taskList)
//events.addTask("Do the laundry", "Have to do laundry, both 40 and 60C", "Household", "1.1.1989", "4")
//events.displayTasks(events.filterTasks())
*/