import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/my');
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
      setMessage({ type: 'danger', text: 'Failed to load your applications.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to withdraw your application for "${jobTitle}"?`)) {
      return;
    }

    setWithdrawingId(applicationId);
    try {
      const res = await api.delete(`/applications/${applicationId}`);
      if (res.success) {
        setMessage({ type: 'success', text: `Application for "${jobTitle}" was withdrawn successfully.` });
        setApplications((prev) => prev.filter((a) => a.id !== applicationId));
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to withdraw application.' });
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">My Applications</h2>
            <p className="text-secondary mb-0">Track application progress across potential employers</p>
          </div>
          <Link to="/jobs" className="btn btn-primary fw-semibold px-4">
            <i className="bi bi-search me-1"></i> Browse More Jobs
          </Link>
        </div>

        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
          </div>
        )}

        {/* Applications Table Card */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0 text-dark">
              Submitted Applications ({applications.length})
            </h6>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading applications...</span>
                </div>
              </div>
            ) : applications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th className="ps-4">Job Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Salary</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td className="ps-4 fw-semibold text-dark">
                          <Link to={`/jobs/${app.job_id}`} className="text-decoration-none text-dark">
                            {app.job_title}
                          </Link>
                        </td>
                        <td className="text-secondary">{app.company_name}</td>
                        <td className="text-secondary">{app.location}</td>
                        <td>
                          <span className="badge bg-light text-secondary border">
                            {app.employment_type}
                          </span>
                        </td>
                        <td className="text-success fw-medium">{app.salary || 'Competitive'}</td>
                        <td className="text-muted">{app.applied_date ? app.applied_date.substring(0, 10) : 'Recent'}</td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            <Link
                              to={`/jobs/${app.job_id}`}
                              className="btn btn-outline-primary btn-sm py-1 px-2"
                              title="View Job Details"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                            <button
                              onClick={() => handleWithdraw(app.id, app.job_title)}
                              className="btn btn-outline-danger btn-sm py-1 px-2"
                              title="Withdraw Application"
                              disabled={withdrawingId === app.id}
                            >
                              {withdrawingId === app.id ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <i className="bi bi-trash"></i>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-secondary">
                <i className="bi bi-journal-x fs-1 d-block mb-3 text-muted"></i>
                <h5 className="fw-bold text-dark">No Applications Yet</h5>
                <p className="text-muted mb-3">You have not submitted applications to any jobs yet.</p>
                <Link to="/jobs" className="btn btn-primary px-4 fw-semibold">
                  Find Your Next Role
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
