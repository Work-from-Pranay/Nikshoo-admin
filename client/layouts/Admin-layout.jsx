import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { NavLink, Outlet } from 'react-router-dom'
import "../pages/Admin.css"

const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token
    navigate('/'); // Redirect back to login
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  return (
    <>
      <div className="wrap">
        <button className="hamburger" onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </button>
        <div className={`container ${isMenuOpen ? 'menu-open' : ''}`}>
          {/* Sidebar */}
          <nav className={isMenuOpen ? 'open' : ''}>
            <ul>
              <li onClick={toggleMenu}><NavLink to="/admin/users">Users</NavLink></li>
              <li onClick={toggleMenu}><NavLink to="/admin/contact">Form1 (Homepage)</NavLink></li>
              <li onClick={toggleMenu}><NavLink to="/admin/contact2">Form2 (Contact)</NavLink></li>
              <li onClick={toggleMenu}><NavLink to="/admin/partner">Form3 (Partner)</NavLink></li>
            </ul>
            <button onClick={handleLogout} className="logout">Logout</button>
          </nav>

          {/* Content area */}
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
