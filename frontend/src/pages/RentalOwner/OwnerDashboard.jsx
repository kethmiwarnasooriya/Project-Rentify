import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Settings, LogOut, Menu, X, Building2, Users, DollarSign, TrendingUp } from 'lucide-react';

const OwnerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [username] = useState(localStorage.getItem('username') || 'Owner');
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    loadProperties();
  }, [theme]);

  const loadProperties = () => {
    const storedProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    setProperties(storedProperties);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const handleAddProperty = () => {
    navigate('/owner/add-property');
  };

  // Calculate statistics
  const totalProperties = properties.length;
  const totalTenants = properties.reduce((sum, prop) => {
    return sum + (prop.tenants || 0);
  }, 0);
  const monthlyRevenue = properties.reduce((sum, prop) => {
    return sum + (parseFloat(prop.price) || 0);
  }, 0);
  const occupancyRate = totalProperties > 0 
    ? Math.round((properties.filter(p => p.status === 'occupied').length / totalProperties) * 100)
    : 0;

  return (
    <div className="dashboard-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --bg-color: #f8fafc;
          --text-primary: #1e293b;
          --text-secondary: #64748b;
          --accent-color: #3b82f6;
          --accent-hover: #2563eb;
          --nav-bg: rgba(255, 255, 255, 0.98);
          --card-bg: white;
          --border-color: #e2e8f0;
        }

        body.dark-theme {
          --bg-color: #0f172a;
          --text-primary: #ffffff;
          --text-secondary: #94a3b8;
          --accent-color: #60a5fa;
          --accent-hover: #3b82f6;
          --nav-bg: rgba(30, 41, 59, 0.98);
          --card-bg: #1e293b;
          --border-color: #334155;
        }

        .dashboard-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          min-height: 100vh;
          background: var(--bg-color);
          color: var(--text-primary);
        }

        .top-nav {
          position: fixed;
          top: 0;
          width: 100%;
          background: var(--nav-bg);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-color);
          cursor: pointer;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: var(--accent-color);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .hamburger {
          cursor: pointer;
          color: var(--text-primary);
        }

        .sidebar {
          position: fixed;
          top: 0;
          right: ${sidebarOpen ? '0' : '-300px'};
          width: 300px;
          height: 100vh;
          background: var(--nav-bg);
          backdrop-filter: blur(10px);
          padding: 2rem;
          z-index: 2000;
          transition: right 0.3s ease;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--accent-color);
        }

        .close-btn {
          cursor: pointer;
          background: none;
          border: none;
          color: var(--text-primary);
        }

        .sidebar-links {
          list-style: none;
          flex: 1;
        }

        .sidebar-links li {
          margin-bottom: 1rem;
        }

        .sidebar-links button {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--text-primary);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          font-size: 1rem;
          text-align: left;
        }

        .sidebar-links button:hover {
          background: var(--accent-color);
          color: white;
        }

        .logout-btn {
          width: 100%;
          margin-top: auto;
          padding: 1rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #dc2626;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1500;
          opacity: ${sidebarOpen ? '1' : '0'};
          visibility: ${sidebarOpen ? 'visible' : 'hidden'};
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .main-content {
          margin-top: 5rem;
          padding: 2rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: var(--text-secondary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.blue {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .stat-icon.green {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .stat-icon.purple {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        .stat-icon.orange {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .stat-card h3 {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .stat-card p {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-change {
          font-size: 0.85rem;
          color: #10b981;
          margin-top: 0.5rem;
        }

        .action-section {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          text-align: center;
        }

        .action-section h2 {
          margin-bottom: 1rem;
        }

        .action-section p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 768px) {
          .top-nav {
            padding: 1rem;
          }

          .main-content {
            padding: 1rem;
            margin-top: 4rem;
          }

          .user-info span {
            display: none;
          }

          .dashboard-header h1 {
            font-size: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <nav className="top-nav">
        <div className="logo" onClick={handleBackHome}>
          <div className="logo-icon">R</div>
          Rentify Owner
        </div>
        <div className="nav-right">
          <div className="user-info">
            <div className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <span>{username}</span>
          </div>
          <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </div>
        </div>
      </nav>

      <div className="overlay" onClick={() => setSidebarOpen(false)}></div>

      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <ul className="sidebar-links">
          <li>
            <button onClick={handleBackHome}>
              <Home size={20} /> Home
            </button>
          </li>
          <li>
            <button onClick={handleAddProperty}>
              <PlusCircle size={20} />
              Add Property
            </button>
          </li>
          <li>
            <button onClick={() => alert('Tenants coming soon!')}>
              <Users size={20} /> Tenants
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/settings')}>
              <Settings size={20} /> Settings
            </button>
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="main-content">
        <div className="dashboard-header">
          <h1>Welcome back, {username}!</h1>
          <p>Here's what's happening with your properties today.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div>
                <h3>Total Properties</h3>
                <p>{totalProperties}</p>
                <div className="stat-change">
                  {totalProperties > 0 ? '+' : ''}
                  {totalProperties} listed
                </div>
              </div>
              <div className="stat-icon blue">
                <Building2 size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div>
                <h3>Active Tenants</h3>
                <p>{totalTenants}</p>
                <div className="stat-change">Currently renting</div>
              </div>
              <div className="stat-icon green">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div>
                <h3>Monthly Revenue</h3>
                <p>LKR {monthlyRevenue.toLocaleString()}</p>
                <div className="stat-change">Total potential income</div>
              </div>
              <div className="stat-icon purple">
                <DollarSign size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div>
                <h3>Occupancy Rate</h3>
                <p>{occupancyRate}%</p>
                <div className="stat-change">Property utilization</div>
              </div>
              <div className="stat-icon orange">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="action-section">
          <h2>Add New Property</h2>
          <p>List a new property and start receiving rental applications</p>
          <button className="action-btn" onClick={handleAddProperty}>
            <PlusCircle size={20} />
            Add Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;