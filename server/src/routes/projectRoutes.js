// server/routes/projectRoutes.js
const express = require('express');


const store = {};

router.post('/save', (req, res) => {
  const { projectId, files } = req.body;
  const id = projectId || Math.random().toString(36).slice(2, 9);
  store[id] = { projectId: id, files, updatedAt: new Date().toISOString() };
  res.json({ ok: true, projectId: id });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  if (!store[id]) return res.status(404).json({ ok: false, message: 'Not found' });
  res.json(store[id]);
});



const router = express.Router();
const { createProject, getProjects, deleteProject } = require("../controllers/projectController");

router.post("/", createProject);
router.get("/", getProjects);
router.delete("/:id", deleteProject);

module.exports = router;
