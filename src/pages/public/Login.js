import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDemoFill = (email, password) => {
    setFormData({ email, password });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(formData.email, formData.password);
      // Determine redirection
      const destination = location.state?.from?.pathname;
      if (destination) {
        navigate(destination, { replace: true });
      } else if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (loggedUser.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/seeker/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light flex-grow-1 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow-sm border-0 rounded-4 p-4">
              <div className="text-center mb-4">
                <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
                  <i className="bi bi-box-arrow-in-right fs-4"></i>
                </div>
                <h3 className="fw-bold text-dark">Welcome Back</h3>
                <p className="text-secondary small">Log in with your credentials to access your dashboard</p>
              </div>

              {/* Demo Credentials Quick Fill Buttons */}
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <div className="small fw-bold text-secondary mb-2 text-uppercase" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Quick Demo Fill:
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoFill('admin@jobportal.com', 'password123')}
                    className="btn btn-outline-dark btn-sm flex-fill"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('sarah.jenkins@techcorp.com', 'password123')}
                    className="btn btn-outline-primary btn-sm flex-fill"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Recruiter
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('alex.morgan@example.com', 'password123')}
                    className="btn btn-outline-success btn-sm flex-fill"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Job Seeker
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top small text-secondary">
                Don't have an account yet?{' '}
                <Link to="/register" className="fw-semibold text-primary text-decoration-none">
                  Create an Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
