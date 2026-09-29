import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SeekerProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    resume_headline: '',
    bio: '',
    skills: '',
    education: '',
    experience: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.success) {
          setProfile(res.profile || {});
          setFormData({
            name: res.user.name || '',
            phone: res.user.phone || '',
            resume_headline: res.profile?.resume_headline || '',
            bio: res.profile?.bio || '',
            skills: res.profile?.skills || '',
            education: res.profile?.education || '',
            experience: res.profile?.experience || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await api.put('/users/profile', formData);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        setProfile({
          ...profile,
          resume_headline: formData.resume_headline,
          bio: formData.bio,
          skills: formData.skills,
          education: formData.education,
          experience: formData.experience
        });
        updateUser({
          ...user,
          name: formData.name,
          phone: formData.phone
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'danger', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const skillsList = formData.skills
    ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Candidate Profile</h2>
            <p className="text-secondary mb-0">Manage your skills, career experience, and education for employers</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`btn ${isEditing ? 'btn-outline-secondary' : 'btn-primary'} fw-semibold`}
          >
            <i className={`bi ${isEditing ? 'bi-x-lg' : 'bi-pencil-fill'} me-1`}></i>
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {statusMessage && (
          <div className={`alert alert-${statusMessage.type} alert-dismissible fade show`} role="alert">
            {statusMessage.text}
            <button type="button" className="btn-close" onClick={() => setStatusMessage(null)}></button>
          </div>
        )}

        {isEditing ? (
          /* Edit Mode Form */
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-4 shadow-sm border">
            <h5 className="fw-bold text-dark mb-3 border-bottom pb-2">Edit Profile Details</h5>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary">Professional Headline</label>
                <input
                  type="text"
                  name="resume_headline"
                  className="form-control"
                  placeholder="e.g. Senior Full Stack Developer | React, Node.js & MySQL Specialist"
                  value={formData.resume_headline}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  className="form-control"
                  placeholder="React.js, Node.js, MySQL, JavaScript, HTML5, CSS3, Git"
                  value={formData.skills}
                  onChange={handleChange}
                />
                <div className="form-text small">Separate skills with commas (e.g. Java, JDBC, REST API)</div>
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary">Professional Summary / Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  className="form-control"
                  placeholder="Provide a brief summary of your background, achievements, and career focus..."
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary">Education History</label>
                <textarea
                  name="education"
                  rows="3"
                  className="form-control"
                  placeholder="Degree, Major, Institution, Graduation Year, CGPA/Grade"
                  value={formData.education}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary">Work Experience History</label>
                <textarea
                  name="experience"
                  rows="4"
                  className="form-control"
                  placeholder="Title, Company, Duration, Key Projects and Responsibilities..."
                  value={formData.experience}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary fw-semibold px-4" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <div className="bg-white p-4 rounded-4 shadow-sm border text-center mb-4">
                <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                  <i className="bi bi-person-circle fs-1"></i>
                </div>
                <h4 className="fw-bold text-dark mb-1">{formData.name}</h4>
                <div className="text-secondary small mb-3">{formData.resume_headline || 'Job Seeker'}</div>
                <hr />
                <div className="text-start small text-secondary">
                  <div className="mb-2">
                    <i className="bi bi-envelope text-primary me-2"></i>
                    <strong>Email:</strong> {user?.email}
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-telephone text-primary me-2"></i>
                    <strong>Phone:</strong> {formData.phone || 'Not added'}
                  </div>
                  <div>
                    <i className="bi bi-shield-check text-success me-2"></i>
                    <strong>Account Status:</strong> Active Candidate
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-8">
              <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
                <h5 className="fw-bold text-dark mb-3">About / Bio</h5>
                <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>
                  {formData.bio || 'No bio summary added yet. Click "Edit Profile" to add your professional bio.'}
                </p>

                <h5 className="fw-bold text-dark mt-4 mb-3">Technical Skills</h5>
                {skillsList.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {skillsList.map((skill, idx) => (
                      <span key={idx} className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small">No skills added yet.</p>
                )}

                <h5 className="fw-bold text-dark mt-4 mb-3">Education</h5>
                <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>
                  {formData.education || 'No education details provided.'}
                </p>

                <h5 className="fw-bold text-dark mt-4 mb-3">Work Experience</h5>
                <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>
                  {formData.experience || 'No work experience added.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerProfile;
