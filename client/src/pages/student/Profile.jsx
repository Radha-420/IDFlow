import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [phone, setPhone] = useState(user?.phone || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put('/api/student/profile', { phone });
      
      // Update local state
      const updatedUser = { ...user, phone: data.phone };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="card-container overflow-hidden p-0">
        <div className="bg-brand-50/50 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100">
          <div className="relative">
            <img 
              src={user?.photo} 
              alt={user?.name} 
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-sm"
            />
          </div>
          <div className="flex-1 text-center sm:text-left mt-2">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600">
              ID: <span className="ml-1 text-brand-600">{user?.collegeId}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium">
                {user?.name}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium">
                {user?.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
              <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium">
                {user?.department}
              </div>
            </div>
            
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Year</label>
              <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium">
                {user?.year}
              </div>
            </div>

            {user?.course && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Course</label>
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium">
                  {user?.course}
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Edit
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Enter phone number"
                  />
                  <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="btn-primary"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setPhone(user?.phone || '');
                    }} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium">
                  {user?.phone || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
