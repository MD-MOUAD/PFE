import React from 'react';
import AdminSidebar from '../../Sidebar/Admin/AdminSidebar';
import './AdminLAyout.css';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
