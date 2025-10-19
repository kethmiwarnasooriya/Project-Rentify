import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';

const ProfilePage = () => {
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: sessionStorage.getItem('username') || 'Guest User',
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Property enthusiast looking for the perfect rental space.',
    joinDate: 'January 2024',
    userRole: sessionStorage.getItem('userRole') || 'tenant'
  });

  const [editData, setEditData] = useState({ ...profileData });
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    sessionStorage.setItem('username', editData.username);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="profile-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --bg-gradient-start: #2563eb;
          --bg-gradient-end: #3b82f6;
          --bg-color: #f8fafc;
          --text-primary: #1e293b;
          --text-secondary: #64748b;
          --accent-color: #3b82f6;
          --accent-hover: #2563eb;
          --card-bg: white;
          --border-color: #e2e8f0;
          --input-bg: #f8fafc;
        }

        body.dark-theme {
          --bg-gradient-start: #1e3a8a;
          --bg-gradient-end: #1e40af;
          --bg-color: #0f172a;
          --text-primary: #ffffff;
          --text-secondary: #94a3b8;
          --accent-color: #60a5fa;
          --accent-hover: #3b82f6;
          --card-bg: #1e293b;
          --border-color: #334155;
          --input-bg: #334155;
        }

        .profile-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: var(--bg-color);
          color: var(--text-primary);
        }

        .profile-header {
          background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-5px);
        }

        .profile-banner {
          display: flex;
          align-items: flex-end;
          gap: 2rem;
          padding: 2rem 0;
        }

        .avatar-section {
          position: relative;
        }

        .avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 3rem;
          font-weight: 700;
          border: 5px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .avatar-upload {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 3px solid white;
          transition: all 0.3s ease;
        }

        .avatar-upload:hover {
          background: var(--accent-hover);
          transform: scale(1.1);
        }

        .profile-info {
          flex: 1;
          color: white;
        }

        .profile-name {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .profile-role {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: capitalize;
          margin-bottom: 1rem;
        }

        .profile-stats {
          display: flex;
          gap: 2rem;
          margin-top: 1.5rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          display: block;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .profile-body {
          max-width: 1200px;
          margin: -3rem auto 0;
          padding: 0 2rem 2rem;
          position: relative;
          z-index: 2;
        }

        .actions-bar {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: var(--accent-color);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
          background: var(--card-bg);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
        }

        .btn-secondary:hover {
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .info-group {
          margin-bottom: 1.5rem;
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .info-value {
          font-size: 1rem;
          color: var(--text-primary);
          padding: 0.75rem 1rem;
          background: var(--input-bg);
          border-radius: 8px;
          border: 2px solid var(--border-color);
        }

        .info-input {
          width: 100%;
          font-size: 1rem;
          color: var(--text-primary);
          padding: 0.75rem 1rem;
          background: var(--input-bg);
          border-radius: 8px;
          border: 2px solid var(--accent-color);
          outline: none;
          transition: all 0.3s ease;
        }

        .info-input:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .info-textarea {
          min-height: 100px;
          resize: vertical;
          font-family: inherit;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: var(--input-bg);
          border-radius: 8px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          transform: translateX(5px);
          background: var(--border-color);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .activity-time {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        @media (max-width: 968px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .profile-banner {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .profile-stats {
            justify-content: center;
          }

          .profile-name {
            font-size: 2rem;
          }

          .avatar {
            width: 120px;
            height: 120px;
            font-size: 2.5rem;
          }

          .actions-bar {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="profile-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="profile-banner">
            <div className="avatar-section">
              <div className="avatar">
                {profileData.username.charAt(0).toUpperCase()}
              </div>
              <div className="avatar-upload">
                <Camera size={20} />
              </div>
            </div>

            <div className="profile-info">
              <h1 className="profile-name">{profileData.username}</h1>
              <span className="profile-role">{profileData.userRole}</span>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">12</span>
                  <span className="stat-label">Properties</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">48</span>
                  <span className="stat-label">Reviews</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">4.8</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-body">
        <div className="actions-bar">
          {!isEditing ? (
            <button className="action-btn btn-primary" onClick={handleEdit}>
              <Edit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <>
              <button className="action-btn btn-danger" onClick={handleCancel}>
                <X size={18} />
                Cancel
              </button>
              <button className="action-btn btn-primary" onClick={handleSave}>
                <Save size={18} />
                Save Changes
              </button>
            </>
          )}
        </div>

        <div className="content-grid">
          <div className="card">
            <h2 className="card-title">Personal Information</h2>

            <div className="info-group">
              <label className="info-label">
                <User size={16} />
                Full Name
              </label>
              {!isEditing ? (
                <div className="info-value">{profileData.username}</div>
              ) : (
                <input
                  type="text"
                  className="info-input"
                  value={editData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              )}
            </div>

            <div className="info-group">
              <label className="info-label">
                <Mail size={16} />
                Email Address
              </label>
              {!isEditing ? (
                <div className="info-value">{profileData.email}</div>
              ) : (
                <input
                  type="email"
                  className="info-input"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              )}
            </div>

            <div className="info-group">
              <label className="info-label">
                <Phone size={16} />
                Phone Number
              </label>
              {!isEditing ? (
                <div className="info-value">{profileData.phone}</div>
              ) : (
                <input
                  type="tel"
                  className="info-input"
                  value={editData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              )}
            </div>

            <div className="info-group">
              <label className="info-label">
                <MapPin size={16} />
                Location
              </label>
              {!isEditing ? (
                <div className="info-value">{profileData.location}</div>
              ) : (
                <input
                  type="text"
                  className="info-input"
                  value={editData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              )}
            </div>

            <div className="info-group">
              <label className="info-label">
                <Calendar size={16} />
                Member Since
              </label>
              <div className="info-value">{profileData.joinDate}</div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">About Me</h2>

            <div className="info-group">
              <label className="info-label">
                Bio
              </label>
              {!isEditing ? (
                <div className="info-value">{profileData.bio}</div>
              ) : (
                <textarea
                  className="info-input info-textarea"
                  value={editData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="card full-width">
            <h2 className="card-title">Recent Activity</h2>

            <div className="activity-item">
              <div className="activity-icon">🏠</div>
              <div className="activity-content">
                <div className="activity-title">Viewed Modern Downtown Apartment</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">❤️</div>
              <div className="activity-content">
                <div className="activity-title">Added property to favorites</div>
                <div className="activity-time">1 day ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <div className="activity-title">Updated profile information</div>
                <div className="activity-time">3 days ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">⭐</div>
              <div className="activity-content">
                <div className="activity-title">Received a 5-star review</div>
                <div className="activity-time">1 week ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;