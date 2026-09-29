import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom mt-auto">
      <div className="container">
        <div className="row g-4 py-3">
          <div className="col-12 col-md-4">
            <h5 className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-briefcase-fill text-primary"></i>
              JobPortal
            </h5>
            <p className="small text-secondary">
              A comprehensive Job Portal Web Application built strictly adhering to the NRD Lab
              curriculum and technology stack. Connecting job seekers and recruiters with real-time
              REST APIs, JWT authentication, and MySQL relational persistence.
            </p>
            <div className="d-flex gap-3 text-secondary fs-5 mt-3">
              <i className="bi bi-github"></i>
              <i className="bi bi-linkedin"></i>
              <i className="bi bi-twitter-x"></i>
              <i className="bi bi-envelope"></i>
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-white fw-bold mb-3">Job Seekers</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/jobs">Search Jobs</Link></li>
              <li className="mb-2"><Link to="/seeker/applications">My Applications</Link></li>
              <li className="mb-2"><Link to="/seeker/profile">Seeker Profile</Link></li>
              <li className="mb-2"><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-white fw-bold mb-3">Recruiters</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/recruiter/create-job">Post a Job</Link></li>
              <li className="mb-2"><Link to="/recruiter/jobs">Manage Postings</Link></li>
              <li className="mb-2"><Link to="/recruiter/applications">Applicant Tracking</Link></li>
              <li className="mb-2"><Link to="/register">Recruiter Signup</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-4">
            <h6 className="text-white fw-bold mb-3">Allowed Technologies</h6>
            <div className="d-flex flex-wrap gap-1 mb-3">
              <span className="badge bg-dark border border-secondary">React.js</span>
              <span className="badge bg-dark border border-secondary">React Router</span>
              <span className="badge bg-dark border border-secondary">Node.js</span>
              <span className="badge bg-dark border border-secondary">Express.js</span>
              <span className="badge bg-dark border border-secondary">REST API</span>
              <span className="badge bg-dark border border-secondary">JWT Auth</span>
              <span className="badge bg-dark border border-secondary">MySQL</span>
              <span className="badge bg-dark border border-secondary">Bootstrap 5</span>
              <span className="badge bg-dark border border-secondary">Chart.js</span>
            </div>
            <p className="small text-secondary mb-0">
              Reference: <a href="https://github.com/saikirandodle/NRD_LAB" target="_blank" rel="noreferrer" className="text-info">saikirandodle/NRD_LAB</a>
            </p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary pb-3">
          <p className="mb-2 mb-md-0">
            &copy; {new Date().getFullYear()} JobPortal Web Application. Designed for NRD Laboratory practice.
          </p>
          <div className="d-flex gap-3">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
