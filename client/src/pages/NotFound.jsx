import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
      <div className="bg-white px-8 py-6 rounded-2xl shadow-xl shadow-gray-200/50 -mt-12 z-10 text-center max-w-md border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h3>
        <p className="text-gray-500 mb-6">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-block">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
