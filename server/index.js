// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const projectRoutes = require("./src/routes/projectRoutes");
const Project = require("./src/models/Project"); // fixed import



const app = express();
app.use(cors());
app.use(bodyParser.json());
const connectDB = require("./src/config/db");

// hook routes

connectDB(process.env.MONGO_URI);
app.use('/api/projects', projectRoutes);



// health
app.get("/", (req, res) => res.json({ ok: true, message: "CipherStudio server" }));

// test MongoDB route
app.get("/api/test-db", async (req, res) => {
  try {
    const project = new Project({
      projectId: "test123",
      name: "Test Project",
      files: [
        { filename: "App.js", content: "console.log('Hello from test')" },
      ],
    });

    await project.save();
    const projects = await Project.find();
    res.json({ message: "Database Connected ✅", projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database Error ❌", error });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`CipherStudio server running on ${PORT}`));
