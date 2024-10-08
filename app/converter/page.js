"use client"
import React, { useEffect, useState } from "react";
import TopBar from "../components/topbar/topbar";
import styles from '../modulestyle/maker.module.css';
import { ChevronDownIcon, ChevronUpIcon, CubeIcon, FolderIcon, PencilIcon } from '@heroicons/react/24/solid';

function downloadFile(data){
    var c = document.createElement("a");
    c.download = "config.yml";

    var t = new Blob([data], {
    type: "text/plain"
    });
    c.href = window.URL.createObjectURL(t);
    c.click();
}

export default function ConfigMaker() {
    const [items, setItems] = useState([])

    //components
    
    function DownloadBox() {
        const [files, setFiles] = useState([]);

        const handleFileChange = (event) => {
            const selectedFiles = event.target.files;
            if (selectedFiles && selectedFiles.length > 0) {
              const newFiles = Array.from(selectedFiles);
              setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            }
          };
          const handleDrop = (event) => {
            event.preventDefault();
            const droppedFiles = event.dataTransfer.files;
            if (droppedFiles.length > 0) {
              const newFiles = Array.from(droppedFiles);
              setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            }
          };
        
          const handleRemoveFile = (index) => {
            setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
          };

        return (<section className="drag-drop" >
        <div
          className={`document-uploader ${
            files.length > 0 ? "upload-box active" : "upload-box"
          }`}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          <>
            <div className="upload-info">
              <div>
                <p>Drag and drop your files here</p>
                <p>
                  Limit 15MB per file. Supported files: .PDF, .DOCX, .PPTX, .TXT,
                  .XLSX
                </p>
              </div>
            </div>
            <input
              type="file"
              hidden
              id="browse"
              onChange={handleFileChange}
              accept=".pdf,.docx,.pptx,.txt,.xlsx"
              multiple
            />
            <label htmlFor="browse" className="browse-btn">
              Browse files
            </label>
          </>
  
          {files.length > 0 && (
            <div className="file-list">
              <div className="file-list__container">
                {files.map((file, index) => (
                  <div className="file-item" key={index}>
                    <div className="file-info">
                      <p>{file.name}</p>
                      {/* <p>{file.type}</p> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {files.length > 0 && (
            <div className="success-file">
              <p>{files.length} file(s) selected</p>
            </div>
          )}
        </div>
      </section>);
    }

    return (
        <main className={styles.main}>
            <DownloadBox />
            <div className="w-full">
                
            </div>
        </main>
    );
}
// TODO
// Advanced settings like sounds maybe
// Other pages (AI, convert)
// Login/logout
// Payment