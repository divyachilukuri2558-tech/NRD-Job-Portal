import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application state
  const [existingApplication, setExistingApplication] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(null);
  const [applyError, setApplyError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.success && res.job) {
          setJob(res.job);
        }

        // If user is a seeker, check if they already applied
        if (isAuthenticated && user?.role === 'seeker') {
          const appsRes = await api.get('/applications/my');
          if (appsRes.success && appsRes.applications) {
            const found = appsRes.applications.find((a) => a.job_id === Number(id));
            if (found) {
              setExistingApplication(found);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
        setError('Job posting not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, isAuthenticated, user]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError(null);
    setApplySuccess(null);

    try {
      const res = await api.post('/applications', {
        jobId: Number(id),
        cover_note: coverNote
      });

      if (res.success) {
        setApplySuccess('Your application has been submitted successfully!');
        setExistingApplication({ status: 'Applied', applied_date: new Date().toISOString() });
        // Close modal if bootstrap is available
        const modalEl = document.getElementById('applyModal');
        if (modalEl && window.bootstrap) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }
      }
    } catch (err) {
      setApplyError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading job...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning d-inline-block px-4 py-3">
          <h5>Job Not Found</h5>
          <p className="mb-3">{error || 'This job does not exist.'}</p>
          <Link to="/jobs" className="btn btn-primary btn-sm">
            Browse Other Openings
          </Link>
        </div>
      </div>
    );
  }

  const skillsList = job.skills
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="py-5 bg-light">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/jobs" className="text-decoration-none">Jobs</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{job.title}</li>
          </ol>
        </nav>

        {/* Success Alert */}
        {applySuccess && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {applySuccess}
            <button type="button" className="btn-close" onClick={() => setApplySuccess(null)}></button>
          </div>
        )}

        <div className="row g-4">
          {/* Main Job Content */}
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
              {/* Header */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 pb-3 border-bottom">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                      {job.employment_type}
                    </span>
                    <span className={`badge ${job.status === 'Active' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger'}`}>
                      {job.status}
                    </span>
                  </div>
                  <h2 className="fw-bold text-dark mb-1">{job.title}</h2>
                  <div className="text-muted fw-semibold fs-5">
                    <i className="bi bi-building me-1 text-secondary"></i>
                    {job.company_name}
                  </div>
                </div>

                {/* Apply Button in Header */}
                <div>
                  {!isAuthenticated ? (
                    <button
                      onClick={() => navigate('/login', { state: { from: `/jobs/${id}` } })}
                      className="btn btn-primary fw-semibold px-4 py-2"
                    >
                      Log in to Apply
                    </button>
                  ) : user?.role === 'seeker' ? (
                    existingApplication ? (
                      <div className="d-flex flex-column align-items-end">
                        <span className="badge bg-success-subtle text-success border border-success px-3 py-2 fs-6">
                          <i className="bi bi-check-circle-fill me-1"></i> Already Applied
                        </span>
                        <div className="small text-muted mt-1">
                          Status: <StatusBadge status={existingApplication.status} />
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary fw-semibold px-4 py-2"
                        data-bs-toggle="modal"
                        data-bs-target="#applyModal"
                        disabled={job.status === 'Closed'}
                      >
                        <i className="bi bi-send-fill me-1"></i> Apply Now
                      </button>
                    )
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary p-2">
                      Employer / Admin Mode
                    </span>
                  )}
                </div>
              </div>

              {/* Key Overview Grid */}
              <div className="row g-3 py-3 border-bottom text-secondary">
                <div className="col-6 col-md-3">
                  <div className="small text-muted">Location</div>
                  <div className="fw-semibold text-dark">
                    <i className="bi bi-geo-alt text-primary me-1"></i>
                    {job.location}
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-muted">Offered Salary</div>
                  <div className="fw-semibold text-dark">
                    <i className="bi bi-cash-stack text-success me-1"></i>
                    {job.salary || 'Competitive'}
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-muted">Experience</div>
                  <div className="fw-semibold text-dark">
                    <i className="bi bi-briefcase text-info me-1"></i>
                    {job.experience_required || 'Not specified'}
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-muted">Deadline</div>
                  <div className="fw-semibold text-dark">
                    <i className="bi bi-calendar-event text-danger me-1"></i>
                    {job.last_date || 'Open until filled'}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="my-4">
                <h5 className="fw-bold text-dark mb-3">Job Description</h5>
                <p className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                  {job.description}
                </p>
              </div>

              {/* Requirements Section */}
              {job.requirements && (
                <div className="my-4 pt-3 border-top">
                  <h5 className="fw-bold text-dark mb-3">Requirements & Qualifications</h5>
                  <p className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                    {job.requirements}
                  </p>
                </div>
              )}

              {/* Skills Section */}
              {skillsList.length > 0 && (
                <div className="my-4 pt-3 border-top">
                  <h5 className="fw-bold text-dark mb-3">Required Skills</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {skillsList.map((skill, index) => (
                      <span key={index} className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-12 col-lg-4">
            {/* Company Card */}
            <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
              <h5 className="fw-bold text-dark mb-3">About the Company</h5>
              <h6 className="fw-bold text-primary mb-2">{job.company_name}</h6>
              <p className="text-secondary small mb-3">
                {job.company_description || 'A verified technology enterprise actively seeking skilled candidates.'}
              </p>
              <ul className="list-unstyled small text-secondary mb-3">
                <li className="mb-2">
                  <i className="bi bi-geo-alt-fill text-muted me-2"></i>
                  {job.company_location || job.location}
                </li>
                {job.company_website && (
                  <li className="mb-2">
                    <i className="bi bi-globe text-muted me-2"></i>
                    <a href={job.company_website} target="_blank" rel="noreferrer" className="text-decoration-none">
                      Visit Website
                    </a>
                  </li>
                )}
                <li>
                  <i className="bi bi-people-fill text-muted me-2"></i>
                  Active Postings: {job.applications_count ? `${job.applications_count} applicants` : 'Hiring'}
                </li>
              </ul>
            </div>

            {/* Quick Share / Info */}
            <div className="bg-white p-4 rounded-3 shadow-sm border">
              <h6 className="fw-bold text-dark mb-2">Job Overview</h6>
              <ul className="list-unstyled small text-secondary mb-0">
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span>Posted Date:</span>
                  <span className="fw-semibold text-dark">{job.posted_date}</span>
                </li>
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span>Employment:</span>
                  <span className="fw-semibold text-dark">{job.employment_type}</span>
                </li>
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span>Job ID:</span>
                  <span className="fw-semibold text-dark">#JOB-{job.id}</span>
                </li>
                <li className="d-flex justify-content-between py-2">
                  <span>Status:</span>
                  <span className="fw-semibold text-dark">{job.status}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <div className="modal fade" id="applyModal" tabIndex="-1" aria-labelledby="applyModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleApplySubmit}>
              <div className="modal-header">
                <h5 className="modal-title fw-bold" id="applyModalLabel">
                  Apply for {job.title}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {applyError && (
                  <div className="alert alert-danger small mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                    {applyError}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Applicant Name</label>
                  <input type="text" className="form-control" value={user?.name || ''} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Applicant Email</label>
                  <input type="email" className="form-control" value={user?.email || ''} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Cover Note / Why should we hire you? (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Describe your relevant skills, projects, and passion for this role..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                  ></textarea>
                </div>
                <p className="text-muted small mb-0">
                  Your registered profile information (skills, education, and experience) will be automatically sent to the recruiter.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={applying}>
                  {applying ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
