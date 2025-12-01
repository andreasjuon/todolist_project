
class Project {
    constructor(title, description, color, id = "none", visible = "none") {
        this.title = title;
        this.description = description;
        this.color = color;
        if (id === "none") {
            this.projectId = crypto.randomUUID();
        }
        else this.projectId = id;
        if (visible === "none") {
            this.visible = true;
        }
        else this.visible = visible;
    };
    
}

class ToDoItem {
    constructor(title, description, project, dueDate, priority, id) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.complete = false;
        if (id === "none") {
            this.taskId = crypto.randomUUID();
        }
        else this.taskId = id;
    }
}

function createButton(className, text) {
    const btn = document.createElement("button");
    btn.className = className;
    btn.textContent = text;
    return btn;
}

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

function saveToStorage(object, name, type = "localStorage") {
    if (storageAvailable(type)) {
        console.log("local storage")
        window[type].setItem(name, JSON.stringify(object));
    } else {
        return// Too bad, no localStorage for us
    }
}

function loadFromStorage(name, type = "localStorage") {
    if (storageAvailable(type)) {
        const data = window[type].getItem(name);
        if (data) {
            return JSON.parse(data); // Convert JSON string back to object
        }
    }
    return null; // Return null if nothing found
}






export { Project, ToDoItem, createButton, storageAvailable, saveToStorage, loadFromStorage };

