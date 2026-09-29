import React from 'react';

const SearchFilter = ({ filters, setFilters, onSearch, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 p-md-4 rounded-3 shadow-sm border mb-4">
      <div className="row g-3">
        {/* Keyword Search */}
        <div className="col-12 col-md-4">
          <label className="form-label small fw-semibold text-secondary">Search Keyword</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              name="search"
              className="form-control border-start-0"
              placeholder="Title, skills, or company..."
              value={filters.search || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Location */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="form-label small fw-semibold text-secondary">Location</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-geo-alt text-muted"></i>
            </span>
            <input
              type="text"
              name="location"
              className="form-control border-start-0"
              placeholder="e.g. Bangalore, Remote..."
              value={filters.location || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Employment Type */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="form-label small fw-semibold text-secondary">Employment Type</label>
          <select
            name="employment_type"
            className="form-select"
            value={filters.employment_type || 'All'}
            onChange={handleChange}
          >
            <option value="All">All Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="col-12 col-md-2 d-flex align-items-end gap-2">
          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Search
          </button>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-outline-secondary"
            title="Reset Filters"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchFilter;
