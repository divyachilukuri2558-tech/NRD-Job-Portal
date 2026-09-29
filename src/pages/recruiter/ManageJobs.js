import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/recruiter/my');
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
      setMessage({ type: 'danger', text: 'Failed to load your job listings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
    try {
      const res = await api.put(`/jobs/${job.id}`, {
        ...job,
        status: newStatus
      });
      if (res.success) {
        setMessage({ type: 'success', text: `Job status changed to ${newStatus}.` });
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
        );
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to update job status.' });
    }
  };

  const handleDelete = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete the job posting "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await api.delete(`/jobs/${jobId}`);
      if (res.success) {
        setMessage({ type: 'success', text: `Job "${title}" deleted successfully.` });
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to delete job.' });
    }
  };

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Manage Job Postings</h2>
            <p className="text-secondary mb-0">Review active listings, update status, and inspect applicant responses</p>
          </div>
          <Link to="/recruiter/create-job" className="btn btn-primary fw-semibold px-4">
            <i className="bi bi-plus-lg me-1"></i> Post New Job
          </Link>
        </div>

        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
          </div>
        )}

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0 text-dark">
              All Job Postings ({jobs.length})
            </h6>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading job listings...</span>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th className="ps-4">Job Title</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Salary</th>
                      <th>Deadline</th>
                      <th>Status</th>
                      <th>Applicants</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td className="ps-4 fw-semibold text-dark">
                          <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">
                            {job.title}
                          </Link>
                        </td>
                        <td className="text-secondary">{job.location}</td>
                        <td>
                          <span className="badge bg-light text-secondary border">
                            {job.employment_type}
                          </span>
                        </td>
                        <td className="text-success">{job.salary || 'Competitive'}</td>
                        <td className="text-muted">{job.last_date}</td>
                        <td>
                          <StatusBadge status={job.status} />
                        </td>
                        <td>
                          <Link
                            to={`/recruiter/applications?jobId=${job.id}`}
                            className="badge bg-primary-subtle text-primary border border-primary text-decoration-none px-2 py-1"
                          >
                            <i className="bi bi-people-fill me-1"></i>
                            {job.applications_count || 0} Applicants
                          </Link>
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end gap-1">
                            <button
                              onClick={() => handleToggleStatus(job)}
                              className={`btn btn-sm ${job.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'} py-1 px-2`}
                              title={job.status === 'Active' ? 'Close Job' : 'Reactivate Job'}
                            >
                              <i className={`bi ${job.status === 'Active' ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                            </button>
                            <Link
                              to={`/recruiter/edit-job/${job.id}`}
                              className="btn btn-outline-secondary btn-sm py-1 px-2"
                              title="Edit Job"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button
                              onClick={() => handleDelete(job.id, job.title)}
                              className="btn btn-outline-danger btn-sm py-1 px-2"
                              title="Delete Job"
                            >
                              <i className="bi bi-trash"></i>
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
                <i className="bi bi-briefcase fs-1 d-block mb-3 text-muted"></i>
                <h5 className="fw-bold text-dark">No Job Postings Yet</h5>
                <p className="text-muted mb-3">You haven't posted any jobs. Create your first opening now.</p>
                <Link to="/recruiter/create-job" className="btn btn-primary px-4 fw-semibold">
                  Post a Job
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
