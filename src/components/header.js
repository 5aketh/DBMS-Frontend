import { useNavigate } from 'react-router-dom';

import Navbar from "./nav";

import "../styles/header.css";

export default function Header({ navItems, loginStatus }) {
  const navigate = useNavigate();
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="logo-section" onClick={() => navigate("/")}>
          <img src="/images/logo.png" alt="Logo" className="logo" />
          <h1>BMSCE</h1>
        </div>
        <Navbar
          navItems={navItems}
        />
        <div className="header-actions">
          {loginStatus === 'login' ? (
            <button className="btn settings" onClick={() => navigate('/login')}>
              <img src="/svgs/login.svg" alt="login"/>
              <p>Login</p>
            </button>
          ) : loginStatus === 'logout' ? (
            <button className="btn settings" onClick={() => {localStorage.clear(); navigate('/journals')}}>
              <img src="/svgs/logout.svg" alt="logout"/>
              <p>Logout</p>
            </button>
          ) : null}
        </div>

      </div>
    </header>
  );
}