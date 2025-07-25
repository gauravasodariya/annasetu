import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/authContext";

const ProfileMenu = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, user, logout } = authContext;

  if (loading) {
    return null;
  }

  if (isAuthenticated && user) {
    return (
      <div className="d-flex align-items-center">
        <span className="text-white me-2">{user.name}</span>
        <Link to="/dashboard" className="nav-link text-white px-2">
          Dashboard
        </Link>
        <Link to="#!" onClick={logout} className="nav-link text-white px-2">
          Logout
        </Link>
      </div>
    );
  }

  return (
    <Link to="/login" className="nav-link text-white">
      Login
    </Link>
  );
};

export default ProfileMenu;
