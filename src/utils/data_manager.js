import { Project, ToDoItem, createButton } from "./helpers";

function DataManager(user = "test user") {

    // internal project and task list, not exposed
    let inbox = new Project("Inbox", "This is the default project.", "red");
    let projectList = [inbox];//Inbox is default project
    let taskList = [
        new ToDoItem("Test", "test test test!", inbox.projectId, "13.4.1929", "3")
    ];//But task list is empty

    // new tasks
    const addTask = (title, description, project, dueDate, priority) => {
        const newTask = new ToDoItem(title, description, project, dueDate, priority)
        taskList.push(newTask);
    };

    // new project
    const addProject = (title, description, color = "green") => {
        const newProject = new Project(title, description, color);
        projectList.push(newProject);
    };

    // delete task
    const deleteTask = (taskId) => {
        let taskIndex = taskList.findIndex(obj => obj.taskId === taskId)
        taskList.splice(taskIndex, 1);
    }

    // delete project
    const deleteProject = (projectName) => {
        let projectIndex = projectList.findIndex(p => p.title === projectName)
        projectList.splice(projectIndex, 1);
        taskList = taskList.filter(task => task.project !== title);
    };


    // export projects
    const getProjects = () => projectList;

    // export projects
    const getTasks = () => taskList;

    return { addTask, deleteTask, addProject, deleteProject, getProjects, getTasks };
}

export { DataManager };