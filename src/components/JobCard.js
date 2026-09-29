import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const getEmploymentBadge = (type) => {
    switch (type) {
      case 'Full Time':
        return 'badge-full-time';
      case 'Part Time':
        return 'badge-part-time';
      case 'Internship':
        return 'badge-internship';
      case 'Contract':
        return 'badge-contract';
      default:
        return 'bg-light text-dark';
    }
  };

  const skillsList = job.skills
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="card job-card h-100 shadow-sm p-3">
      <div className="card-body d-flex flex-column">
        {/* Top Header */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="card-title fw-bold text-dark mb-1">
              <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">
                {job.title}
              </Link>
            </h5>
            <div className="text-muted small fw-medium">
              <i className="bi bi-building me-1"></i>
              {job.company_name}
            </div>
          </div>
          <span className={`badge ${getEmploymentBadge(job.employment_type)} px-2 py-1`}>
            {job.employment_type}
          </span>
        </div>

        {/* Key Info row */}
        <div className="d-flex flex-wrap gap-3 text-secondary small my-2">
          <div>
            <i className="bi bi-geo-alt me-1 text-primary"></i>
            {job.location}
          </div>
          {job.salary && (
            <div>
              <i className="bi bi-cash-stack me-1 text-success"></i>
              {job.salary}
            </div>
          )}
          {job.experience_required && (
            <div>
              <i className="bi bi-briefcase me-1 text-secondary"></i>
              {job.experience_required}
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="card-text text-secondary small mb-3 flex-grow-1">
          {job.description?.length > 130
            ? `${job.description.substring(0, 130)}...`
            : job.description}
        </p>

        {/* Skills Tags */}
        {skillsList.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {skillsList.slice(0, 4).map((skill, index) => (
              <span key={index} className="badge bg-light text-secondary border small">
                {skill}
              </span>
            ))}
            {skillsList.length > 4 && (
              <span className="badge bg-light text-secondary border small">
                +{skillsList.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer / Action */}
        <div className="pt-2 border-top d-flex justify-content-between align-items-center mt-auto">
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>
            <i className="bi bi-clock me-1"></i>
            Posted {job.posted_date || 'recently'}
          </span>
          <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm px-3">
            View Details <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
