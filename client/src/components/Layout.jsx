import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Top Navbar / Header area */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-4 md:px-8 sticky top-0 z-10 w-full">
          <button 
            className="p-2 mr-3 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu className="w-6 h-6" />
          </button>
          
          <h2 className="text-lg font-semibold text-gray-800">IDFlow</h2>
          
          <div className="flex items-center space-x-4 text-gray-500 ml-auto">
            {/* Optional Header Actions */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
