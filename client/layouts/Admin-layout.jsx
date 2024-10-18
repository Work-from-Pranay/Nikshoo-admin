import React from 'react'
import { useNavigate } from 'react-router-dom';
import { NavLink, Outlet } from 'react-router-dom'
import "../pages/Admin.css"

const AdminLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token
    navigate('/'); // Redirect back to login
  };
  return (
    <>
      <div className="wrap">
        <div className="container">
          {/* Sidebar */}
          <nav>
            <ul>
              <li><NavLink to="/admin/users">Users</NavLink></li>
              <li><NavLink to="/admin/contact">Form1(Homepage)</NavLink></li>
              <li><NavLink to="/admin/contact2">Form2(Contact)</NavLink></li>
              <li><NavLink to="/admin/partner">Form3(Partner)</NavLink></li>
              
            </ul>
            <button onClick={handleLogout} className='logout'>Logout</button>
          </nav>
          
          {/* Content area */}
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminLayout
