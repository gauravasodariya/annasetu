import React from "react";
import { Outlet } from "react-router-dom";
import VolunteerSidebar from "./VolunteerSidebar";
import "../admin/AdminLayout.css"; 

const VolunteerLayout = () => {
  return (
    <div className="admin-container">
      <VolunteerSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default VolunteerLayout;
