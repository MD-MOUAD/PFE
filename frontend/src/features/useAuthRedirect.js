import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { register } from './authSlice';

const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
   if (user && user.user.role == 'admin') {
      navigate('/admin/profile');
    } else if(user && user.user.role == 'client'){
      navigate('/user/profile');
    } else if(register){
      navigate('/login');
    }
  }, [user, navigate]);
};

export default useAuthRedirect;
