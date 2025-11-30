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
    const addProject = (title, description, color = "green", id = "none") => {
        const newProject = new Project(title, description, color, id);
        projectList.push(newProject);
    };

    // delete task
    const deleteTask = (taskId) => {
        let taskIndex = taskList.findIndex(obj => obj.taskId === taskId)
        taskList.splice(taskIndex, 1);
    }

    // delete project and all its tasks
    const deleteProject = (projectID, ask = true, removeTasks = true) => {
        let projectIndex = projectList.findIndex(obj => obj.projectId === projectID);

        if (projectIndex < 0 || projectIndex >= projectList.length) return; 

        const projectToDelete = projectList[projectIndex];
        console.log(projectToDelete)
    
        // Confirm with user
        if (ask) {
            const confirmed = confirm(
                `Are you sure you want to delete project "${projectToDelete.title}"?\n` +
                `This will ALSO delete all tasks in that project.`
            );

            if (!confirmed) return;
        }

        projectList.splice(projectIndex, 1);
        
        if (removeTasks) {
            taskList = taskList.filter(task => task.project !== projectID);
        }

    };

    // in/complete task
    const toggleCompleteTask = (taskId) => {
        let taskIndex = taskList.findIndex(obj => obj.taskId === taskId)
        taskList[taskIndex].complete = taskList[taskIndex].complete ? false: true;
    }


    // export projects
    const getProjects = () => projectList;

    // export projects
    const getTasks = () => taskList;

    return { addTask, deleteTask, toggleCompleteTask, addProject, deleteProject, getProjects, getTasks };
}

export { DataManager };