import fs from 'fs';
import path from 'path';

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { splitter  } from '../utils/splitter.js';
import {deleteDocuments} from '../utils/deleteDocuments.js'
import uploadToVectorStore from '../utils/uploadToVectorStore.js'

import * as dotenv from "dotenv";
dotenv.config();

export const uploadFile = async (req, res) => {

  const { clientId, fileName , email} = req.body;

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    const uploadDir = path.join(process.env.DIRNAME, 'clients', String(clientId));
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName || req.file.originalname);
    await fs.promises.rename(req.file.path, filePath);

    //For the fileUpload : 
    const loader = filePath.endsWith(".pdf") ? new PDFLoader(filePath, "text") : new TextLoader(filePath);
    const output = await loader.loadAndSplit(splitter);
    //Load to Vectore Store : 
    try {
      await uploadToVectorStore(email, output);
  } catch (error) {
      console.log("Error in loading to Vector Store:", error.message);
  }
  
    res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
};


export const getFiles = async(req, res) =>{
  const { clientId } = req.query;
  console.log(clientId)
    try {
        const uploadDir = path.join(process.env.DIRNAME, 'clients', String(clientId));
        const files = await fs.promises.readdir(uploadDir);
        res.json(files);
    
      } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).send('Failed to get files');
      }
}


export const deleteFile = async (req, res) => {
  const { clientId } = req.query;
  const { fileNames, email } = req.body;
  const index = parseInt(req.params.index);

  if (!Array.isArray(fileNames)) {
    return res.status(400).json({ error: 'fileNames must be an array' });
  }

  if (isNaN(index) || index < 0 || index >= fileNames.length) {
    return res.status(400).json({ error: 'Invalid file index' });
  }

  const fileName = fileNames[index];
  const filePath = path.join(process.env.DIRNAME, 'clients', String(clientId), fileName);
  const loader = filePath.endsWith(".pdf") ? new PDFLoader(filePath, "text") : new TextLoader(filePath);
  try {
    const output = await loader.loadAndSplit(splitter);
    try {
      await deleteDocuments(output,email);
      console.log('File deleted from Vector Store successfully.');
    } catch (err) {
      console.error('Error deleting file from Vector Store:', err.message);
      return res.status(500).json({ error: 'Error deleting file from Vector Store' });
    }
    fs.unlinkSync(filePath);
    fileNames.splice(index, 1);
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ error: 'Error deleting file' });
  }
};