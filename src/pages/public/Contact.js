import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="py-5 bg-light flex-grow-1">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill mb-2 fw-semibold">
            Get in Touch
          </span>
          <h1 className="fw-bold text-dark display-5">Contact Support</h1>
          <p className="lead text-secondary">
            Have questions about posting a job, tracking your applications, or technical inquiries?
            Our team is here to assist you.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Contact Details Card */}
          <div className="col-12 col-lg-5">
            <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
              <h4 className="fw-bold text-dark mb-4">Contact Information</h4>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44 }}>
                  <i className="bi bi-geo-alt-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Office Headquarters</h6>
                  <p className="text-secondary small mb-0">
                    NRD Lab Tech Park, HITEC City, Hyderabad, Telangana 500081, India
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44 }}>
                  <i className="bi bi-envelope-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Email Inquiries</h6>
                  <p className="text-secondary small mb-0">
                    support@jobportal.example.com<br />
                    careers@jobportal.example.com
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44 }}>
                  <i className="bi bi-telephone-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Phone Support</h6>
                  <p className="text-secondary small mb-0">
                    +91 (040) 2345-6789<br />
                    Mon - Fri: 9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 mt-auto">
                <div className="fw-semibold text-dark small mb-1">Looking for Immediate Help?</div>
                <div className="text-muted small">
                  Check out our job seeker guide or review the sample accounts on the login page for rapid testing.
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="col-12 col-lg-7">
            <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
              <h4 className="fw-bold text-dark mb-4">Send Us a Message</h4>

              {submitted && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Thank you for reaching out! We have received your message and will respond within 24 hours.
                  <button type="button" className="btn-close" onClick={() => setSubmitted(false)}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Your Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Question about Recruiter verification"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Message *</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Type your message or inquiry here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-primary px-4 py-2 fw-semibold">
                    <i className="bi bi-send-fill me-1"></i> Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
