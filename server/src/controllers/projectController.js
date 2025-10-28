// server/controllers/projectController.js
// Simple in-memory store. Replace with DB calls later.
const store = {};
const Project = require("../models/Project");
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.saveProject = (req, res) => {
  const { projectId, files } = req.body;
  if (!files || typeof files !== "object") {
    return res.status(400).json({ ok: false, message: "Missing files object" });
  }
  const id = projectId || Math.random().toString(36).slice(2, 9);
  store[id] = { projectId: id, files, updatedAt: new Date().toISOString() };
  return res.json({ ok: true, projectId: id });
};

exports.getProjectById = (req, res) => {
  const id = req.params.id;
  if (!store[id]) return res.status(404).json({ ok: false, message: "Not found" });
  return res.json(store[id]);
};

exports.listProjects = (req, res) => {
  const list = Object.keys(store).map((k) => ({
    projectId: k,
    updatedAt: store[k].updatedAt
  }));
  res.json({ ok: true, projects: list });
};
