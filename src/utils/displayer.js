import { Project, ToDoItem, createButton } from "./helpers"; 

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
            const task = document.createElement("div");
            task.className = "task";
            for (const [key, value] of Object.entries(item)) {

                const el = document.createElement("p");

                // do not display taskId but store it
                if (key === "taskId") {
                    task.dataset.taskId = value;
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
            task.appendChild(createButton("remove", "Remove"));
            task.appendChild(createButton("done", item.complete ? "Not complete" : "Complete"));
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

export { Displayer }