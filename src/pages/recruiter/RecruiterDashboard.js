import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs/recruiter/my'),
          api.get('/applications/recruiter')
        ]);

        if (jobsRes.success) setJobs(jobsRes.jobs || []);
        if (appsRes.success) setApplications(appsRes.applications || []);
      } catch (err) {
        console.error('Failed to load recruiter dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'Active').length;
  const totalApps = applications.length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        {/* Welcome Header */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill mb-2 fw-semibold">
              Employer Portal
            </span>
            <h2 className="fw-bold text-dark mb-1">Recruiter Dashboard</h2>
            <p className="text-secondary mb-0">
              Welcome back, {user?.name}. Manage your openings and review applicant profiles.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/recruiter/create-job" className="btn btn-primary fw-semibold px-3">
              <i className="bi bi-plus-lg me-1"></i> Post New Job
            </Link>
            <Link to="/recruiter/jobs" className="btn btn-outline-secondary fw-semibold px-3">
              <i className="bi bi-briefcase me-1"></i> Manage Jobs
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <StatsCard
              title="Total Postings"
              value={totalJobs}
              icon="bi-briefcase-fill"
              color="primary"
              subtitle="All jobs posted"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatsCard
              title="Active Postings"
              value={activeJobs}
              icon="bi-lightning-charge-fill"
              color="success"
              subtitle="Open for applicants"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatsCard
              title="Total Applicants"
              value={totalApps}
              icon="bi-people-fill"
              color="info"
              subtitle="Candidates applied"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatsCard
              title="Shortlisted"
              value={shortlisted}
              icon="bi-star-fill"
              color="warning"
              subtitle="Ready for interview"
            />
          </div>
        </div>

        {/* Active Jobs & Recent Applicants Grid */}
        <div className="row g-4">
          {/* Active Job Postings */}
          <div className="col-12 col-lg-6">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">My Job Postings</h5>
                <Link to="/recruiter/jobs" className="small text-primary fw-semibold text-decoration-none">
                  Manage All ({jobs.length})
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              ) : jobs.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {jobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold text-dark mb-1">
                          <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">
                            {job.title}
                          </Link>
                        </h6>
                        <div className="small text-muted">
                          {job.location} &bull; {job.employment_type}
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-primary text-white d-block mb-1">
                          {job.applications_count || 0} Applicants
                        </span>
                        <StatusBadge status={job.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-briefcase fs-2 d-block mb-2"></i>
                  No job postings yet. Post your first opportunity!
                  <div className="mt-2">
                    <Link to="/recruiter/create-job" className="btn btn-primary btn-sm">
                      Post a Job
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Candidates */}
          <div className="col-12 col-lg-6">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Recent Candidate Applications</h5>
                <Link to="/recruiter/applications" className="small text-primary fw-semibold text-decoration-none">
                  All Applicants ({applications.length})
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              ) : applications.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {applications.slice(0, 4).map((app) => (
                    <div key={app.id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark">{app.applicant_name}</div>
                        <div className="small text-muted">
                          Applied for: <span className="fw-semibold text-secondary">{app.job_title}</span>
                        </div>
                        <div className="small text-muted">{app.applied_date ? app.applied_date.substring(0, 10) : 'Recent'}</div>
                      </div>
                      <div className="text-end">
                        <div className="mb-2">
                          <StatusBadge status={app.status} />
                        </div>
                        <Link to="/recruiter/applications" className="btn btn-outline-primary btn-sm py-0 px-2" style={{ fontSize: '0.75rem' }}>
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-people fs-2 d-block mb-2"></i>
                  No candidates have applied to your jobs yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
