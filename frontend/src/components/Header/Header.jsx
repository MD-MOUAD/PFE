import React from 'react';
import './Header.css';
import logo from '../../img/logo.png'
const Header = ({links }) => {
  return (
    <header>
      <nav>
      <div className="right-nav">
          <a href="/">
          <img src={logo} alt="My App Logo" className="logo" />
          </a>
        </div>
        <div className="left-nav">
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <a href={link.url}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

      </nav>
    </header>
  );
};

export default Header;