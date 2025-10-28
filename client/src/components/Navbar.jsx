import React from "react";

export default function Navbar({ projectId, onSaveLocal, onSaveServer, autosaveEnabled, toggleAutosave, theme, toggleTheme }) {
  return (
    <div className="w-full panel p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">CipherStudio</div>
        <div className="text-sm text-slate-400 desktop-only">— Browser React IDE (MVP)</div>
        {projectId && <div className="ml-3 badge desktop-only">ID: {projectId}</div>}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onSaveLocal} className="btn px-3 py-1 bg-indigo-600 rounded text-sm">Save (Local)</button>
        <button onClick={onSaveServer} className="btn px-3 py-1 bg-emerald-500 rounded text-sm">Save (Server)</button>

        <div className="flex items-center gap-2 px-2 py-1 bg-slate-800 rounded">
          <label className="text-sm text-slate-300">Autosave</label>
          <button onClick={toggleAutosave} className={`px-2 py-0.5 rounded text-sm ${autosaveEnabled ? 'bg-green-600' : 'bg-slate-700'}`}>
            {autosaveEnabled ? 'On' : 'Off'}
          </button>
        </div>

        <button onClick={toggleTheme} className="btn px-2 py-1 bg-slate-700 rounded text-sm">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
      </div>
    </div>
  );
}
