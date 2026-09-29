import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = (st) => {
    switch (st) {
      case 'Applied':
        return { bg: 'bg-secondary', icon: 'bi-send', label: 'Applied' };
      case 'Under Review':
        return { bg: 'bg-info text-dark', icon: 'bi-hourglass-split', label: 'Under Review' };
      case 'Shortlisted':
        return { bg: 'bg-warning text-dark', icon: 'bi-star-fill', label: 'Shortlisted' };
      case 'Selected':
        return { bg: 'bg-success', icon: 'bi-check-circle-fill', label: 'Selected' };
      case 'Rejected':
        return { bg: 'bg-danger', icon: 'bi-x-circle-fill', label: 'Rejected' };
      case 'Active':
        return { bg: 'bg-success', icon: 'bi-lightning-charge-fill', label: 'Active' };
      case 'Closed':
        return { bg: 'bg-danger', icon: 'bi-slash-circle', label: 'Closed' };
      default:
        return { bg: 'bg-secondary', icon: 'bi-info-circle', label: st || 'Unknown' };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span className={`badge ${config.bg} px-2 py-1 d-inline-flex align-items-center gap-1`}>
      <i className={`bi ${config.icon}`}></i>
      {config.label}
    </span>
  );
};

export default StatusBadge;
