import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { api } from '../../services/api';
import StatsCard from '../../components/StatsCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const employmentChartRef = useRef(null);
  const statusChartRef = useRef(null);
  const roleChartRef = useRef(null);

  const employmentChartInstance = useRef(null);
  const statusChartInstance = useRef(null);
  const roleChartInstance = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/statistics');
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Initialize and update Chart.js instances
  useEffect(() => {
    if (!stats) return;

    // 1. Jobs by Employment Type (Doughnut Chart)
    if (employmentChartRef.current) {
      if (employmentChartInstance.current) employmentChartInstance.current.destroy();

      const ctx1 = employmentChartRef.current.getContext('2d');
      const empLabels = Object.keys(stats.jobsByEmploymentType || {});
      const empData = Object.values(stats.jobsByEmploymentType || {});

      employmentChartInstance.current = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: empLabels,
          datasets: [
            {
              data: empData,
              backgroundColor: ['#2563eb', '#06b6d4', '#8b5cf6', '#f97316'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    // 2. Applications by Status (Bar Chart)
    if (statusChartRef.current) {
      if (statusChartInstance.current) statusChartInstance.current.destroy();

      const ctx2 = statusChartRef.current.getContext('2d');
      const statusLabels = Object.keys(stats.applicationsByStatus || {});
      const statusData = Object.values(stats.applicationsByStatus || {});

      statusChartInstance.current = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: statusLabels,
          datasets: [
            {
              label: 'Applications',
              data: statusData,
              backgroundColor: ['#64748b', '#0284c7', '#f59e0b', '#ef4444', '#10b981'],
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // 3. Users by Role (Pie Chart)
    if (roleChartRef.current) {
      if (roleChartInstance.current) roleChartInstance.current.destroy();

      const ctx3 = roleChartRef.current.getContext('2d');
      const roleLabels = ['Job Seekers', 'Recruiters', 'Admins'];
      const roleData = [
        stats.usersByRole?.seeker || 0,
        stats.usersByRole?.recruiter || 0,
        stats.usersByRole?.admin || 0
      ];

      roleChartInstance.current = new Chart(ctx3, {
        type: 'pie',
        data: {
          labels: roleLabels,
          datasets: [
            {
              data: roleData,
              backgroundColor: ['#10b981', '#3b82f6', '#475569'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    return () => {
      if (employmentChartInstance.current) employmentChartInstance.current.destroy();
      if (statusChartInstance.current) statusChartInstance.current.destroy();
      if (roleChartInstance.current) roleChartInstance.current.destroy();
    };
  }, [stats]);

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        {/* Header */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 rounded-pill mb-2 fw-semibold">
              Administrator Console
            </span>
            <h2 className="fw-bold text-dark mb-1">System Overview & Analytics</h2>
            <p className="text-secondary mb-0">Platform-wide statistics, user management, and job governance</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/users" className="btn btn-outline-secondary fw-semibold px-3">
              <i className="bi bi-people me-1"></i> Users
            </Link>
            <Link to="/admin/jobs" className="btn btn-primary fw-semibold px-3">
              <i className="bi bi-briefcase me-1"></i> All Jobs
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : stats ? (
          <>
            {/* Top Metrics Row */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-4 col-lg-2">
                <StatsCard title="Total Users" value={stats.totalUsers} icon="bi-people" color="primary" />
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <StatsCard title="Seekers" value={stats.totalSeekers} icon="bi-person-badge" color="success" />
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <StatsCard title="Recruiters" value={stats.totalRecruiters} icon="bi-building" color="info" />
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <StatsCard title="Total Jobs" value={stats.totalJobs} icon="bi-briefcase" color="warning" />
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <StatsCard title="Active Jobs" value={stats.activeJobs} icon="bi-check-all" color="success" />
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <StatsCard title="Applications" value={stats.totalApplications} icon="bi-file-earmark-text" color="danger" />
              </div>
            </div>

            {/* Visual Analytics with Chart.js */}
            <div className="row g-4 mb-4">
              {/* Jobs by Employment Type */}
              <div className="col-12 col-md-4">
                <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
                  <h6 className="fw-bold text-dark mb-3">Jobs by Employment Type</h6>
                  <div className="chart-container">
                    <canvas ref={employmentChartRef}></canvas>
                  </div>
                </div>
              </div>

              {/* Applications by Status */}
              <div className="col-12 col-md-4">
                <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
                  <h6 className="fw-bold text-dark mb-3">Applications by Status</h6>
                  <div className="chart-container">
                    <canvas ref={statusChartRef}></canvas>
                  </div>
                </div>
              </div>

              {/* Users by Role */}
              <div className="col-12 col-md-4">
                <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
                  <h6 className="fw-bold text-dark mb-3">Platform Users Breakdown</h6>
                  <div className="chart-container">
                    <canvas ref={roleChartRef}></canvas>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="card p-3 border-0 shadow-sm rounded-3 bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">Manage Platform Users</h6>
                      <p className="text-secondary small mb-0">View or delete registered candidate and employer accounts</p>
                    </div>
                    <Link to="/admin/users" className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card p-3 border-0 shadow-sm rounded-3 bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">Review All Job Postings</h6>
                      <p className="text-secondary small mb-0">Audit listings and remove inappropriate posts</p>
                    </div>
                    <Link to="/admin/jobs" className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card p-3 border-0 shadow-sm rounded-3 bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">Applications Overview</h6>
                      <p className="text-secondary small mb-0">Inspect candidate applications across all companies</p>
                    </div>
                    <Link to="/admin/applications" className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="alert alert-warning">Failed to load platform statistics.</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
