"use client"

import { useState } from "react"
import "./App.css"




const App = () => {
  const [selectedSection, setSelectedSection] = useState("overview")
  const [documentText, setDocumentText] = useState("")

  const sections = [
    { id: "overview", icon: "👁️", label: "Document Overview", active: true },
    { id: "terms", icon: "📋", label: "Key Terms & Definitions", active: false },
    { id: "rights", icon: "⚖️", label: "Your Rights & Benefits", active: false },
    { id: "obligations", icon: "📝", label: "Your Obligations", active: false },
    { id: "deadlines", icon: "⏰", label: "Important Deadlines", active: false },
  ]

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log("File uploaded:", file.name)
      // Handle file upload logic here
    }
  }

  const handleQuickScan = () => {
    console.log("Quick scan initiated")
    // Handle quick scan logic here
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">⚖️</span>
            <span className="logo-text">LegalSimplify AI</span>
          </div>
        </div>
        <nav className="nav-tabs">
          <button className="nav-tab active">Free</button>
          <button className="nav-tab">General</button>
          <button className="nav-tab">Pro</button>
        </nav>
      </header>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-label">Document Processing Progress</div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <div className="progress-text">1/4 Steps Complete</div>
      </div>

      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Document Sections</h3>
          <nav className="sidebar-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`sidebar-item ${selectedSection === section.id ? "active" : ""}`}
                onClick={() => setSelectedSection(section.id)}
              >
                <span className="sidebar-icon">{section.icon}</span>
                <span className="sidebar-label">{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="content-area">
          <div className="upload-section">
            <div className="info-icon">ℹ️</div>
            <h2 className="upload-title">Upload Your Legal Document</h2>
            <p className="upload-description">
              Drag and drop your legal document here, or click to browse.
              <br />
              We support PDF, DOC, and DOCX formats.
            </p>

            <div className="upload-area">
              <div className="file-icons">
                <span className="file-icon pdf">📄</span>
                <span className="file-icon doc">📝</span>
                <span className="file-icon docx">📋</span>
              </div>
              <p className="supported-formats">Supported formats: PDF, DOC, DOCX</p>
              <input
                type="file"
                id="file-upload"
                className="file-input"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="choose-file-btn">
                Choose File
              </label>
            </div>

            <div className="text-input-section">
              <p className="text-input-label">Or paste your text directly</p>
              <textarea
                className="text-input"
                placeholder="Paste your legal document text here..."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                rows={8}
              />
            </div>

            <button className="quick-scan-btn" onClick={handleQuickScan} disabled={!selectedFile && !pastedText}>
              <span className="scan-icon">🔍</span>
              Quick Scan
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
