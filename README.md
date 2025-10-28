# CipherStudio — Browser-based React IDE (MVP)

**CipherStudio** is a browser-based React IDE that allows users to create/manage multiple files, write React components, run code live in the browser, and save/load projects. Built as an MVP using React, Vite, Sandpack, and an Express + MongoDB backend.

---

## Live demo
- Frontend (Vercel): *[add link after deploy]*
- Backend (Render/Railway): *[add link after deploy]*

---

## Features (Implemented)
**Core (Required)**
- File Management: Create, delete files. Basic file list explorer.
- Code Editor: Sandpack-based editor for React code.
- Live Preview: Real-time preview of the running React project.
- Save & Load Projects: Save locally (localStorage) and to backend (MongoDB via API).
- Clean UI: Minimal and clear layout, responsive on desktop/tablet.

**Optional / Bonus**
- Save to server (MongoDB Atlas) + load by `projectId`.
- Autosave to localStorage (configurable).
- Basic theme-friendly UI (Tailwind classes), minimal CSS.

---

## Tech Stack
- Frontend: React + Vite, Tailwind (utility CSS)
- Code Execution: @codesandbox/sandpack-react
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Deployment: Frontend — Vercel; Backend — Render / Railway

---

## Project structure
