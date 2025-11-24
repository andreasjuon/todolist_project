console.log("Starting the todolist script, mate!")
import "./styles.css";


class Project {
    constructor(title, description, color) {
        this.title = title;
        this.description = description;
        this.color = color;
    }

}
class ToDoItem {
    constructor(title, description, project, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
    }

    //method to extend due date

    //method to mark as in/complete
}