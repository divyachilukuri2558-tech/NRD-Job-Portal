import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setMessage({ type: 'danger', text: 'Failed to retrieve users.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, name) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own active admin account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete user "${name}" and all associated data?`)) {
      return;
    }

    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.success) {
        setMessage({ type: 'success', text: `User "${name}" has been deleted.` });
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to delete user.' });
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchSearch =
      !searchTerm ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">User Management</h2>
          <p className="text-secondary mb-0">Inspect all registered candidates, recruiters, and platform administrators</p>
        </div>

        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
          </div>
        )}

        {/* Filter Controls */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-secondary">Filter by User Role</label>
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles ({users.length})</option>
                <option value="seeker">Job Seekers</option>
                <option value="recruiter">Recruiters</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            <div className="col-12 col-md-8">
              <label className="form-label small fw-semibold text-secondary">Search Users</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by user name or email address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0 text-dark">
              Registered Accounts ({filteredUsers.length})
            </h6>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Joined Date</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="ps-4 text-muted">#{u.id}</td>
                        <td className="fw-semibold text-dark">{u.name}</td>
                        <td className="text-secondary">{u.email}</td>
                        <td>
                          <span
                            className={`badge text-uppercase ${
                              u.role === 'admin'
                                ? 'bg-danger text-white'
                                : u.role === 'recruiter'
                                ? 'bg-primary text-white'
                                : 'bg-success text-white'
                            }`}
                            style={{ fontSize: '0.72rem' }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="text-muted">{u.phone || 'N/A'}</td>
                        <td className="text-muted">{u.created_at ? u.created_at.substring(0, 10) : 'Recent'}</td>
                        <td className="text-end pe-4">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="btn btn-outline-danger btn-sm py-1 px-2"
                            title="Delete User"
                            disabled={u.id === currentUser?.id}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-secondary">
                <i className="bi bi-person-x fs-1 d-block mb-3 text-muted"></i>
                <h5 className="fw-bold text-dark">No Users Found</h5>
                <p className="text-muted mb-0">No accounts match the selected filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
