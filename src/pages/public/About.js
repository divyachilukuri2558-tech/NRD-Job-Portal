import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill mb-2 fw-semibold">
            About Our Platform
          </span>
          <h1 className="fw-bold text-dark display-5">Empowering Careers & Hiring</h1>
          <p className="lead text-secondary">
            A full-stack, enterprise-grade Job Portal Web Application engineered strictly using the
            technologies demonstrated in the NRD Lab repository curriculum.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div className="card h-100 p-4 border shadow-sm rounded-3">
              <div className="bg-primary-subtle text-primary rounded-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 48, height: 48 }}>
                <i className="bi bi-shield-lock-fill fs-4"></i>
              </div>
              <h5 className="fw-bold text-dark">Secure JWT Authentication</h5>
              <p className="text-secondary small mb-0">
                End-to-end stateless token authentication with password hashing using bcrypt. Strict
                role-based authorization safeguards seekers, recruiters, and admin actions.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 p-4 border shadow-sm rounded-3">
              <div className="bg-success-subtle text-success rounded-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 48, height: 48 }}>
                <i className="bi bi-database-fill-gear fs-4"></i>
              </div>
              <h5 className="fw-bold text-dark">Relational MySQL Schema</h5>
              <p className="text-secondary small mb-0">
                Structured MySQL database with normalized relational tables, foreign key constraints,
                and parameterized SQL queries to prevent injection vulnerabilities.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 p-4 border shadow-sm rounded-3">
              <div className="bg-info-subtle text-info rounded-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 48, height: 48 }}>
                <i className="bi bi-bar-chart-fill fs-4"></i>
              </div>
              <h5 className="fw-bold text-dark">Visual Analytics via Chart.js</h5>
              <p className="text-secondary small mb-0">
                Interactive real-time visualizations depicting job employment breakdown, application
                pipeline states, and platform user demographics.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Reference Table */}
        <div className="bg-white p-4 rounded-3 border shadow-sm mb-5">
          <h4 className="fw-bold text-dark mb-3">Architectural Technology Stack</h4>
          <p className="text-secondary small mb-4">
            Strict compliance with <a href="https://github.com/saikirandodle/NRD_LAB" target="_blank" rel="noreferrer" className="text-primary fw-semibold">NRD_LAB</a> requirements:
          </p>

          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Layer</th>
                  <th>Technology</th>
                  <th>NRD Lab Experiment Reference</th>
                  <th>Usage in Job Portal</th>
                </tr>
              </thead>
              <tbody className="small">
                <tr>
                  <td className="fw-semibold">Frontend Core</td>
                  <td>React.js & React Router</td>
                  <td>Ex 12 & Ex 14</td>
                  <td>Single Page Application (SPA) routing, reusable components, Context API</td>
                </tr>
                <tr>
                  <td className="fw-semibold">UI Styling</td>
                  <td>Bootstrap 5.3 & CSS3</td>
                  <td>Ex 1 & Ex 2</td>
                  <td>Responsive grid, modern navbar, dashboard cards, modals, alerts</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Data Visualization</td>
                  <td>Chart.js</td>
                  <td>Ex 4 & Ex 13</td>
                  <td>Admin dashboard statistics charts (employment types, application stages)</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Backend Engine</td>
                  <td>Node.js & Express.js</td>
                  <td>Ex 9, Ex 10, Ex 11</td>
                  <td>RESTful API routing, controllers, middleware pipeline</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Security & Auth</td>
                  <td>JWT & Bcrypt.js</td>
                  <td>Ex 11</td>
                  <td>Token verification, role-based authorization, hashed passwords</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Database</td>
                  <td>MySQL & SQL Queries</td>
                  <td>Ex 5 & Ex 7</td>
                  <td>Relational tables, parameterized SQL, duplicate application guards</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center py-4 bg-primary-subtle rounded-3 p-4">
          <h4 className="fw-bold text-dark mb-2">Ready to explore open opportunities?</h4>
          <p className="text-secondary mb-3">Start browsing jobs or register your company today.</p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/jobs" className="btn btn-primary px-4 fw-semibold">Browse Jobs</Link>
            <Link to="/register" className="btn btn-outline-primary px-4 fw-semibold">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
