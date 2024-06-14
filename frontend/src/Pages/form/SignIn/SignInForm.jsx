import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../features/authSlice';

function SignInForm() {
  
  const dispatch = useDispatch();
  const { isLoading, error, user } = useSelector((state) => state.auth);
  const [state, setState] = useState({ email: "", password: "" });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState({ ...state, [name]: value });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { email, password } = state;
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter both email and password.");
      return;
    }
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const renderError = () => {
    if (!error) return null;
    if (typeof error === 'object' && error !== null) {
      return <div>Error: {error.msg}</div>;
    }
    return <div>Error: {error}</div>;
  };

  return (
    <div className="form-container sign-in-container">
      {isLoading && <div>Loading...</div>}
      {renderError()}
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <span>Use your account</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <a href="#">Forgot your password?</a>
        <button type="submit" disabled={isLoading}>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
