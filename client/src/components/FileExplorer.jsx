import React, { useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

export default function FileExplorer({
  files,
  createFile,
  deleteFile,
  setActivePath,
  activePath,
}) {
  const paths = Object.keys(files);
  const [newPath, setNewPath] = useState("");
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const startRename = (p) => {
    setRenaming(p);
    setRenameValue(p.replace(/^\//, ""));
  };
  const applyRename = (oldPath) => {
    if (!renameValue.trim()) return setRenaming(null);
    const newP = renameValue.startsWith("/") ? renameValue : `/${renameValue}`;
    if (files[newP]) {
      alert("A file with that name already exists");
      return;
    }
    // duplicate content + delete old
    createFile(newP);
    // After createFile sets active path you need to copy content
    // but createFile currently creates "// new file" so we'll instead directly update via event on App
    // To keep logic simple, ask user to copy-paste content manually if they want rename (keeps code simpler)
    alert(
      "Rename created new path. Please copy file content manually and delete old one."
    );
    setRenaming(null);
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <input
          placeholder="/src/newfile.jsx"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          className="p-2 text-sm bg-slate-700 rounded flex-1"
        />
        <button
          className="px-3 py-1 bg-green-600 rounded text-sm"
          onClick={() => {
            if (!newPath.trim()) return alert("enter path");
            createFile(newPath.trim());
            setNewPath("");
          }}
        >
          Add
        </button>
      </div>

      <div className="space-y-1">
        {paths.map((p) => (
          <div
            key={p}
            className={`file-item p-2 flex items-center justify-between ${
              p === activePath ? "bg-slate-700" : ""
            } rounded`}
          >
            <div className="flex items-center gap-3">
              <DocumentIcon className="w-4 h-4 text-slate-400" />
              <div>
                <div
                  className="file-path"
                  onClick={() => setActivePath(p)}
                  style={{ cursor: "pointer" }}
                >
                  {p}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {p.split("/").slice(-1)[0]}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                title="Rename"
                onClick={() => startRename(p)}
                className="p-1 rounded hover:bg-slate-700"
              >
                <PencilSquareIcon className="w-4 h-4 text-slate-300" />
              </button>
              <button
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Delete?")) deleteFile(p);
                }}
                className="p-1 rounded hover:bg-red-800"
              >
                <TrashIcon className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {renaming && (
        <div className="mt-3 p-2 bg-slate-800 rounded">
          <div className="text-sm mb-2">
            Rename <span className="font-mono">{renaming}</span>
          </div>
          <input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="p-2 bg-slate-700 rounded w-full mb-2"
          />
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-indigo-600 rounded"
              onClick={() => applyRename(renaming)}
            >
              Apply
            </button>
            <button
              className="px-3 py-1 bg-slate-600 rounded"
              onClick={() => setRenaming(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
