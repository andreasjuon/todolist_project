import { Project, ToDoItem, createButton } from "./helpers"; 

function Displayer(app) {

    let displayedTasks = app.getTasks();
    const displayedProjects = app.getProjects();
    let filterList = [
        task => task.complete === false// by default: only display tasks that are incomplete
    ];

    const filterTasks = (tasks, filterList) => {

        // empty displayList
        let displayedTasks = [];

        // select tasks that satisfy all filters
        tasks.forEach(task => {
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
                    if (value) {
                        task.classList.add("complete");
                        task.classList.remove("incomplete");
                        el.textContent = "Task complete!";
                    } else {
                        task.classList.add("incomplete");
                        task.classList.remove("complete");
                        el.textContent = "Task not yet complete!";
                    };
                } else {
                    el.textContent = value;
                }

                el.className = key;
                task.appendChild(el);
            }
            //add remove button
            task.appendChild(createButton("remove", "Remove"));
            task.appendChild(createButton("toggleComplete", item.complete ? "Not complete" : "Complete"));
            task.appendChild(createButton("edit", "Edit"));

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
            project.appendChild(createButton("remove", "Remove"));
            project.appendChild(createButton("edit", "Edit"));
            //add project to projectlist
            projectDisplay.appendChild(project);
        })

    }

    return { displayTasks, filterTasks, displayProjects }

}

export { Displayer }