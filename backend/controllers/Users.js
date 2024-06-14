import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import createClientAndEmbeddingsTable from '../utils/createClientAndEmbeddingsTable.js'
import deleteClient from '../utils/deleteClient.js'

export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['uuid','name','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['uuid','name','email','role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}


export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  try {
    // Create the user in the database
    await User.create({
      name,
      email,
      password,
      role
    });

    try {
      // Additional operations like creating client and embeddings table
      await createClientAndEmbeddingsTable(name, email, password);
    } catch (error) {
      console.error('Error in createClientAndEmbeddingsTable:', error);
      return res.status(400).json({ msg: error.message });
    }

    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(400).json({ msg: error.message });
  }
};


export const updateUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!user) return res.status(404).json({ msg: "User doesn't exist" });

        const { name, email, password, confPassword, role } = req.body;
        let Password = user.password;

        if (password && password !== "") {
            if (password !== confPassword) {
                return res.status(400).json({ msg: "Passwords do not match" });
            }
            Password = password; // Note: Consider hashing the password here
        }

        await User.update({
            name: name,
            email: email,
            password: Password,
            role: role
        }, {
            where: {
                uuid: req.params.id
            }
        });

        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "'"});
    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });
        await deleteClient(user.email);
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}