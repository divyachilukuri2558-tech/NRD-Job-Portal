import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [role, setRole] = useState('seeker'); // 'seeker' or 'recruiter'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company_name: '',
    company_description: '',
    company_location: '',
    website: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required.';
    if (!formData.email.trim()) return 'Email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please provide a valid email address.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (role === 'recruiter' && !formData.company_name.trim()) {
      return 'Company Name is required for recruiter accounts.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        role
      };
      const user = await register(payload);
      if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light flex-grow-1 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-7">
            <div className="card shadow-sm border-0 rounded-4 p-4">
              <div className="text-center mb-4">
                <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
                  <i className="bi bi-person-plus-fill fs-4"></i>
                </div>
                <h3 className="fw-bold text-dark">Create an Account</h3>
                <p className="text-secondary small">Join thousands of job seekers and hiring companies</p>
              </div>

              {/* Role Toggle */}
              <div className="d-flex p-1 bg-light rounded-3 mb-4 border">
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`btn flex-fill fw-semibold py-2 ${role === 'seeker' ? 'btn-primary' : 'btn-light text-secondary'}`}
                >
                  <i className="bi bi-person-workspace me-1"></i> Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`btn flex-fill fw-semibold py-2 ${role === 'recruiter' ? 'btn-primary' : 'btn-light text-secondary'}`}
                >
                  <i className="bi bi-building me-1"></i> Employer / Recruiter
                </button>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">
                      {role === 'recruiter' ? 'Contact Person Name' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Email Address *</label>
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

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Recruiter specific fields */}
                  {role === 'recruiter' && (
                    <>
                      <div className="col-12">
                        <hr className="my-2" />
                        <h6 className="fw-bold text-dark small text-uppercase mb-3">Company Details</h6>
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Company Name *</label>
                        <input
                          type="text"
                          name="company_name"
                          className="form-control"
                          placeholder="e.g. InnovateSoft Ltd"
                          value={formData.company_name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Company Location</label>
                        <input
                          type="text"
                          name="company_location"
                          className="form-control"
                          placeholder="e.g. Bangalore, India"
                          value={formData.company_location}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Company Website</label>
                        <input
                          type="url"
                          name="website"
                          className="form-control"
                          placeholder="https://company.example.com"
                          value={formData.website}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">About Company</label>
                        <textarea
                          name="company_description"
                          rows="3"
                          className="form-control"
                          placeholder="Brief description of products, services, and company culture..."
                          value={formData.company_description}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      `Register as ${role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}`
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4 pt-3 border-top small text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="fw-semibold text-primary text-decoration-none">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
