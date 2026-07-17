import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [isStudent, setIsStudent] = useState(true);
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loginStudent, loginAdmin, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    let success = false;
    if (isStudent) {
      success = await loginStudent(collegeId.trim(), password.trim());
    } else {
      success = await loginAdmin(email.trim(), password.trim());
    }
    
    setIsLoading(false);
    if (success) {
      navigate(isStudent ? '/student/dashboard' : '/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          ID Card Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Apply and manage your college identity card
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-brand-500/5 sm:rounded-3xl sm:px-10 border border-white">
          
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setIsStudent(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isStudent ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Student Login
            </button>
            <button
              onClick={() => setIsStudent(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isStudent ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Admin Login
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isStudent ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Pin Number</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value.toUpperCase().replace(/\s/g, ''))}
                    className="input-field"
                    placeholder="25B21CS001"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                    className="input-field"
                    placeholder="admin@college.edu"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-500 focus:outline-none transition-colors"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              {isStudent && (
                <div className="flex justify-end mb-3">
                  <Link to="/forgot-password" className="text-sm text-brand-600 hover:underline font-medium">
                    Forgot Password?
                  </Link>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm shadow-brand-500/30 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
              
              {isStudent && (
                <div className="text-center mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-brand-600 hover:underline font-medium">
                      Register here
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
