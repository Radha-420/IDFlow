import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const ForgotPassword = () => {
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
    newPassword: '',
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
    
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/forgot-password-send-otp', {
        rollNumber: formData.rollNumber.toUpperCase(),
        email: formData.email.toLowerCase(),
      });
      
      toast.success(data.message || "Password reset OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndReset = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/forgot-password-verify-and-reset', {
        email: formData.email.toLowerCase(),
        otp,
        newPassword: formData.newPassword
      });
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success("Password reset successfully! You are now logged in.");
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Recover access to your ID Card Portal account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-brand-500/5 sm:rounded-3xl sm:px-10 border border-white">
          
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Number</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="input-field uppercase"
                    placeholder="25B21CS001"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University Email</label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="input-field bg-gray-100 text-gray-500 cursor-not-allowed"
                    placeholder="Will auto-fill based on PIN"
                  />
                  <p className="text-xs text-gray-400 mt-1">OTP will be sent to this email to verify your identity.</p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm shadow-brand-500/30 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? <FiLoader className="animate-spin mr-2" size={20} /> : null}
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link to="/" className="text-brand-600 hover:underline font-medium">
                    Back to Login
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpAndReset} className="space-y-6">
              <div className="text-center">
                <div className="bg-brand-50 text-brand-800 px-4 py-3 rounded-lg text-sm mb-2 inline-block">
                  Code sent to <strong>{formData.email}</strong>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="input-field pr-10"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm shadow-green-500/30 text-sm font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <FiLoader className="animate-spin mr-2" size={20} /> : null}
                {loading ? 'Verifying & Resetting...' : 'Reset Password'}
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

export default ForgotPassword;
