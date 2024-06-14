import React, { useState } from "react";
import "./form.css";
import SignInForm from "./SignIn/SignInForm.jsx";
import SignUpForm from "./SignUp/SignUpForm.jsx";
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import useAuthRedirect from '../../features/useAuthRedirect.js';

export default function Form() {

  useAuthRedirect();

  const [type, setType] = useState("signIn");
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
    }
  };

  const containerClass = "container " + (type === "signUp" ? "right-panel-active" : "");
  const links = [
    { label: 'Home', url: '/' },
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'Login', url: '/login' },
    { label: 'About Us', url: '/about' },
  ];

  return (
    <div className="Form">
      <Header title="My App" links={links} />
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
