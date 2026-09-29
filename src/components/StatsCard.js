import React from 'react';

const StatsCard = ({ title, value, icon, color = 'primary', subtitle }) => {
  return (
    <div className="card dashboard-card h-100 p-3 shadow-sm border-0">
      <div className="card-body p-1 d-flex align-items-center justify-content-between">
        <div>
          <div className="text-secondary small fw-semibold text-uppercase tracking-wider mb-1">
            {title}
          </div>
          <h3 className="fw-bold text-dark mb-0">{value}</h3>
          {subtitle && <div className="text-muted small mt-1">{subtitle}</div>}
        </div>
        <div className={`stat-icon-wrapper bg-${color}-subtle text-${color}`}>
          <i className={`bi ${icon} fs-4`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
