import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    description: '',
    requirements: '',
    skills: '',
    location: '',
    employment_type: 'Full Time',
    salary: '',
    experience_required: '',
    last_date: '',
    status: 'Active'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.success && res.job) {
          setFormData({
            title: res.job.title || '',
            company_name: res.job.company_name || '',
            description: res.job.description || '',
            requirements: res.job.requirements || '',
            skills: res.job.skills || '',
            location: res.job.location || '',
            employment_type: res.job.employment_type || 'Full Time',
            salary: res.job.salary || '',
            experience_required: res.job.experience_required || '',
            last_date: res.job.last_date ? res.job.last_date.substring(0, 10) : '',
            status: res.job.status || 'Active'
          });
        }
      } catch (err) {
        console.error('Failed to load job:', err);
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

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

    setSaving(true);
    try {
      const res = await api.put(`/jobs/${id}`, formData);
      if (res.success) {
        navigate('/recruiter/jobs');
      }
    } catch (err) {
      setError(err.message || 'Failed to update job posting.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9">
            <div className="card shadow-sm border-0 rounded-4 p-4">
              <div className="mb-4 border-bottom pb-3">
                <span className="badge bg-warning-subtle text-warning border border-warning px-3 py-1 rounded-pill mb-2 fw-semibold">
                  Update Listing
                </span>
                <h3 className="fw-bold text-dark mb-1">Edit Job Posting</h3>
                <p className="text-secondary small mb-0">Modify job details, deadlines, and requirements</p>
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
                  <button type="submit" className="btn btn-primary fw-semibold px-4" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
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

export default EditJob;
