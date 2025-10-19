import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, Heart, Settings, LogOut, Menu, X, MapPin, Bed, Bath, DollarSign, Filter, Star, TrendingUp, Calendar } from 'lucide-react';
import SettingsPage from '../SettingsPage';


const TenantDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem('theme') || 'light';
  });
  const [username] = useState(sessionStorage.getItem('username') || 'Tenant');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const allProperties = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      location: 'Downtown, City Center',
      price: 1200,
      beds: 2,
      baths: 2,
      sqft: 950,
      type: 'apartment',
      rating: 4.8,
      image: '🏢',
      available: 'Immediately',
      features: ['Parking', 'Gym', 'Pool']
    },
    {
      id: 2,
      title: 'Cozy Studio near Park',
      location: 'Green Valley',
      price: 850,
      beds: 1,
      baths: 1,
      sqft: 500,
      type: 'studio',
      rating: 4.5,
      image: '🏠',
      available: 'Dec 1',
      features: ['Pet Friendly', 'Garden']
    },
    {
      id: 3,
      title: 'Spacious Family Home',
      location: 'Suburban Area',
      price: 2100,
      beds: 4,
      baths: 3,
      sqft: 2200,
      type: 'house',
      rating: 4.9,
      image: '🏡',
      available: 'Jan 15',
      features: ['Garage', 'Backyard', 'Fireplace']
    },
    {
      id: 4,
      title: 'Luxury Penthouse Suite',
      location: 'Upper East Side',
      price: 3500,
      beds: 3,
      baths: 3,
      sqft: 1800,
      type: 'apartment',
      rating: 5.0,
      image: '🌆',
      available: 'Immediately',
      features: ['Concierge', 'Rooftop', 'Smart Home']
    },
    {
      id: 5,
      title: 'Charming Loft Space',
      location: 'Arts District',
      price: 1400,
      beds: 2,
      baths: 1,
      sqft: 1100,
      type: 'loft',
      rating: 4.6,
      image: '🎨',
      available: 'Dec 15',
      features: ['High Ceilings', 'Exposed Brick']
    },
    {
      id: 6,
      title: 'Beach View Condo',
      location: 'Coastal Area',
      price: 1900,
      beds: 2,
      baths: 2,
      sqft: 1200,
      type: 'condo',
      rating: 4.7,
      image: '🏖️',
      available: 'Jan 1',
      features: ['Ocean View', 'Balcony', 'Pool']
    }
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const filteredProperties = allProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedFilter === 'all' || property.type === selectedFilter;
    
    let matchesPrice = true;
    if (priceRange === 'low') matchesPrice = property.price < 1000;
    else if (priceRange === 'mid') matchesPrice = property.price >= 1000 && property.price < 2000;
    else if (priceRange === 'high') matchesPrice = property.price >= 2000;
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const propertyTypes = [
    { value: 'all', label: 'All Types', icon: '🏘️' },
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'house', label: 'House', icon: '🏡' },
    { value: 'studio', label: 'Studio', icon: '🏠' },
    { value: 'loft', label: 'Loft', icon: '🎨' },
    { value: 'condo', label: 'Condo', icon: '🏖️' }
  ];

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
          --success-color: #10b981;
          --warning-color: #f59e0b;
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
          --success-color: #34d399;
          --warning-color: #fbbf24;
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

        .favorites-badge {
          background: #ef4444;
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: auto;
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
          animation: slideDown 0.5s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dashboard-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--accent-color), #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .search-section {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .search-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          font-size: 1rem;
          background: var(--bg-color);
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-btn {
          padding: 1rem 1.5rem;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .filter-btn:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .filters-row {
          display: ${filterOpen ? 'flex' : 'none'};
          gap: 1rem;
          flex-wrap: wrap;
          animation: slideDown 0.3s ease;
        }

        .filter-group {
          flex: 1;
          min-width: 200px;
        }

        .filter-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .filter-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-color);
          color: var(--text-primary);
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--accent-color);
        }

        .type-filters {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .type-chip {
          padding: 0.625rem 1.25rem;
          border: 2px solid var(--border-color);
          border-radius: 24px;
          background: var(--card-bg);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .type-chip:hover {
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }

        .type-chip.active {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .results-count {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .results-count strong {
          color: var(--accent-color);
          font-weight: 700;
        }

        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .property-card {
          background: var(--card-bg);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .property-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          border-color: var(--accent-color);
        }

        .property-image {
          width: 100%;
          height: 220px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          position: relative;
        }

        .property-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .rating-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #f59e0b;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .property-content {
          padding: 1.5rem;
        }

        .property-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .property-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .property-details {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .property-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .feature-tag {
          background: var(--bg-color);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .property-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .property-price-section {
          flex: 1;
        }

        .property-price {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--accent-color);
          margin-bottom: 0.25rem;
        }

        .price-period {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .favorite-btn {
          background: none;
          border: 2px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.75rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .favorite-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
          transform: scale(1.1);
        }

        .favorite-btn.active {
          background: #ef4444;
          border-color: #ef4444;
          color: white;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        .no-results h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
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

          .search-bar {
            flex-direction: column;
          }

          .filter-btn {
            width: 100%;
            justify-content: center;
          }

          .properties-grid {
            grid-template-columns: 1fr;
          }

          .type-filters {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 0.5rem;
          }
        }
      `}</style>

      <nav className="top-nav">
        <div className="logo" onClick={handleBackHome}>
          <div className="logo-icon">R</div>
          Rentify Tenant
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
            <button onClick={() => alert(`You have ${favorites.length} favorite properties!`)}>
              <Heart size={20} /> Favorites
              {favorites.length > 0 && <span className="favorites-badge">{favorites.length}</span>}
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
          <h1>Find Your Perfect Home, {username}! </h1>
          <p>Browse through our verified property listings and find your dream rental</p>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by location, property name, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
              <Filter size={20} />
              Filters
            </button>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <select 
                className="filter-select"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="low">Under $1,000</option>
                <option value="mid">$1,000 - $2,000</option>
                <option value="high">$2,000+</option>
              </select>
            </div>
          </div>
        </div>

        <div className="type-filters">
          {propertyTypes.map(type => (
            <button
              key={type.value}
              className={`type-chip ${selectedFilter === type.value ? 'active' : ''}`}
              onClick={() => setSelectedFilter(type.value)}
            >
              <span>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        <div className="results-header">
          <div className="results-count">
            Found <strong>{filteredProperties.length}</strong> {filteredProperties.length === 1 ? 'property' : 'properties'}
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="properties-grid">
            {filteredProperties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-image">
                  {property.image}
                  <div className="property-badge">
                    <Calendar size={14} />
                    {property.available}
                  </div>
                  <div className="rating-badge">
                    <Star size={14} fill="currentColor" />
                    {property.rating}
                  </div>
                </div>
                <div className="property-content">
                  <h3 className="property-title">{property.title}</h3>
                  <div className="property-location">
                    <MapPin size={16} />
                    <span>{property.location}</span>
                  </div>
                  <div className="property-details">
                    <div className="detail-item">
                      <Bed size={16} />
                      <span>{property.beds} Beds</span>
                    </div>
                    <div className="detail-item">
                      <Bath size={16} />
                      <span>{property.baths} Baths</span>
                    </div>
                    <div className="detail-item">
                      <TrendingUp size={16} />
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                  <div className="property-features">
                    {property.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  <div className="property-footer">
                    <div className="property-price-section">
                      <div className="property-price">${property.price}</div>
                      <div className="price-period">per month</div>
                    </div>
                    <button 
                      className={`favorite-btn ${favorites.includes(property.id) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(property.id)}
                    >
                      <Heart size={20} fill={favorites.includes(property.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No properties found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;