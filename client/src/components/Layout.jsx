import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const Layout = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Top Navbar / Header area */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 md:px-8 sticky top-0 z-10 w-full">
          <h2 className="text-lg font-bold text-brand-900 md:text-gray-800 tracking-tight">ID Portal</h2>
          
          <div className="flex items-center">
            {/* Mobile Logout Button */}
            <button 
              onClick={logout}
              className="md:hidden flex items-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content Area - Added pb-20 to accommodate BottomNav on mobile */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-8 md:pb-8 bg-gray-50/50 w-full">
          <Outlet />
        </main>
        
        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
