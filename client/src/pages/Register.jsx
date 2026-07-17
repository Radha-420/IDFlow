import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = React.useContext(AuthContext);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    rollNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // OTP State
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-update email when roll number changes
      if (name === 'rollNumber') {
        updated.email = `${value.toLowerCase()}@adityauniversity.in`;
      }
      
      return updated;
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/register-send-otp', {
        rollNumber: formData.rollNumber.toUpperCase(),
        email: formData.email.toLowerCase(),
        password: formData.password
      });
      
      toast.success(data.message || "OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP");
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/register-verify', {
        email: formData.email.toLowerCase(),
        otp
      });
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success("Registration successful!");
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden">
        
        {/* Background Decorative Blob */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
            <p className="text-gray-500">Create an account to manage your ID Card</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase"
                  placeholder="Enter your PIN Number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 outline-none"
                  placeholder="Will auto-fill based on PIN"
                />
                <p className="text-xs text-gray-400 mt-1">This email must be used to receive the OTP.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? <FiLoader className="animate-spin mr-2" size={20} /> : null}
                {loading ? 'Sending OTP...' : 'Send OTP via Email'}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/" className="text-blue-600 hover:underline font-medium">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg text-sm mb-6 inline-block">
                  Code sent to <strong>{formData.email}</strong>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? <FiLoader className="animate-spin mr-2" size={20} /> : null}
                {loading ? 'Verifying...' : 'Verify & Register'}
              </button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Change Email / Go Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
