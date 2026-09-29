import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import JobCard from '../../components/JobCard';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/jobs?status=Active')
        ]);

        if (appsRes.success) setApplications(appsRes.applications || []);
        if (jobsRes.success) setRecommendedJobs((jobsRes.jobs || []).slice(0, 3));
      } catch (err) {
        console.error('Failed to load seeker dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalApplied = applications.length;
  const underReview = applications.filter((a) => a.status === 'Under Review').length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const selected = applications.filter((a) => a.status === 'Selected').length;

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        {/* Welcome Banner */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill mb-2 fw-semibold">
              Candidate Portal
            </span>
            <h2 className="fw-bold text-dark mb-1">Welcome, {user?.name}!</h2>
            <p className="text-secondary mb-0">
              Track your job applications, view shortlisted statuses, and explore personalized openings.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/jobs" className="btn btn-primary fw-semibold px-3">
              <i className="bi bi-search me-1"></i> Search Jobs
            </Link>
            <Link to="/seeker/profile" className="btn btn-outline-secondary fw-semibold px-3">
              <i className="bi bi-pencil-square me-1"></i> Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <StatsCard
              title="Applied Jobs"
              value={totalApplied}
              icon="bi-file-earmark-text"
              color="primary"
              subtitle="Total submissions"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatsCard
              title="Under Review"
              value={underReview}
              icon="bi-hourglass-split"
              color="info"
              subtitle="Evaluating profile"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatsCard
              title="Shortlisted"
              value={shortlisted}
              icon="bi-star-fill"
              color="warning"
              subtitle="Passed initial screen"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatsCard
              title="Selected"
              value={selected}
              icon="bi-check-circle-fill"
              color="success"
              subtitle="Offer stage"
            />
          </div>
        </div>

        {/* Two-Column Section: Recent Applications & Recommended Jobs */}
        <div className="row g-4">
          {/* Recent Applications */}
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Recent Applications</h5>
                <Link to="/seeker/applications" className="small text-primary fw-semibold text-decoration-none">
                  View All ({applications.length})
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              ) : applications.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Applied On</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {applications.slice(0, 5).map((app) => (
                        <tr key={app.id}>
                          <td className="fw-semibold text-dark">
                            <Link to={`/jobs/${app.job_id}`} className="text-decoration-none text-dark">
                              {app.job_title}
                            </Link>
                          </td>
                          <td className="text-secondary">{app.company_name}</td>
                          <td className="text-muted">{app.applied_date ? app.applied_date.substring(0, 10) : 'Recent'}</td>
                          <td>
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="text-end">
                            <Link to={`/jobs/${app.job_id}`} className="btn btn-outline-primary btn-sm py-0 px-2" style={{ fontSize: '0.78rem' }}>
                              Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                  You haven't submitted any job applications yet.
                  <div className="mt-2">
                    <Link to="/jobs" className="btn btn-primary btn-sm">
                      Find Jobs Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="col-12 col-lg-4">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Recommended</h5>
                <Link to="/jobs" className="small text-primary fw-semibold text-decoration-none">
                  More Jobs
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="p-3 border rounded-3 bg-light">
                      <h6 className="fw-bold text-dark mb-1">
                        <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">
                          {job.title}
                        </Link>
                      </h6>
                      <div className="small text-muted mb-2">
                        {job.company_name} &bull; {job.location}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-primary-subtle text-primary small">
                          {job.employment_type}
                        </span>
                        <Link to={`/jobs/${job.id}`} className="btn btn-outline-dark btn-sm py-0 px-2" style={{ fontSize: '0.75rem' }}>
                          Apply
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
