import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get('/api/admin/dashboard');
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-pulse w-8 h-8 bg-brand-500 rounded-full"></div></div>;

  const { stats, recentApplications } = data || {};

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 mt-1">Monitor applications, payments, and system metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-container bg-white flex items-center p-6 border-l-4 border-l-brand-500 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mr-4">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalStudents}</p>
          </div>
        </div>

        <div className="card-container bg-white flex items-center p-6 border-l-4 border-l-amber-500 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Apps</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.pendingApps}</p>
          </div>
        </div>

        <div className="card-container bg-white flex items-center p-6 border-l-4 border-l-green-500 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mr-4">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Approved / Ready</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.approvedApps} / {stats?.readyApps}</p>
          </div>
        </div>

        <div className="card-container bg-white flex items-center p-6 border-l-4 border-l-purple-500 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mr-4">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{stats?.revenueCollected}</p>
          </div>
        </div>
      </div>

      <div className="card-container overflow-hidden p-0">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Recent Applications</h2>
          <Link to="/admin/applications" className="text-brand-600 text-sm font-medium hover:text-brand-800">View All &rarr;</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">App Number</th>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">PIN Number</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications?.map((app) => (
                <tr key={app._id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono font-medium text-gray-700">{app.applicationNumber}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{app.student.name}</td>
                  <td className="px-6 py-4 text-gray-500">{app.student.collegeId}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      app.applicationStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      app.applicationStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                      app.applicationStatus === 'Collected' ? 'bg-gray-200 text-gray-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {app.applicationStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {recentApplications?.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
