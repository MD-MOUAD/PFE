import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import poub from '../../../public/img/delete.png'; 
import axios from 'axios';

const FileListContainer = styled.div`
height: 400px;
@media (max-height: 768px) {
  height: 100px;
}
  overflow-y: scroll;
  border: 1px solid #ccc;
  padding: 10px;
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e9e9e9;
    cursor: pointer;
  }
`;

const FileName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const DeleteButton = styled.button`
  color: white;
  border: none !important;
  border-radius: 5px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #ff2a2d;
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #555;
`;
const FileTitle = styled.div`
background-color: #6a6fac; 
color: #ffffff; 
padding: 10px; 
border-radius: 5px;
margin: 40px 300px; 
font-size: 21px;
font-weight: 700;
width: 200px;
`;
const TitleC = styled.div`
display: flex;
flex-direction: column;
align-items: center;
text-align: center;
`;
const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        const userData = JSON.parse(storedUser);
        const response = await axios.get('http://localhost:5000/api/prc/get-files', {
          params: { clientId: userData.user.id }
        });
        const fileNames = response.data;
        setFiles(fileNames);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDeleteFile = async (index) => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      const userData = JSON.parse(storedUser);
      const clientId = userData.user.id;
      const email = userData.user.email;
      const response = await axios.delete(`http://localhost:5000/api/prc/delete/${index}`, {
        params: { clientId },
        data: { fileNames: files, email: email }
      });

      if (response.status !== 200) {
        throw new Error(`Error deleting file: ${response.statusText}`);
      }else if (response.status == 200) {
        setLoading(false);
      }

      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
    } catch (error) {
      console.error('Error deleting file:', error);
    } 
  };

  return (
    <div>
      <TitleC>
        <FileTitle className='h21'>File List</FileTitle>
      </TitleC>
      {loading ? (
        <LoadingIndicator>Loading...</LoadingIndicator>
      ) : (
        <FileListContainer className='flct'>
          {files.map((file, index) => (
            <FileItem key={index}>
              <FileName>{file}</FileName>
              <DeleteButton onClick={() => handleDeleteFile(index)}>
                <img src={poub} alt="Poubelle" />
              </DeleteButton>
            </FileItem>
          ))}
        </FileListContainer>
      )}
    </div>
  );
};

export default FileList;
