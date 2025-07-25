import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaClipboardList, FaHistory, FaUser, FaBell, FaSignOutAlt, FaBars } from 'react-icons/fa';
import AuthContext from '../../context/authContext';
import './AdminDashboard.css'; 

const VolunteerSidebar = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.replace('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    const container = document.querySelector('.admin-container');
    if (container) {
      container.classList.toggle('sidebar-collapsed');
    }
  };

  return (
    <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3>{!sidebarCollapsed && 'Volunteer Portal'}</h3>
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>
      <ul className="sidebar-menu">
        <li className={isActive('/volunteer')}>
          <Link to="/volunteer">
            <FaHome className="sidebar-icon" style={{ 

marginRight: '5px',
              fontSize: sidebarCollapsed ? '1.8rem !important' : '1.2rem',
              padding: sidebarCollapsed ? '5px 0' : '0'
            }} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>
        </li>
        <li className={isActive('/volunteer/assignments')}>
          <Link to="/volunteer/assignments">
            <FaClipboardList className="sidebar-icon" style={{ 
              marginRight: '5px',
              fontSize: sidebarCollapsed ? '1.5rem' : '1rem' 
            }} />
            {!sidebarCollapsed && <span>My Assignments</span>}
          </Link>
        </li>
        <li className={isActive('/volunteer/history')}>
          <Link to="/volunteer/history">
            <FaHistory className="sidebar-icon" style={{ 
              marginRight: '5px',
              fontSize: sidebarCollapsed ? '1.5rem' : '1rem' 
            }} />
            {!sidebarCollapsed && <span>Delivery History</span>}
          </Link>
        </li>
        <li className={isActive('/volunteer/profile')}>
          <Link to="/volunteer/profile">
            <FaUser className="sidebar-icon" style={{ 
              marginRight: '5px',
              fontSize: sidebarCollapsed ? '1.5rem' : '1rem' 
            }} />
            {!sidebarCollapsed && <span>My Profile</span>}
          </Link>
        </li>
        <li>
          <a href="#!" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-icon" style={{ 
              marginRight: '5px',
              fontSize: sidebarCollapsed ? '1.5rem' : '1rem' 
            }} />
            {!sidebarCollapsed && <span>Log Out</span>}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default VolunteerSidebar;
