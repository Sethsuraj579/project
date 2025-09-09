import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';

// --- A style tag to hold custom CSS for the design ---
const style = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Custom Button Styles */
.btn {
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.2s ease-in-out;
  border: none;
  cursor: pointer;
}
.btn-primary-gradient {
  background-image: linear-gradient(to right, #8A2BE2, #6A5ACD);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}
.btn-primary-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}
.btn-secondary {
  background-color: #3b82f6; /* A nice blue */
  color: white;
}
.btn-secondary:hover {
  background-color: #2563eb;
}

.btn-terirary {
  background-color: #e5e7eb; /* Light gray */
  color: none; /* Dark gray text */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);


}
.btn-terirary:hover {
  background-color: #d1d5db;
}
.btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
`;

// --- SVG Icon Components ---
const IconDocument = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
);
const IconKey = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17.5v.01"></path></svg>
);
const IconShieldCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);
const IconGavel = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10"></path><path d="m16 16 6-6"></path><path d="m8 8 6-6"></path><path d="m9 7 8 8"></path><path d="m21 11-8-8"></path></svg>
);
const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

// Main Application Component
function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPastedText('');
      setError(null);
      setSimplifiedText('');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPastedText('');
      setError(null);
      setSimplifiedText('');
    }
  };
  
  const handleUpload = useCallback(async () => {
    if (!selectedFile && !pastedText) {
      setError('Please choose a file or paste some text.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSimplifiedText('');

    const formData = new FormData();
    if (selectedFile) {
        formData.append('uploaded_file', selectedFile);
    } else {
        const blob = new Blob([pastedText], { type: 'text/plain' });
        formData.append('uploaded_file', blob, 'pasted_text.txt');
    }

    try {
      // Simulate a delay to show the loading spinner
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = await axios.post('http://127.0.0.1:8000/api/analyze/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSimplifiedText(response.data.simplified_text);
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.statusText}.`);
      } else if (err.request) {
        setError('Cannot connect to the server. Is it running?');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, pastedText]);

  const sidebarNavItems = [
    { name: 'Document Overview', icon: <IconDocument /> },
    { name: 'Key Terms & Definitions', icon: <IconKey /> },
    { name: 'Your Rights & Benefits', icon: <IconShieldCheck /> },
    { name: 'Your Obligations', icon: <IconGavel /> },
    { name: 'Important Deadlines', icon: <IconClock /> },
  ];

  return (
    <>
      <style>{style}</style>
      <div className=" app min-h-screen bg-white text-gray-800 font-sans">
        <div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
          <header className="header flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="logo-section flex items-center gap-3">
              <div className="logo p-2 bg-indigo-600 rounded-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
              </div>
              <h1 className="logo-text text-2xl font-bold text-gray-900">LegalSimplify AI</h1>
            </div>
          </header>

          <div className="progress-section mt-6">
              <div className="progress-label flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium text-gray-600">Analyzing Your Document in Simple and Short Sentences</h2>
                <div className=" progress-fill flex items-center gap-2">
                {/*<p className="progress-text text-xs text-gray-500 font-medium">1/4 Steps Complete</p>*/}</div>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `25%` }}></div>
              </div>
          </div>

          <main className=" main-content grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
            <aside className=" sidebar lg:col-span-1">
              <div className="sticky top-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className=" sidebar-title text-lg font-semibold mb-4 text-gray-900">Document Sections</h3>
                <nav className=" sidebar-nav space-y-1">
                  {sidebarNavItems.map((item, index) => (
                    <a key={item.name} href="#!" className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${index === 0 ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                      {item.icon}
                      <span className="sidebar-icon font-medium text-sm">{item.name}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <section className="content-area lg:col-span-3">
               {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full p-10 bg-white rounded-lg border border-gray-200">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
                    <p className="mt-4 text-gray-600">Analyzing your document...</p>
                  </div>
               ) : simplifiedText ? (
                  <div className="p-8 bg-white rounded-lg border border-gray-200 space-y-6 fade-in">
                    <h2 className="text-2xl font-bold text-gray-900">Simplified Summary</h2>
                    <div className="par border-t border-gray-300">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{simplifiedText}</p></div>
                    <div className="hrl text-center">
                      <button onClick={() => { setSimplifiedText(''); setSelectedFile(null); setPastedText(''); }} className="btn btn-secondary">Analyze Another Document</button>
                    </div>
                  </div>
               ) : (
                  <div className="upload-section space-y-6">
                    <div className="text-center p-8">
                        <div className="info-icon inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-50 text-indigo-500 mb-4">
                            <InfoIcon />
                        </div>
                        <h2 className="upload-title text-2xl font-bold text-gray-900">Upload Your Legal Document</h2>
                        <p className="upload-description text-base text-gray-500 mt-2">Drag and drop your legal document here, or click to browse.<br/>We support PDF, DOC, and DOCX formats.</p>
                    </div>

                   <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} className={`py-10 border-2 border-dashed rounded-lg text-center transition-all duration-300 ${isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}>
                      <p className="supported-formats text-sm text-gray-500 mb-4">Supported formats: PDF, DOC, DOCX</p>
                      <button onClick={() => fileInputRef.current.click()} className="btn btn-primary-gradient">Choose File</button>
                    </div>
                    <div className="upload-area relative flex py-2 items-center">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="file-input" />
                      {selectedFile && <div className="mt-4 text-sm text-green-600">{selectedFile.name} selected</div>}
                        <div className="file-icons flex-grow border-t border-gray-300"></div>
                        <button onClick={() => fileInputRef.current.click()} className='btn btn-terirary'><span className=" file-icon pdf mx-4 text-gray-400">📄</span></button>
                        <span className="text-input-label flex-shrink mx-4 text-sm text-gray-400">Or upload your file directly</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className="text-input-section space-y-2">or</div>
                    <textarea value={pastedText} onChange={(e) => { setPastedText(e.target.value); setSelectedFile(null); }} placeholder="Paste your legal document text here..." className="text-input w-full h-32 p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"></textarea>
                    
                    {error && <p className="text-red-500 text-center fade-in">{error}</p>}
                    
                    <div className="text-center">
                      <button onClick={handleUpload} disabled={!selectedFile && !pastedText} className="btn btn-secondary">Quick Scan</button>
                    </div>
                  </div>
               )}
            </section>
          </main>
        </div>
        </div>
      <footer className="footer text-center text-sm text-gray-500">
        <p>© 2024 LegalSimplify AI. All rights reserved.</p>
      </footer>
      </>
  );
}

export default App;
