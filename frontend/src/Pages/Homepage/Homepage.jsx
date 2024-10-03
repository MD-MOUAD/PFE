import React from 'react';
import logo from '../../img/logo.png'
import './Homepage.css'; // Stylesheet for the homepage
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import { Link } from 'react-router-dom';
const links = [
  { label: 'Home', url: '/' },
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Login', url: '/login' },
  { label: 'About Us', url: '/about' },
];

function HomePage () {
  
  return (
 
    <div className="homepage-container">
              
      <Header  links={links} />
      <div className="content-container">
      <h1>Welcome to My Website</h1>
        <p>Chat with Your Files</p>
        <Link to="/login">Login</Link>
      </div>
      <Footer/>
    </div>
  );
};

export default HomePage;
