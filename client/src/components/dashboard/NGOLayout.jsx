import React, { useContext, useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { FaChartBar, FaClipboardList, FaUser, FaSignOutAlt, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaBars } from 'react-icons/fa';
import AuthContext from '../../context/authContext';
import '../admin/AdminLayout.css';

const NGOLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { logout } = authContext;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.replace('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`admin-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h3>{!sidebarCollapsed && 'AnnaSetu'}</h3>
          {!sidebarCollapsed && <p>NGO Portal</p>}
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === '/ngo' || location.pathname === '/ngo/dashboard' ? 'active' : ''}>
              <Link to="/ngo/dashboard">
                <FaChartBar /> {!sidebarCollapsed && 'Dashboard'}
              </Link>
            </li>
            <li className={location.pathname === '/ngo/requests' ? 'active' : ''}>
              <Link to="/ngo/requests">
                <FaClipboardList /> {!sidebarCollapsed && 'All Requests'}
              </Link>
            </li>
            <li className={location.pathname === '/ngo/profile' ? 'active' : ''}>
              <Link to="/ngo/profile">
                <FaUser /> {!sidebarCollapsed && 'Profile'}
              </Link>
            </li>
            <li>
              <a href="#!" onClick={handleLogout}>
                <FaSignOutAlt /> {!sidebarCollapsed && 'Log Out'}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default NGOLayout;
