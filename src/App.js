import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Jobs from './pages/public/Jobs';
import JobDetails from './pages/public/JobDetails';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Job Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import SeekerProfile from './pages/seeker/SeekerProfile';
import MyApplications from './pages/seeker/MyApplications';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CreateJob from './pages/recruiter/CreateJob';
import ManageJobs from './pages/recruiter/ManageJobs';
import EditJob from './pages/recruiter/EditJob';
import RecruiterApplications from './pages/recruiter/RecruiterApplications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminManageJobs from './pages/admin/AdminManageJobs';
import AdminApplications from './pages/admin/AdminApplications';

// 404 Not Found Page
const NotFound = () => (
  <div className="container py-5 text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center">
    <h1 className="display-1 fw-bold text-primary">404</h1>
    <h3 className="fw-bold text-dark mb-2">Page Not Found</h3>
    <p className="text-secondary mb-4">The page you are looking for does not exist or has been moved.</p>
    <Link to="/" className="btn btn-primary px-4 fw-semibold">
      Return to Home
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="main-content d-flex flex-column">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected Job Seeker Routes */}
            <Route
              path="/seeker/dashboard"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <SeekerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/profile"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <SeekerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/applications"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />

            {/* Protected Recruiter Routes */}
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/create-job"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <ManageJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/edit-job/:id"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <EditJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/applications"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <RecruiterApplications />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminManageJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminApplications />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
