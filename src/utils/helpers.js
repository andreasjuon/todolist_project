
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

function createButton(className, text) {
    const btn = document.createElement("button");
    btn.className = className;
    btn.textContent = text;
    return btn;
}

export { Project, ToDoItem, createButton };