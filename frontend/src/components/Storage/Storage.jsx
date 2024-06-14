import './Storage.css';
import { useState } from 'react';
import FileList from '../SubComponent/FileList';
import axios from 'axios';
import { FileUploader } from 'react-drag-drop-files';

function Storage() {
  const [file, setFile] = useState(null);
  const fileTypes = ['TXT', 'PDF'];
  const [loading, setLoading] = useState(false);

  const handleUploadFile = async (file) => {
    setFile(file);
    setLoading(true);

    const storedUser = localStorage.getItem('user');
    const userData = JSON.parse(storedUser);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('clientId', userData.user.id);
    formData.append('email', userData.user.email);

    try {
      const response = await axios.post('http://localhost:5000/api/prc/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        console.log('File uploaded successfully');
      } else {
        console.error('Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="storage-container">
      <div className="file-list-container">
        <FileList />
      </div>
      {loading ? (
          <div className="loading-indicator">
            <div className="spinner">Loading...</div>
          </div>
        ) : (
          <div></div>
        )}
      <div className="uploader-place">
        <div className="upload">
          <h1>Hello To Drag & Drop Files</h1>
          <FileUploader handleChange={handleUploadFile} name="file" types={fileTypes} />
          <p>{file ? `File name: ${file.name}` : 'No files uploaded yet'}</p>
        </div>
      </div>
    </div>
  );
}

export default Storage;

