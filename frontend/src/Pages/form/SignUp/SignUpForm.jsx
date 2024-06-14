import React from "react";
import { useDispatch } from 'react-redux';
import { register } from '../../../features/authSlice';
import useAuthRedirect from "../../../features/useAuthRedirect";

function SignUpForm() {
  useAuthRedirect();

  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState({
      ...state,
      [name]: value
    });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();

    const { name, email, password } = state;

    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    dispatch(register({ name, email, password }));

    setState({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <span>Use your email for registration</span>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
