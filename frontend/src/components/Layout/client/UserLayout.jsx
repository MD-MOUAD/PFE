import React from 'react';
import UserSidebar from '../../Sidebar/client/UserSidebar';
import { Outlet } from 'react-router-dom';

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <UserSidebar />
      <div className="user-layout__content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;