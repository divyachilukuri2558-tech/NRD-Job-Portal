import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/admin/applications');
        if (res.success) {
          setApplications(res.applications || []);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
        setMessage({ type: 'danger', text: 'Failed to retrieve applications.' });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchSearch =
      !searchTerm ||
      app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">Portal Applications Audit</h2>
          <p className="text-secondary mb-0">Platform-wide log of candidate applications and progression stages</p>
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
              <label className="form-label small fw-semibold text-secondary">Filter by Stage / Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses ({applications.length})</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-12 col-md-8">
              <label className="form-label small fw-semibold text-secondary">Search Applications</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by candidate name, job title, or company..."
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
              Applications Record ({filteredApplications.length})
            </h6>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : filteredApplications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th className="ps-4">Application ID</th>
                      <th>Candidate</th>
                      <th>Email</th>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Applied Date</th>
                      <th className="pe-4">Stage Status</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {filteredApplications.map((app) => (
                      <tr key={app.id}>
                        <td className="ps-4 text-muted">#APP-{app.id}</td>
                        <td className="fw-semibold text-dark">{app.applicant_name}</td>
                        <td className="text-secondary">{app.applicant_email}</td>
                        <td className="text-dark fw-medium">{app.job_title}</td>
                        <td className="text-secondary">{app.company_name}</td>
                        <td className="text-muted">{app.applied_date ? app.applied_date.substring(0, 10) : 'Recent'}</td>
                        <td className="pe-4">
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-secondary">
                <i className="bi bi-file-earmark-x fs-1 d-block mb-3 text-muted"></i>
                <h5 className="fw-bold text-dark">No Applications Found</h5>
                <p className="text-muted mb-0">No records match the filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;
