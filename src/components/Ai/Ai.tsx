import React, { useState } from "react";
import "./Ai.css";

const Ai = () => {
  const [activeTab, setActiveTab] = useState("files");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="ai-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li
            className={activeTab === "files" ? "active" : ""}
            onClick={() => handleTabChange("files")}
          >
            <span className="icon">📄</span> Files
          </li>
          <li
            className={activeTab === "text" ? "active" : ""}
            onClick={() => handleTabChange("text")}
          >
            <span className="icon">✏️</span> Text
          </li>
          <li
            className={activeTab === "website" ? "active" : ""}
            onClick={() => handleTabChange("website")}
          >
            <span className="icon">🌐</span> Website
          </li>
          <li
            className={activeTab === "qa" ? "active" : ""}
            onClick={() => handleTabChange("qa")}
          >
            <span className="icon">💬</span> Q&A
          </li>
          <li
            className={activeTab === "notion" ? "active" : ""}
            onClick={() => handleTabChange("notion")}
          >
            <span className="icon">📝</span> Notion
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="title">Data Sources</h1>
        <p className="subtitle">Add your data sources to train your chatbot</p>

        {/* Files Upload Section */}
        <div className="upload-section">
          <h2>Files</h2>
          <div className="upload-box">
            <div className="upload-icon">⬆️</div>
            <p>
              Drag & drop files here, or <span className="upload-link">click to select files</span>
            </p>
            <small className="upload-hint">
              Supported File Types: <strong>.pdf, .doc, .docx, .txt</strong>
            </small>
          </div>
          <p className="pdf-note">
            If you are uploading a PDF, make sure you can select/highlight the text.
          </p>
        </div>

        {/* Sources Summary */}
        <div className="sources-summary">
          <h2>Sources</h2>
          <p>Total detected characters</p>
          <p className="character-count">0 / 400,000 limit</p>
          <button className="create-chatbot-button">Create Chatbot</button>
        </div>
      </div>
    </div>
  );
};

export default Ai;
