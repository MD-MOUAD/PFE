import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";
import fs from 'fs';
import path from 'path';
import * as dotenv from "dotenv";
import createClientAndEmbeddingsTable from '../utils/createClientAndEmbeddingsTable.js';

dotenv.config();

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  try {
   // const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password//: hashedPassword,
    });
    await createClientAndEmbeddingsTable(name, email, password );
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(`Error in register: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    console.log(user);
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch =  (password == user.password);
    //const isMatch = password == 'admin' ? (password == user.password) : await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.uuid, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "logout er " });
        res.status(200).json({msg: "i log out"});
    });
}
*/