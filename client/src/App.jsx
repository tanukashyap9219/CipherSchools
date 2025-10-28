import React, { useEffect, useState } from "react";
import FileExplorer from "./components/FileExplorer";
import EditorAndPreview from "./components/EditorAndPreview";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_FILES = {
  "/src/App.jsx": `import React from 'react'\nexport default function App(){\n  return (\n    <div style={{padding:20}}>\n      <h1 style={{fontSize:28}}>Welcome to CipherStudio</h1>\n      <p>Edit files on the left — preview updates live.</p>\n    </div>\n  )\n}`,
  "/src/index.jsx": `import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\ncreateRoot(document.getElementById('root')).render(<App />)`
};

export default function App() {
  const [files, setFiles] = useState(DEFAULT_FILES);
  const [activePath, setActivePath] = useState("/src/App.jsx");
  const [projectId, setProjectId] = useState(null);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("cipherstudio_autosave");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.files) {
          setFiles(parsed.files);
          setProjectId(parsed.projectId || null);
        }
      } catch (e) {}
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!autosaveEnabled) return;
    const id = setInterval(() => {
      const payload = { projectId, files };
      localStorage.setItem("cipherstudio_autosave", JSON.stringify(payload));
    }, 3000);
    return () => clearInterval(id);
  }, [files, projectId, autosaveEnabled]);

  const createFile = (path) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    if (files[p]) return alert("file exists");
    setFiles((prev) => ({ ...prev, [p]: "// new file" }));
    setActivePath(p);
  };

  const deleteFile = (path) => {
    const copy = { ...files };
    delete copy[path];
    setFiles(copy);
    const keys = Object.keys(copy);
    setActivePath(keys[0] || null);
  };

  const updateFile = (path, code) => {
    setFiles((prev) => ({ ...prev, [path]: code }));
  };

  const saveToLocal = () => {
    const id = projectId || uuidv4();
    const payload = { projectId: id, files };
    localStorage.setItem(`cipherstudio_project_${id}`, JSON.stringify(payload));
    localStorage.setItem("cipherstudio_autosave", JSON.stringify(payload));
    setProjectId(id);
    alert(`Saved project ${id}`);
  };

  const saveToServer = async () => {
    try {
      const id = projectId || uuidv4();
      const payload = { projectId: id, files };
      const res = await fetch("http://localhost:4000/api/projects/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.projectId) {
        setProjectId(data.projectId);
        localStorage.setItem(`cipherstudio_project_${data.projectId}`, JSON.stringify(payload));
        localStorage.setItem("cipherstudio_autosave", JSON.stringify(payload));
        alert("Saved to server: " + data.projectId);
      } else {
        alert("Save failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving to server: " + err.message);
    }
  };

  const loadFromLocal = (id) => {
    const raw = localStorage.getItem(`cipherstudio_project_${id}`);
    if (!raw) return alert("No project found");
    const parsed = JSON.parse(raw);
    setFiles(parsed.files);
    setProjectId(parsed.projectId);
    alert("Loaded project " + id);
  };

  const loadFromServer = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${id}`);
      if (!res.ok) return alert("Project not found on server");
      const data = await res.json();
      if (data && data.files) {
        setFiles(data.files);
        setProjectId(data.projectId);
        localStorage.setItem("cipherstudio_autosave", JSON.stringify({ projectId: data.projectId, files: data.files }));
        alert("Loaded from server: " + data.projectId);
      } else {
        alert("Invalid project data");
      }
    } catch (err) {
      console.error(err);
      alert("Error loading from server: " + err.message);
    }
  };

  const toggleAutosave = () => setAutosaveEnabled(s => !s);
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <div className="app-shell">
      <div className="navbar">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontWeight:700,fontSize:18}}>CipherStudio</div>
          <div style={{color:'#9fb0c8'}}>Browser-based React IDE (MVP)</div>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button className="btn px-3 py-1 bg-indigo-600 rounded" onClick={saveToLocal}>Save (Local)</button>
            <button className="btn px-3 py-1 bg-emerald-500 rounded" onClick={saveToServer}>Save (Server)</button>
            <button className="btn px-2 py-1 bg-slate-700 rounded" onClick={()=>{ const id = prompt('Load local project id'); if(id) loadFromLocal(id); }}>Load (Local)</button>
            <button className="btn px-2 py-1 bg-slate-700 rounded" onClick={()=>{ const id = prompt('Load server project id'); if(id) loadFromServer(id); }}>Load (Server)</button>
          </div>
        </div>
      </div>

      <div className="main-area">
        <div className="sidebar">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <div style={{fontWeight:600}}>Files</div>
            <div style={{color:'var(--muted)', fontSize:12}}>{projectId ? `ID: ${projectId}` : 'No project'}</div>
          </div>

          <div style={{marginBottom:10}}>
            <FileExplorer files={files} createFile={createFile} deleteFile={deleteFile} setActivePath={setActivePath} activePath={activePath} />
          </div>
        </div>

        <div className="editor-card">
          <EditorAndPreview files={files} activePath={activePath} updateFile={updateFile} />
        </div>

        <div className="preview-card">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <div style={{fontWeight:600}}>Preview</div>
            <div style={{color:'var(--muted)', fontSize:12}}>Live output</div>
          </div>
          <div className="preview-frame">
            {/* If Sandpack renders its own preview, it will appear in the editor area.
                This frame is a styled container to match the design. */}
          </div>
        </div>
      </div>
    </div>
  );
}
