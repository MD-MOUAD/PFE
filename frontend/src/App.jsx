import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from './Pages/form/Form';
import HomePage from './Pages/Homepage/Homepage';
import NotFound from './components/NotFound/NotFound';
import UserLayout from './components/Layout/client/UserLayout';
import AdminLayout from './components/Layout/Admin/AdminLayout';
import UserStorage from './components/Storage/Storage';
import UserChat from './components/Chat/Chat';
import AdminProfile from './components/Profile/Admin/Profile';
import UserProfile from './components/Profile/client/Profile';

import AdminUsers from './components/Users/Userlist';
import { logoutUser, setUser } from './features/authSlice';
import FormAddUser from './components/Users/FormAddUser';
import FormEditUsers from './components/Users/FormEditUser';
import FormEditUser from './components/User/FormEditUser';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      dispatch(setUser(userData));
    } else {
      dispatch(logoutUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Form />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="profile" element={<AdminProfile />} />
          <Route path="users" element={<AdminUsers />}/>
            <Route path="users/add" element={<FormAddUser />} />
            <Route path="users/edit/:id" element={<FormEditUsers />} />
            <Route />
          <Route path="homepage" element={<HomePage />} />
        </Route>
        <Route path="/user/*" element={<UserLayout />}>
          <Route path="edit/:id" element={<FormEditUser />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="storage" element={<UserStorage />} />
          <Route path="chat" element={<UserChat />} />
          <Route path="homepage" element={<HomePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
