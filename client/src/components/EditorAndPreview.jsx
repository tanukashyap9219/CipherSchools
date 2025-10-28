import React from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

export default function EditorAndPreview({ files, activePath, updateFile }) {
  const sandpackFiles = {};
  Object.keys(files).forEach((k) => {
    sandpackFiles[k.replace(/^[\\/]/, "")] = files[k];
  });

  if (!sandpackFiles["src/index.jsx"]) {
    sandpackFiles["src/index.jsx"] = files["/src/index.jsx"] || `import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\ncreateRoot(document.getElementById('root')).render(<App />)`;
  }
  if (!sandpackFiles["src/App.jsx"]) {
    sandpackFiles["src/App.jsx"] = files["/src/App.jsx"] || `export default function App(){ return <div>Hi</div> }`;
  }

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column'}}>
      <div style={{flex:'1 1 auto', minHeight:0}} className="sandpack-wrapper">
        <Sandpack
          template="react"
          files={sandpackFiles}
          options={{
            showConsole: false,
            showInlineErrors: true,
            editorHeight: 9999, // let it expand to container
            showTabs: true,
            autorun: true
          }}
          customSetup={{
            entry: "src/index.jsx"
          }}
        />
      </div>
    </div>
  );
}
