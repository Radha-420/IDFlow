import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiCreditCard, FiClock, FiLogOut, FiUsers, FiX } from 'react-icons/fi';
import { MdOutlineDashboard } from 'react-icons/md';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: <MdOutlineDashboard /> },
    { name: 'Apply ID Card', path: '/student/apply', icon: <FiCreditCard /> },
    { name: 'Payment History', path: '/student/payments', icon: <FiClock /> },
    { name: 'My Profile', path: '/student/profile', icon: <FiUsers /> }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <MdOutlineDashboard /> },
    { name: 'Student Directory', path: '/admin/students', icon: <FiUsers /> },
    { name: 'Applications', path: '/admin/applications', icon: <FiCreditCard /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col h-full shadow-xl md:shadow-sm md:sticky md:top-0 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-brand-50">
          <h1 className="text-xl font-bold text-brand-900 tracking-tight">ID Portal</h1>
          <button 
            className="md:hidden p-1 text-gray-500 hover:text-gray-800 rounded-md hover:bg-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center space-x-3 mb-8">
            <img src={user?.photo} alt="Profile" className="w-12 h-12 rounded-full border-2 border-brand-100 shadow-sm object-cover" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                      : 'text-gray-600 hover:bg-brand-50 hover:text-brand-600'
                  }`
                }
              >
                <span className="text-lg mr-3">{link.icon}</span>
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <FiLogOut className="text-lg mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
