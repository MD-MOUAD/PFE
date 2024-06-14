import User from "../models/User.js";
import deleteClient from '../utils/deleteClient.js'

export const getUserById = async (req, res) => {
    try {
      const response = await User.findOne({
        where: {
          uuid: req.params.id
        }
      });
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getUserById:', error); // Log the error
      res.status(500).json({ msg: error.message });
    }
  }
  
  export const updateUser = async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          uuid: req.params.id
        }
      });
  
      if (!user) {
        console.error('User not found:', req.params.id); // Log when user is not found
        return res.status(404).json({ msg: "User doesn't exist" });
      }
  
      const { name, email, password, confPassword, role, about, address, phoneNumber } = req.body;
      let Password = user.password;
  
      if (password && password !== "") {
        if (password !== confPassword) {
          console.error('Passwords do not match'); // Log when passwords don't match
          return res.status(400).json({ msg: "Passwords do not match" });
        }
        Password = password;
      }
  
      await User.update({
        name: name,
        email: email,
        password: Password,
        role: role,
        about: about,
        address: address,
        phoneNumber: phoneNumber,
        
      }, {
        where: {
          uuid: req.params.id
        }
      });
  
      res.status(200).json({ msg: "User Updated" });
    } catch (error) {
      console.error('Error in updateUser:', error); // Log the error
      res.status(400).json({ msg: error.message });
    }
  };
  
  export const deleteUser = async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          uuid: req.params.id
        }
      });
  
      if (!user) {
        console.error('User not found:', req.params.id); // Log when user is not found
        return res.status(404).json({ msg: "User doesn't exist" });
      }
  
      await User.destroy({
        where: {
          uuid: user.uuid
        }
      });
  
      await deleteClient(user.email);
      res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
      console.error('Error in deleteUser:', error); // Log the error
      res.status(400).json({ msg: error.message });
    }
  };