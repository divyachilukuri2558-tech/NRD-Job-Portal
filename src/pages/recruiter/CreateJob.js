import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const defaultLastDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    company_name: user?.company_name || '',
    description: '',
    requirements: '',
    skills: '',
    location: '',
    employment_type: 'Full Time',
    salary: '',
    experience_required: '',
    last_date: defaultLastDate,
    status: 'Active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Title, Description, and Location are mandatory fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/jobs', {
        ...formData,
        posted_date: today
      });
      if (res.success) {
        navigate('/recruiter/jobs');
      }
    } catch (err) {
      setError(err.message || 'Failed to create job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9">
            <div className="card shadow-sm border-0 rounded-4 p-4">
              <div className="mb-4 border-bottom pb-3">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill mb-2 fw-semibold">
                  New Opportunity
                </span>
                <h3 className="fw-bold text-dark mb-1">Create Job Posting</h3>
                <p className="text-secondary small mb-0">
                  Publish a new job listing to attract qualified candidates across the portal
                </p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-4" role="alert">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-8">
                    <label className="form-label small fw-semibold text-secondary">Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="e.g. Senior Java Backend Developer"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Employment Type *</label>
                    <select
                      name="employment_type"
                      className="form-select"
                      value={formData.employment_type}
                      onChange={handleChange}
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Company Name</label>
                    <input
                      type="text"
                      name="company_name"
                      className="form-control"
                      placeholder="Company Name"
                      value={formData.company_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Location *</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      placeholder="e.g. Bangalore, India (or Remote)"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Salary / Compensation</label>
                    <input
                      type="text"
                      name="salary"
                      className="form-control"
                      placeholder="e.g. 10 - 15 LPA or Competitive"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Experience Required</label>
                    <input
                      type="text"
                      name="experience_required"
                      className="form-control"
                      placeholder="e.g. 2 - 4 Years or Fresher"
                      value={formData.experience_required}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Application Deadline</label>
                    <input
                      type="date"
                      name="last_date"
                      className="form-control"
                      value={formData.last_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">
                      Required Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      name="skills"
                      className="form-control"
                      placeholder="e.g. Java, JDBC, Spring Boot concepts, MySQL, REST API"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Job Description *</label>
                    <textarea
                      name="description"
                      rows="5"
                      className="form-control"
                      placeholder="Provide comprehensive details about role objectives, daily tasks, and team mission..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Candidate Requirements</label>
                    <textarea
                      name="requirements"
                      rows="4"
                      className="form-control"
                      placeholder="Specify degrees, certifications, key proficiencies, and must-have qualities..."
                      value={formData.requirements}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Job Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Active">Active (Accepting applications)</option>
                      <option value="Closed">Closed (Hidden from seekers)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/recruiter/jobs')}
                    className="btn btn-outline-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary fw-semibold px-4" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Publishing...
                      </>
                    ) : (
                      'Publish Job Opening'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
