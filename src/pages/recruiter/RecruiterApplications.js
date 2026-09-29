import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const RecruiterApplications = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || 'All';

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          api.get('/applications/recruiter'),
          api.get('/jobs/recruiter/my')
        ]);
        if (appsRes.success) setApplications(appsRes.applications || []);
        if (jobsRes.success) setJobs(jobsRes.jobs || []);
      } catch (err) {
        console.error('Failed to load applications:', err);
        setMessage({ type: 'danger', text: 'Failed to retrieve applications.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      const res = await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      if (res.success) {
        setMessage({ type: 'success', text: `Application status updated to '${newStatus}'.` });
        setApplications((prev) =>
          prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
        );
        if (selectedCandidate && selectedCandidate.id === applicationId) {
          setSelectedCandidate((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to update status.' });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchJob = selectedJob === 'All' || app.job_id === Number(selectedJob);
    const matchStatus = selectedStatus === 'All' || app.status === selectedStatus;
    const matchSearch =
      !searchTerm ||
      app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.skills?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchJob && matchStatus && matchSearch;
  });

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">Applicant Management</h2>
          <p className="text-secondary mb-0">
            Review candidate qualifications, cover notes, and manage application stages
          </p>
        </div>

        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
          </div>
        )}

        {/* Filter Controls */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-secondary">Filter by Job Posting</label>
              <select
                className="form-select"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <option value="All">All Jobs ({jobs.length})</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-secondary">Filter by Stage / Status</label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-secondary">Search Candidate</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Candidate name or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0 text-dark">
              Candidates ({filteredApplications.length})
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
                      <th className="ps-4">Candidate Name</th>
                      <th>Applied Position</th>
                      <th>Contact Email</th>
                      <th>Applied Date</th>
                      <th>Current Status</th>
                      <th>Update Stage</th>
                      <th className="text-end pe-4">Candidate Details</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {filteredApplications.map((app) => (
                      <tr key={app.id}>
                        <td className="ps-4 fw-semibold text-dark">
                          <button
                            type="button"
                            className="btn btn-link text-decoration-none p-0 fw-semibold text-start text-dark"
                            data-bs-toggle="modal"
                            data-bs-target="#candidateModal"
                            onClick={() => setSelectedCandidate(app)}
                          >
                            {app.applicant_name}
                          </button>
                        </td>
                        <td className="text-secondary">{app.job_title}</td>
                        <td className="text-muted">{app.applicant_email}</td>
                        <td className="text-muted">{app.applied_date ? app.applied_date.substring(0, 10) : 'Recent'}</td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            style={{ width: 140 }}
                            value={app.status}
                            disabled={updatingId === app.id}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="text-end pe-4">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm py-1 px-3"
                            data-bs-toggle="modal"
                            data-bs-target="#candidateModal"
                            onClick={() => setSelectedCandidate(app)}
                          >
                            <i className="bi bi-file-earmark-person me-1"></i> View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-secondary">
                <i className="bi bi-person-x fs-1 d-block mb-3 text-muted"></i>
                <h5 className="fw-bold text-dark">No Candidates Found</h5>
                <p className="text-muted mb-0">No applications match your selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Profile Modal */}
      <div className="modal fade" id="candidateModal" tabIndex="-1" aria-labelledby="candidateModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {selectedCandidate ? (
              <>
                <div className="modal-header bg-light">
                  <div>
                    <h5 className="modal-title fw-bold text-dark" id="candidateModalLabel">
                      {selectedCandidate.applicant_name}
                    </h5>
                    <div className="small text-muted">
                      Applied for: <strong>{selectedCandidate.job_title}</strong>
                    </div>
                  </div>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div className="modal-body p-4">
                  {/* Status & Contact Banner */}
                  <div className="p-3 bg-light rounded-3 mb-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="small text-secondary">
                      <span className="me-3"><i className="bi bi-envelope text-primary me-1"></i> {selectedCandidate.applicant_email}</span>
                      <span><i className="bi bi-telephone text-primary me-1"></i> {selectedCandidate.applicant_phone || 'No phone'}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="small text-muted">Status:</span>
                      <StatusBadge status={selectedCandidate.status} />
                    </div>
                  </div>

                  {/* Headline & Bio */}
                  {selectedCandidate.resume_headline && (
                    <div className="mb-3">
                      <h6 className="fw-bold text-dark mb-1">Professional Headline</h6>
                      <p className="text-secondary small">{selectedCandidate.resume_headline}</p>
                    </div>
                  )}

                  {selectedCandidate.bio && (
                    <div className="mb-3">
                      <h6 className="fw-bold text-dark mb-1">About / Summary</h6>
                      <p className="text-secondary small">{selectedCandidate.bio}</p>
                    </div>
                  )}

                  {/* Cover Note */}
                  {selectedCandidate.cover_note && (
                    <div className="mb-3 p-3 bg-warning-subtle rounded-3 border border-warning-subtle">
                      <h6 className="fw-bold text-dark mb-1">
                        <i className="bi bi-chat-quote-fill text-warning me-1"></i> Candidate's Cover Note
                      </h6>
                      <p className="text-dark small mb-0 fst-italic">"{selectedCandidate.cover_note}"</p>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="mb-3">
                    <h6 className="fw-bold text-dark mb-2">Technical Skills</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedCandidate.skills ? (
                        selectedCandidate.skills.split(',').map((s, idx) => (
                          <span key={idx} className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                            {s.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small">Not provided</span>
                      )}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="mb-3">
                    <h6 className="fw-bold text-dark mb-1">Education</h6>
                    <p className="text-secondary small mb-0" style={{ whiteSpace: 'pre-line' }}>
                      {selectedCandidate.education || 'Not provided'}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mb-3">
                    <h6 className="fw-bold text-dark mb-1">Experience</h6>
                    <p className="text-secondary small mb-0" style={{ whiteSpace: 'pre-line' }}>
                      {selectedCandidate.experience || 'Not provided'}
                    </p>
                  </div>

                  {/* Update Status from Modal */}
                  <hr className="my-3" />
                  <div className="d-flex align-items-center gap-3">
                    <label className="fw-bold text-dark small mb-0">Change Application Status:</label>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: 180 }}
                      value={selectedCandidate.status}
                      disabled={updatingId === selectedCandidate.id}
                      onChange={(e) => handleStatusChange(selectedCandidate.id, e.target.value)}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                    Close
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterApplications;
