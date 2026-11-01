
import "./styles.css";



class Project {
    constructor(title, desc) {
        this.title = title;
        this.description = desc;
        this.id = crypto.randomUUID();
        this.items = []
    }
    addItem(item) {
        this.items.push(item);
    }

    getItems() {
        return [...this.items];
    }

}

class ListItem {
    constructor(title, description, dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }

}

const savedProjects = JSON.parse(localStorage.getItem("projects"));

let projectlist;

if (savedProjects === null || savedProjects.length === 0) {
    projectlist = [new Project("Default", "Default")];
} else {
    projectlist = savedProjects.map(savedProject => {
        const project = new Project(
            savedProject.title,
            savedProject.description
        );

        project.items = (savedProject.items ?? []).map(savedItem =>
            new ListItem(
                savedItem.title,
                savedItem.description,
                savedItem.dueDate
            )
        );

        return project;
    });
}

var currentproj = projectlist.at(-1);

function localstore() {
    localStorage.setItem("projects", JSON.stringify(projectlist));
}

const newitembutton = document.querySelector("#newitem");

newitembutton.addEventListener("click", () => {
    const title = prompt("Title");
    if (title === null) return;
    const desc = prompt("Description");
    if (desc === null) return;
    const dueDate = prompt("Due date");

    // Don't create an item if the user cancels.
    if (title === null) return;

    const item = new ListItem(title, desc, dueDate);
    currentproj.addItem(item);
    localstore()
    console.log(currentproj.getItems());
    loadproject(currentproj)
});

const newprojbutton = document.querySelector("#newproj");

newprojbutton.addEventListener("click", () => {
    const title = prompt('Title');
    if (title === null) return;
    const desc = prompt("Description");
    if (desc === null) return;
    const proj = new Project(title, desc)
    projectlist.push(proj)
    currentproj = proj
    localstore()
    loadpage()
}
)

function loadpage() {
    loadproject(currentproj)
    loadsidebar()
}

function loadsidebar() {
    const sidebar = document.querySelector(".sidebar")
    sidebar.replaceChildren();

    for (var project of projectlist) {
        const content = document.createElement("div");
        content.classList.add('project');
        content.textContent = project.title;
        sidebar.appendChild(content);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        content.append(deleteButton);
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();

            projectlist = projectlist.filter(
                p => p.id !== project.id
            );

            // If we deleted the current project, select another
            if (currentproj?.id === project.id) {
                currentproj = projectlist.at(-1) ?? null;
            }

            localstore();
            loadpage();
        });
        content.addEventListener("click", () => {
            currentproj = project;
            loadproject(currentproj);
            sidebar.appendChild(content);
        });
    }


}


function loadproject(Project) {
    const listbody = document.querySelector(".listbody");
    listbody.replaceChildren();

    for (const [index,item] of Project.getItems()) {
        console.log(index)
        const content = document.createElement("div");
        content.classList.add('item');
        content.textContent = 'Title: ' + item.title;
        const description = document.createElement("div");
        description.classList.add('Description');
        description.textContent = 'Description: ' + item.description;
        const dueDate = document.createElement("div");
        dueDate.classList.add('DueDate');
        dueDate.textContent = 'DueDate: ' + item.dueDate;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete"
        deleteButton.addEventListener("click", () => {
            Project.items.splice(index, 1);

            localstore();
            loadpage();
        });
        content.appendChild(description);
        content.appendChild(dueDate);
        listbody.appendChild(content);
    }

}
