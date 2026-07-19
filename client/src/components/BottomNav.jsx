import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiCreditCard, FiClock, FiUsers } from 'react-icons/fi';
import { MdOutlineDashboard } from 'react-icons/md';

const BottomNav = () => {
  const { user } = useContext(AuthContext);

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: <MdOutlineDashboard /> },
    { name: 'Apply', path: '/student/apply', icon: <FiCreditCard /> },
    { name: 'History', path: '/student/payments', icon: <FiClock /> },
    { name: 'Profile', path: '/student/profile', icon: <FiUsers /> }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <MdOutlineDashboard /> },
    { name: 'Students', path: '/admin/students', icon: <FiUsers /> },
    { name: 'Apps', path: '/admin/applications', icon: <FiCreditCard /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? 'text-brand-600'
                  : 'text-gray-500 hover:text-brand-500'
              }`
            }
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="text-[10px] font-medium">{link.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
