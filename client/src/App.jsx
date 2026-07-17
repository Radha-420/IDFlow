import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import ApplyIdCard from './pages/student/ApplyIdCard';
import PaymentHistory from './pages/student/PaymentHistory';
import AdminDashboard from './pages/admin/Dashboard';
import ManageApplications from './pages/admin/ManageApplications';
import StudentDetails from './pages/admin/StudentDetails';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  
  return children;
};

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} /> : <Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="student"><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="apply" element={<ApplyIdCard />} />
          <Route path="payments" element={<PaymentHistory />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<StudentDetails />} />
          <Route path="applications" element={<ManageApplications />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
