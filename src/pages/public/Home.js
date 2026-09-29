import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import JobCard from '../../components/JobCard';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/jobs?status=Active');
        if (res.success && res.jobs) {
          setFeaturedJobs(res.jobs.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.set('search', searchTerm);
    if (locationTerm) queryParams.set('location', locationTerm);
    navigate(`/jobs?${queryParams.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-white text-center py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-9">
              <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-2 rounded-pill mb-3 fw-semibold">
                <i className="bi bi-stars me-1"></i> Verified Tech Career Opportunities
              </span>
              <h1 className="display-4 fw-extrabold mb-3 tracking-tight">
                Discover Your Dream Career with <span className="text-info">JobPortal</span>
              </h1>
              <p className="lead text-light mb-4 px-md-5" style={{ opacity: 0.9 }}>
                Connecting skilled job seekers with leading companies. Explore curated tech opportunities
                spanning Java, React, Node.js, Cloud, and Full Stack development.
              </p>

              {/* Hero Search Box */}
              <div className="hero-search-card text-dark text-start mx-auto mt-4" style={{ maxWidth: 850 }}>
                <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
                  <div className="col-12 col-md-5">
                    <label className="visually-hidden">Job Title or Keyword</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-primary"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 py-2"
                        placeholder="Job title, skills (e.g. Java, React)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="visually-hidden">Location</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-geo-alt text-primary"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 py-2"
                        placeholder="City or Remote..."
                        value={locationTerm}
                        onChange={(e) => setLocationTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-3">
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                      <i className="bi bi-arrow-right-circle me-1"></i> Find Jobs
                    </button>
                  </div>
                </form>

                {/* Popular searches */}
                <div className="mt-3 pt-2 border-top d-flex flex-wrap align-items-center gap-2 small text-muted">
                  <span className="fw-semibold">Popular:</span>
                  <Link to="/jobs?search=Java" className="badge bg-light text-secondary text-decoration-none">
                    Java
                  </Link>
                  <Link to="/jobs?search=React" className="badge bg-light text-secondary text-decoration-none">
                    React.js
                  </Link>
                  <Link to="/jobs?search=Node.js" className="badge bg-light text-secondary text-decoration-none">
                    Node.js
                  </Link>
                  <Link to="/jobs?search=Full+Stack" className="badge bg-light text-secondary text-decoration-none">
                    Full Stack
                  </Link>
                  <Link to="/jobs?location=Remote" className="badge bg-light text-secondary text-decoration-none">
                    Remote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Ribbon */}
      <section className="bg-white border-bottom py-4">
        <div className="container">
          <div className="row text-center g-3">
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-primary mb-0">500+</h3>
              <p className="text-secondary small mb-0">Active Job Openings</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-primary mb-0">120+</h3>
              <p className="text-secondary small mb-0">Recruiting Companies</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-primary mb-0">15,000+</h3>
              <p className="text-secondary small mb-0">Registered Seekers</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="fw-bold text-primary mb-0">98%</h3>
              <p className="text-secondary small mb-0">Application Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">Featured Tech Openings</h2>
              <p className="text-secondary mb-0">Handpicked opportunities from verified recruiters</p>
            </div>
            <Link to="/jobs" className="btn btn-outline-primary mt-3 mt-md-0 fw-semibold">
              Browse All Jobs <i className="bi bi-chevron-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading jobs...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredJobs.map((job) => (
                <div key={job.id} className="col-12 col-md-6 col-lg-4">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works section */}
      <section className="bg-white py-5 border-top border-bottom">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5">
            <h2 className="fw-bold text-dark mb-2">How JobPortal Works</h2>
            <p className="text-secondary">Simple, transparent, and direct recruitment in three steps</p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4 text-center">
              <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                <i className="bi bi-person-plus-fill fs-3"></i>
              </div>
              <h5 className="fw-bold">1. Create Your Profile</h5>
              <p className="text-secondary small px-3">
                Register as a job seeker or employer. Add your skills, work experience, and educational background.
              </p>
            </div>

            <div className="col-12 col-md-4 text-center">
              <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                <i className="bi bi-search fs-3"></i>
              </div>
              <h5 className="fw-bold">2. Search & Apply</h5>
              <p className="text-secondary small px-3">
                Browse through filtered jobs by skill, location, employment type, and salary. Apply with 1-click.
              </p>
            </div>

            <div className="col-12 col-md-4 text-center">
              <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                <i className="bi bi-briefcase-fill fs-3"></i>
              </div>
              <h5 className="fw-bold">3. Get Hired</h5>
              <p className="text-secondary small px-3">
                Track your application statuses from Under Review to Shortlisted and Selected in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Call to Action */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-3">
          <div className="row align-items-center justify-content-between g-4">
            <div className="col-12 col-lg-8">
              <h2 className="fw-bold mb-2">Are You an Employer Hiring Tech Talent?</h2>
              <p className="text-light mb-0" style={{ opacity: 0.85 }}>
                Post your openings to reach qualified candidates. Manage applicants, review resumes,
                and shortlist candidates seamlessly through our recruiter dashboard.
              </p>
            </div>
            <div className="col-12 col-lg-4 text-lg-end">
              <Link to="/register" className="btn btn-primary btn-lg fw-semibold px-4">
                Post a Job Now <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
