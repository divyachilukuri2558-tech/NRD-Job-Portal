import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const AdminManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/admin/jobs');
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error('Failed to load jobs for admin:', err);
      setMessage({ type: 'danger', text: 'Failed to retrieve jobs.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete job "${title}"? This will remove all associated applications.`)) {
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

  const filteredJobs = jobs.filter((j) => {
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    const matchSearch =
      !searchTerm ||
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">Global Job Governance</h2>
          <p className="text-secondary mb-0">Audit job postings platform-wide and moderate inappropriate listings</p>
        </div>

        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-secondary">Filter by Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses ({jobs.length})</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="col-12 col-md-8">
              <label className="form-label small fw-semibold text-secondary">Search Postings</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by job title, company name, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0 text-dark">
              Platform Jobs ({filteredJobs.length})
            </h6>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th className="ps-4">Job Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Salary</th>
                      <th>Status</th>
                      <th>Applicants</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {filteredJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="ps-4 fw-semibold text-dark">
                          <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">
                            {job.title}
                          </Link>
                        </td>
                        <td className="text-secondary">{job.company_name}</td>
                        <td className="text-secondary">{job.location}</td>
                        <td>
                          <span className="badge bg-light text-secondary border">
                            {job.employment_type}
                          </span>
                        </td>
                        <td className="text-success">{job.salary || 'Competitive'}</td>
                        <td>
                          <StatusBadge status={job.status} />
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary border border-primary">
                            {job.applications_count || 0}
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            <Link
                              to={`/jobs/${job.id}`}
                              className="btn btn-outline-primary btn-sm py-1 px-2"
                              title="View Public Details"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                            <button
                              onClick={() => handleDeleteJob(job.id, job.title)}
                              className="btn btn-outline-danger btn-sm py-1 px-2"
                              title="Delete Inappropriate Job"
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
                <h5 className="fw-bold text-dark">No Jobs Found</h5>
                <p className="text-muted mb-0">No postings match the current search filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageJobs;
