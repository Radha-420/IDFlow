import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get('/api/admin/applications');
      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/admin/application/${id}`, { status: newStatus });
      toast.success(`Application status updated to ${newStatus}`);
      fetchApplications();
      setSelectedApp(null);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteApp = async (id) => {
    if (!window.confirm('Are you sure you want to remove this collected application?')) return;
    try {
      await axios.delete(`/api/admin/application/${id}`);
      toast.success('Application removed successfully');
      fetchApplications();
      setSelectedApp(null);
    } catch (error) {
      toast.error('Failed to remove application');
    }
  };

  const statusOptions = [
    'Pending',
    'Under Verification',
    'Approved',
    'ID Card Printed',
    'Ready for Collection',
    'Collected',
    'Rejected'
  ];

  if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-pulse w-8 h-8 bg-brand-500 rounded-full"></div></div>;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Applications</h1>
        <p className="text-gray-500 mt-1">Review student applications and update their status.</p>
      </div>

      <div className="card-container overflow-hidden p-0 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">App Number</th>
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">PIN Number</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-gray-700">{app.applicationNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={app.student.photo} alt="" className="w-8 h-8 rounded-full mr-3 object-cover border border-gray-200" />
                      <span className="font-medium text-gray-800">{app.student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{app.student.collegeId}</td>
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
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="text-brand-600 hover:text-brand-800 font-medium bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for reviewing application */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={() => setSelectedApp(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                        Application {selectedApp.applicationNumber}
                      </h3>
                      <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-5 mb-6 flex flex-col md:flex-row gap-6">
                      <img src={selectedApp.student.photo} alt="" className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-sm" />
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <div><p className="text-gray-500 mb-1">Student Name</p><p className="font-semibold text-gray-800">{selectedApp.student.name}</p></div>
                        <div><p className="text-gray-500 mb-1">PIN Number</p><p className="font-semibold text-gray-800">{selectedApp.student.collegeId}</p></div>
                        <div><p className="text-gray-500 mb-1">Department</p><p className="font-medium text-gray-800">{selectedApp.student.department}</p></div>
                        <div><p className="text-gray-500 mb-1">Branch</p><p className="font-medium text-gray-800">{selectedApp.student.branch}</p></div>
                        <div><p className="text-gray-500 mb-1">Year</p><p className="font-medium text-gray-800">{selectedApp.student.year}</p></div>
                        <div><p className="text-gray-500 mb-1">Payment Status</p><p className="font-semibold text-green-600">{selectedApp.paymentStatus}</p></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(selectedApp._id, status)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                              selectedApp.applicationStatus === status 
                                ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm shadow-brand-500/20' 
                                : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 hover:bg-gray-50'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sm:justify-between border-t border-gray-100">
                <div className="flex sm:flex-row-reverse w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
                {selectedApp.applicationStatus === 'Collected' && (
                  <button
                    type="button"
                    onClick={() => deleteApp(selectedApp._id)}
                    className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:w-auto sm:text-sm transition-colors"
                  >
                    Remove Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
