import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get('/api/student/dashboard');
        setDashboardData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-pulse w-8 h-8 bg-brand-500 rounded-full"></div></div>;
  }

  const { application, paymentsCount } = dashboardData || {};

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name.split(' ')[0]}</h1>
        </div>
        {(!application || application.applicationStatus === 'Collected' || application.applicationStatus === 'Rejected') && (
          <Link to="/student/apply" className="btn-primary flex items-center shadow-lg shadow-brand-500/40 hover:-translate-y-0.5 transition-transform">
            Apply Now
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card-container md:col-span-1 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <img src={user?.photo} alt={user?.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md mb-4" />
            <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
            <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-semibold mt-2 border border-brand-100">{user?.collegeId}</span>
          </div>
          
          <div className="space-y-3 relative z-10 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Department</span>
              <span className="font-medium text-gray-800">{user?.department}</span>
            </div>
            
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Year</span>
              <span className="font-medium text-gray-800">{user?.year}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-800 truncate max-w-[120px]">{user?.email}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium text-gray-800">{user?.phone}</span>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="md:col-span-2 space-y-6 flex flex-col">
          <div className="card-container flex-1 border-brand-100 bg-gradient-to-br from-white to-brand-50/30">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-6 bg-brand-500 rounded-full mr-3"></span>
              Application Status
            </h2>
            
            {application ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Application No.</p>
                    <p className="font-mono font-semibold text-gray-800">{application.applicationNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Current Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      application.applicationStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      application.applicationStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                      application.applicationStatus === 'Collected' ? 'bg-gray-200 text-gray-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {application.applicationStatus}
                    </span>
                  </div>
                </div>

                <div className="relative pt-4">
                   <div className="absolute left-[15px] top-4 bottom-0 w-0.5 bg-gray-200"></div>
                   
                   {['Pending', 'Under Verification', 'Approved', 'Printed', 'Ready for Collection', 'Collected'].map((step, idx) => {
                      const isCurrent = step === application.applicationStatus || (step === 'Printed' && application.applicationStatus === 'ID Card Printed');
                      const isPast = false; // Logic to determine if past would go here based on order
                      
                      return (
                        <div key={idx} className="relative flex items-center mb-6 last:mb-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 border-white ${isCurrent ? 'bg-brand-500 shadow-md shadow-brand-500/40' : 'bg-gray-300'}`}>
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          <div className="ml-4">
                            <h4 className={`font-medium ${isCurrent ? 'text-brand-600' : 'text-gray-500'}`}>{step}</h4>
                          </div>
                        </div>
                      )
                   })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-500 mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                  </svg>
                </div>
                <h3 className="text-gray-800 font-medium mb-1">No Application Found</h3>
                <p className="text-sm text-gray-500 max-w-xs">You haven't applied for your PIN Number card yet.</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="card-container flex items-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mr-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payments</p>
                <p className="text-xl font-bold text-gray-800">{paymentsCount}</p>
              </div>
            </div>
            
            <div className="card-container flex items-center p-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mr-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Notifications</p>
                <p className="text-xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
