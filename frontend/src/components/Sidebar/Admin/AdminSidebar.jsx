import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../sidebar.scss';
import logo from '../../../img/logo.png'
import { useDispatch ,useSelector  } from 'react-redux';
import { setUser ,logoutUser} from '../../../features/authSlice';
const sidebarNavItems = [
  {
    display: 'Profile',
    icon: <i className='bx bx-user'></i>,
    to: '/admin/profile',
    section: 'profile'
  },
  {
    display: 'Users',
    icon: <i className='bx bx-box'></i>,
    to: '/admin/users',
    section: 'users'
  },
  {
    display: 'Homepage',
    icon: <i className='bx bx-box'></i>,
    to: '/',
    section: 'Homepage'
  }/*,
  {
    display: 'Settings',
    icon: <i className='bx bx-cog'></i>,
    to: '/user/settings',
    section: 'settings'
  },*/
];

const AdminSidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepHeight, setStepHeight] = useState(0);
  const sidebarRef = useRef();
  const indicatorRef = useRef();
  const location = useLocation();
  
  const navigate = useNavigate(); // Utilize useNavigate for programmatic navigation
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/', { replace: true });
    window.location.reload(); // Force a reload to clear any cached states
  };
  useEffect(() => {
    setTimeout(() => {
      const sidebarItem = sidebarRef.current?.querySelector('.sidebar__menu__item');
      if (sidebarItem) {
        indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
        setStepHeight(sidebarItem.clientHeight);
      }
    }, 50);
  }, []);

  // change active index
  useEffect(() => {
    const curPath = window.location.pathname?.split('/')[2] || '';
    const activeItem = sidebarNavItems.findIndex(item => item.section === curPath);
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);


  return (
    <div className='sidebar'>
      <div className="sidebar__logo">          <a href="/">
          <img src={logo} alt="My App Logo" className="logo" />
          </a></div>
      <div ref={sidebarRef} className="sidebar__menu">
        <div
          ref={indicatorRef}
          className="sidebar__menu__indicator"
          style={{
            transform: `translateX(-50%) translateY(${activeIndex * stepHeight}px)`
          }}
        ></div>
        {sidebarNavItems.map((item, index) => (
          <Link to={item.to} key={index}>
            <div className={`sidebar__menu__item ${activeIndex === index ? 'active' : ''}`}>
              <div className="sidebar__menu__item__icon">
                {item.icon}
              </div>
              <div className="sidebar__menu__item__text">
                {item.display}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="sidebar-Logout">
      <button onClick={handleLogout}>Logout</button>
    </div>
    </div>
  );
};
export default AdminSidebar;