const express = require("express");
const server = express();
const projects = [];
let requisition_count = 0;

server.use(express.json());

function checkIdProjectExists(req, res, next) {
  let projectExists = false;
  if (req.params.id) {
    projects.map(project => {
      if (project.id == req.params.id) {
        projectExists = true;

        next();
      }
    });

    if (!projectExists) {
      return res.status(400).json({ error: "Project does not exists!" });
    }
  }

  return res.status(400).json({ error: "Project ID is require!" });
}

function requisitionCount(req, res, next) {
  console.log(++requisition_count);
  next();
}

server.get("/projects", requisitionCount, (req, res) => {
  return res.json(projects);
});

server.put(
  "/projects/:id",
  requisitionCount,
  checkIdProjectExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects.map(project => {
      if (project.id == id) {
        project.title = title;
        return res.json(project);
      }
    });

    return res.json(projects);
  }
);

server.post("/projects", requisitionCount, (req, res) => {
  projectExists = false;

  if (req.body.id && req.body.title) {
    projects.map(project => {
      if (project.id == req.body.id) {
        projectExists = true;

        return res.status(400).json({ error: "Project already exists!" });
      }
    });

    if (!projectExists) {
      projects.push(req.body);
      return res.json(projects);
    }
  }

  return res.status(400).json({ error: "Project ID and TITLE is require!" });
});

server.delete(
  "/projects/:id",
  requisitionCount,
  checkIdProjectExists,
  (req, res) => {
    const { id } = req.params;

    projects.forEach((project, index) => {
      if (project.id == id) {
        projects.splice(index, 1);
      }
    });

    return res.json(projects);
  }
);

server.post(
  "/projects/:id/tasks",
  requisitionCount,
  checkIdProjectExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects.map(project => {
      if (project.id == id) {
        project.tasks.push(title);
        return res.json(project);
      }
    });

    return res.json(projects);
  }
);

// Define a porta que será escultda
server.listen(3000);
