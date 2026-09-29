import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import JobCard from '../../components/JobCard';
import SearchFilter from '../../components/SearchFilter';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    employment_type: searchParams.get('employment_type') || 'All',
    skills: searchParams.get('skills') || '',
    experience: searchParams.get('experience') || ''
  });

  const fetchJobs = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('status', 'Active');
      if (currentFilters.search) params.set('search', currentFilters.search);
      if (currentFilters.location && currentFilters.location !== 'All') params.set('location', currentFilters.location);
      if (currentFilters.employment_type && currentFilters.employment_type !== 'All') params.set('employment_type', currentFilters.employment_type);
      if (currentFilters.skills) params.set('skills', currentFilters.skills);
      if (currentFilters.experience) params.set('experience', currentFilters.experience);

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.success && res.jobs) {
        setJobs(res.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Could not retrieve job postings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(filters);
  }, [fetchJobs]);

  const handleSearch = () => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.location) params.location = filters.location;
    if (filters.employment_type && filters.employment_type !== 'All') params.employment_type = filters.employment_type;
    setSearchParams(params);
    fetchJobs(filters);
  };

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      location: '',
      employment_type: 'All',
      skills: '',
      experience: ''
    };
    setFilters(defaultFilters);
    setSearchParams({});
    fetchJobs(defaultFilters);
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">Explore Open Positions</h2>
          <p className="text-secondary mb-0">
            Find the right job match across top tech companies and innovative startups
          </p>
        </div>

        {/* Filter component */}
        <SearchFilter
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* Result counter and sorting */}
        <div className="d-flex justify-content-between align-items-center mb-3 text-secondary small">
          <div>
            Showing <strong className="text-dark">{jobs.length}</strong> available job{jobs.length === 1 ? '' : 's'}
          </div>
          {(filters.search || filters.location || (filters.employment_type && filters.employment_type !== 'All')) && (
            <button onClick={handleReset} className="btn btn-link btn-sm text-decoration-none p-0">
              Clear all filters
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading positions...</span>
            </div>
            <p className="text-muted mt-2">Searching positions...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="row g-4">
            {jobs.map((job) => (
              <div key={job.id} className="col-12 col-md-6 col-lg-4">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3 p-5 text-center border shadow-sm my-4">
            <div className="text-secondary mb-3">
              <i className="bi bi-search fs-1"></i>
            </div>
            <h4 className="fw-bold text-dark">No Jobs Found</h4>
            <p className="text-muted mb-3">
              We couldn't find any jobs matching your search criteria. Try modifying your search keywords or clearing your filters.
            </p>
            <button onClick={handleReset} className="btn btn-primary btn-sm px-4">
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
