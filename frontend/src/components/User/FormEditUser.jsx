import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './FormEditUser.css';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/authSlice';

const FormEditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser).user : null;
    
    if (user) {
      const getUserById = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/user/edit/${user.uuid}`);
          setName(response.data.name || "");
          setEmail(response.data.email || "");
          setAbout(response.data.about || "");
          setAddress(response.data.address || "");
          setPhoneNumber(response.data.phoneNumber || "");
        } catch (error) {
          if (error.response) {
            setMsg(error.response.data.msg);
          }
        }
      };
      getUserById();
    } else {
      console.log("No stored user found, logging out");
      dispatch(logoutUser());
    }
  }, [dispatch, id]);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/user/edit/${id}`, {
        name,
        email,
        password,
        confPassword,
        about,
        address,
        phoneNumber,
      });
      const storedUser = JSON.parse(localStorage.getItem('user'));
      storedUser.user = { 
        ...storedUser.user, 
        name, 
        email, 
        role, 
        about, 
        address, 
        phoneNumber 
      };
      localStorage.setItem('user', JSON.stringify(storedUser));
      navigate("/user/profile");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="form-page">
      <h1 className="title">Users</h1>
      <h2 className="subtitle">Update User</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateUser}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name || ""}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    type="email"
                    className="input"
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={password || ""}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={confPassword || ""}
                    onChange={(e) => setConfPassword(e.target.value)}
                    placeholder="******"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">About</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    value={about || ""}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="About"
                  ></textarea>
                </div>
              </div>
              <div className="field">
                <label className="label">Address</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={address || ""}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Phone Number</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={phoneNumber || ""}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditUser;
