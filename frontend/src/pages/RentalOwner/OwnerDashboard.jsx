// src/pages/RentalOwner/OwnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Settings, LogOut, Menu, X, Building2, Users, DollarSign, TrendingUp, Info, Mail, User, AlertCircle, Loader2, Edit, Eye as ViewIcon, MapPin, Home, Trash2, Calendar } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import { useNotification } from '../../components/NotificationSystem';
import LogoutModal from '../../components/LogoutModal';
import IncomingReservations from '../../components/IncomingReservations';
import ChatBox from '../../components/ChatBox';
import MessagesPage from '../../components/MessagesPage';
import NotificationBadge from '../../components/NotificationBadge';
import NotificationPopup from '../../components/NotificationPopup';
import { useNotifications } from '../../hooks/useNotifications';
import { MessageCircle } from 'lucide-react';

const OwnerDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [username, setUsername] = useState(() => sessionStorage.getItem('username') || '');
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'messages'
    const [showChatBox, setShowChatBox] = useState(false);
    const [chatUser, setChatUser] = useState(null);
    
    // Notifications
    const { unreadMessages, pendingReservations, refresh: refreshNotifications } = useNotifications();
    const [showNotificationPopup, setShowNotificationPopup] = useState(false);
    const [hasShownPopup, setHasShownPopup] = useState(false);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    // Effect for Theme
    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Effect for Data Fetching
    useEffect(() => {
        fetchOwnerProperties();
    }, []);

    // Show notification popup on login if there are uncaught activities
    useEffect(() => {
        const hasNotifications = unreadMessages > 0 || pendingReservations > 0;
        const lastShown = sessionStorage.getItem('last_notification_popup');
        
        // Show popup only once per session and only if there are notifications
        if (hasNotifications && !hasShownPopup && !lastShown) {
            const timer = setTimeout(() => {
                setShowNotificationPopup(true);
                setHasShownPopup(true);
                sessionStorage.setItem('last_notification_popup', 'true');
            }, 1000); // Show after 1 second
            
            return () => clearTimeout(timer);
        }
    }, [unreadMessages, pendingReservations, hasShownPopup]);

    const fetchOwnerProperties = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/properties/my-properties?page=0&size=100&sort=createdAt,desc');
            setProperties(response.data.content || []);
            console.log("Fetched owner properties:", response.data.content);
        } catch (err) {
            console.error("Failed to fetch owner properties:", err);
            setError("Could not load your properties. Please check your connection or try again later.");
            if (err.response && err.response.status === 403) {
                setError("Access Denied. Ensure you are logged in as an owner.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handlers ---
    const handleLogout = () => {
        console.log('Owner logout initiated');
        
        // Clear only user session data (preserve admin session)
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('redirectAfterLogin');
        localStorage.clear();
        
        // Try API call but don't wait for it
        apiClient.post('/auth/logout').catch(error => {
            console.log('Logout API call failed, but continuing:', error);
        });
        
        // Force immediate redirect
        window.location.replace('/');
    };

    const handleBackHome = () => navigate('/');
    const handleAddProperty = () => navigate('/owner/add-property');
    const handleThemeChange = (newTheme) => setTheme(newTheme);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleEditProperty = (id) => navigate(`/owner/edit-property/${id}`);
    const handleViewProperty = (id) => navigate(`/owner/view-property/${id}`);
    const handleDeleteProperty = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            try {
                await apiClient.delete(`/properties/${id}`);
                showNotification('success', 'Property Deleted', 'Property has been deleted successfully');
                fetchOwnerProperties(); // Refresh the list
            } catch (error) {
                console.error('Failed to delete property:', error);
                showNotification('error', 'Delete Failed', 'Failed to delete property. Please try again.');
            }
        }
    };

    // --- Stats Calculation ---
    const totalProperties = properties.length;
    const activeTenants = properties.filter(p => p.status === 'rented').length;
    const monthlyRevenue = properties.reduce((sum, prop) => {
        if (prop.status === 'rented' || prop.status === 'active') { 
            return sum + (parseFloat(prop.price) || 0); 
        } 
        return sum;
    }, 0);
    const occupancyRate = totalProperties > 0 ? Math.round((activeTenants / totalProperties) * 100) : 0;

    // --- Render Content Logic ---
    let propertyContent;
    if (isLoading && properties.length === 0) {
        propertyContent = (
            <div className="loading-state">
                <Loader2 size={48} className="animate-spin" />
                <p>Loading properties...</p>
            </div>
        );
    } else if (error) {
        propertyContent = (
            <div className="error-state">
                <AlertCircle size={48} color="var(--danger-color)" />
                <h3>Error Loading</h3>
                <p>{error}</p>
                <button onClick={fetchOwnerProperties} className="retry-button">Try Again</button>
            </div>
        );
    } else if (properties.length === 0) {
        propertyContent = (
            <div className="empty-state">
                <Building2 size={64} color="var(--text-secondary)" />
                <h3>No Properties Found</h3>
                <p>Start building your rental portfolio by adding your first property!</p>
                <button className="action-btn" onClick={handleAddProperty}>
                    <PlusCircle size={22} /> Add Property
                </button>
            </div>
        );
    } else {
        propertyContent = (
            <div className="property-list">
                <h2>Your Properties ({totalProperties})</h2>
                {properties.map(prop => (
                    <div key={prop.id} className="property-item">
                        <div className="property-thumbnail">
                            {prop.imageFilenames && prop.imageFilenames.length > 0 ? (
                                <img src={`https://project-rentify.up.railway.app/api/files/${prop.imageFilenames[0]}`} alt={prop.title} loading="lazy"/>
                            ) : (
                                <div className="placeholder-thumb"><Building2 size={24} /></div>
                            )}
                        </div>
                        <div className="property-details">
                            <h3>{prop.title}</h3>
                            <p className="location"><MapPin size={14}/> {prop.location} - LKR {prop.price ? prop.price.toLocaleString() : 'N/A'}/month</p>
                            <span className={`status-badge status-${prop.status}`}>{prop.status}</span>
                        </div>
                        <div className="property-actions">
                            <button onClick={() => handleViewProperty(prop.id)} title="View Property"><ViewIcon size={16}/></button>
                            <button onClick={() => handleEditProperty(prop.id)} title="Edit Property"><Edit size={16}/></button>
                            <button onClick={() => handleDeleteProperty(prop.id, prop.title)} title="Delete Property" style={{borderColor: '#dc3545'}}><Trash2 size={16} color="#dc3545"/></button>
                        </div>
                    </div>
                ))}
                <button className="action-btn add-more-btn" onClick={handleAddProperty}>
                    <PlusCircle size={22} /> Add Another Property
                </button>
            </div>
        );
    }

    // --- JSX ---
    return (
        <div className="dashboard-container">
            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                :root {
                    --bg-gradient-start: #F5F1E8;
                    --bg-gradient-end: #FBF8F0;
                    --text-primary: #1F2E3D;
                    --text-secondary: #6B7C8C;
                    --accent-color: #5B8DB8;
                    --accent-hover: #4A7BA4;
                    --nav-bg: #1F2E3D;
                    --card-bg: rgba(251, 248, 240, 0.95);
                    --danger-color: #C85A54;
                    --danger-hover: #B24943;
                    --border-color: rgba(107, 124, 140, 0.3);
                    --input-border: #DFE3E8;
                }

                body.dark-theme {
                    --bg-gradient-start: #1a2734;
                    --bg-gradient-end: #2a3844;
                    --text-primary: #F5F1E8;
                    --text-secondary: #C4CDD5;
                    --accent-color: #7BA5CC;
                    --accent-hover: #6B9AC4;
                    --nav-bg: #1a2734;
                    --card-bg: rgba(42, 56, 68, 0.95);
                    --danger-color: #E67A72;
                    --danger-hover: #D66A62;
                    --border-color: rgba(123, 165, 204, 0.3);
                    --input-border: #3a4854;
                }

                .dashboard-container {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
                    color: var(--text-primary);
                    min-height: 100vh;
                    background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
                    overflow-x: hidden;
                }

                /* Navigation Bar */
                .navbar {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    background: var(--nav-bg);
                    backdrop-filter: blur(10px);
                    padding: 1rem 4rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 1000;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .logo {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #FBF8F0;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }

                .logo-icon {
                    width: 32px;
                    height: 32px;
                    background: #5B8DB8;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #FBF8F0;
                    font-weight: bold;
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
                    color: #FBF8F0;
                }

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #5B8DB8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #FBF8F0;
                    font-weight: 600;
                }

                .hamburger {
                    cursor: pointer;
                    color: #FBF8F0;
                    margin-left: 0.5rem;
                }

                /* Sidebar Menu */
                .sidebar {
                    position: fixed;
                    top: 0;
                    right: ${sidebarOpen ? '0' : '-350px'};
                    width: 350px;
                    height: 100vh;
                    background: #FBF8F0;
                    backdrop-filter: blur(10px);
                    padding: 2rem;
                    z-index: 2000;
                    transition: right 0.3s ease;
                    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                body.dark-theme .sidebar {
                    background: #2a3844;
                }

                .sidebar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid var(--accent-color);
                }

                .user-greeting {
                    font-size: 1.2rem;
                    color: var(--accent-color);
                    font-weight: 600;
                }

                .close-btn {
                    cursor: pointer;
                    color: var(--text-primary);
                    background: none;
                    border: none;
                }

                .sidebar-links {
                    list-style: none;
                    margin-bottom: 2rem;
                    flex: 1;
                }

                .sidebar-links li {
                    margin-bottom: 1.5rem;
                }

                .sidebar-links button {
                    text-decoration: none;
                    color: var(--text-primary);
                    font-size: 1.1rem;
                    font-weight: 500;
                    transition: color 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    cursor: pointer;
                    background: none;
                    border: none;
                    width: 100%;
                    text-align: left;
                    padding: 0;
                }

                .sidebar-links button:hover {
                    color: var(--accent-color);
                }

                .theme-switcher {
                    margin-top: auto;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(107, 124, 140, 0.3);
                }

                .theme-label {
                    font-weight: 600;
                    margin-bottom: 1rem;
                    display: block;
                    color: var(--text-primary);
                }

                .theme-buttons {
                    display: flex;
                    gap: 1rem;
                }

                .theme-btn {
                    flex: 1;
                    padding: 0.8rem;
                    border: 2px solid var(--accent-color);
                    background: transparent;
                    color: var(--text-primary);
                    cursor: pointer;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .theme-btn.active {
                    background: var(--accent-color);
                    color: #FBF8F0;
                }

                .theme-btn:hover {
                    transform: translateY(-2px);
                }

                .logout-section {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(107, 124, 140, 0.3);
                }

                .logout-btn {
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid var(--danger-color);
                    background: var(--danger-color);
                    color: #FBF8F0;
                    cursor: pointer;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 1.05rem;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.8rem;
                }

                .logout-btn:hover {
                    background: var(--danger-hover);
                    border-color: var(--danger-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(200, 90, 84, 0.3);
                }

                .logout-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Overlay */
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

                /* Main Content */
                .main-content {
                    padding-top: 8rem;
                    padding-bottom: 4rem;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding-left: 2rem;
                    padding-right: 2rem;
                }

                .dashboard-header {
                    margin-bottom: 3rem;
                    animation: fadeInDown 0.6s ease-out;
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .dashboard-header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    color: var(--text-primary);
                    font-weight: 700;
                }

                .dashboard-header p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                    animation: fadeInUp 0.6s ease-out 0.2s both;
                }

                .reservations-section {
                    margin-bottom: 3rem;
                    animation: fadeInUp 0.6s ease-out 0.4s both;
                }

                .section-header {
                    margin-bottom: 1.5rem;
                }

                .section-header h2 {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.75rem;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }

                .section-header p {
                    color: var(--text-secondary);
                    font-size: 1rem;
                    margin-left: 2.25rem;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .stat-card {
                    background: var(--card-bg);
                    backdrop-filter: blur(10px);
                    padding: 2rem;
                    border-radius: 12px;
                    border: 1px solid rgba(91, 141, 184, 0.2);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                }

                .stat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .stat-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #FBF8F0;
                }

                .stat-icon.blue {
                    background: linear-gradient(135deg, #5B8DB8, #4A7BA4);
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
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                }

                .stat-card p {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }

                .stat-change {
                    font-size: 0.875rem;
                    color: #10b981;
                    font-weight: 500;
                }

                /* Loading, Error, Empty States */
                .loading-state, .error-state, .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    margin-top: 2rem;
                    background: var(--card-bg);
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }

                .loading-state p, .error-state p, .empty-state p {
                    color: var(--text-secondary);
                    margin-top: 1rem;
                    margin-bottom: 1.5rem;
                    font-size: 1.05rem;
                }

                .empty-state h3, .error-state h3 {
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    font-size: 1.5rem;
                    color: var(--text-primary);
                }

                .loading-state .animate-spin {
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                    color: var(--accent-color);
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .retry-button, .action-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.8rem 1.5rem;
                    background: var(--accent-color);
                    color: #FBF8F0;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .retry-button:hover, .action-btn:hover {
                    background: var(--accent-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(91, 141, 184, 0.2);
                }

                /* Property List */
                .property-list {
                    background: var(--card-bg);
                    padding: 2rem;
                    border-radius: 16px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    margin-top: 2rem;
                    animation: fadeInUp 0.6s ease-out 0.4s both;
                }

                .property-list h2 {
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 1rem;
                    font-size: 1.5rem;
                    color: var(--text-primary);
                }

                .property-item {
                    display: flex;
                    align-items: center;
                    padding: 1rem 0;
                    border-bottom: 1px solid var(--border-color);
                    gap: 1rem;
                    transition: background 0.2s ease;
                }

                .property-item:hover {
                    background: linear-gradient(135deg, rgba(255, 254, 247, 0.8) 0%, rgba(250, 248, 240, 0.8) 100%);
                    border-radius: 8px;
                    padding-left: 0.5rem;
                    padding-right: 0.5rem;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
                }

                body.dark-theme .property-item:hover {
                    background: linear-gradient(135deg, rgba(42, 56, 68, 0.8) 0%, rgba(31, 41, 55, 0.8) 100%);
                }

                .property-item:last-child {
                    border-bottom: none;
                }

                .property-thumbnail {
                    width: 80px;
                    height: 60px;
                    border-radius: 8px;
                    overflow: hidden;
                    flex-shrink: 0;
                    background-color: var(--input-border);
                }

                .property-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .placeholder-thumb {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-secondary);
                }

                .property-details {
                    flex-grow: 1;
                }

                .property-details h3 {
                    margin-bottom: 0.25rem;
                    font-size: 1.1rem;
                    color: var(--text-primary);
                }

                .property-details p.location {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .status-active {
                    background-color: rgba(91, 154, 139, 0.2);
                    color: #5B9A8B;
                }

                .status-rented {
                    background-color: rgba(91, 141, 184, 0.2);
                    color: var(--accent-color);
                }

                .status-inactive {
                    background-color: rgba(107, 124, 140, 0.2);
                    color: var(--text-secondary);
                }

                .property-actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-shrink: 0;
                }

                .property-actions button {
                    padding: 0.5rem;
                    border-radius: 50%;
                    border: 2px solid #667eea;
                    background: transparent;
                    color: #667eea;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .property-actions button:hover {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-color: #667eea;
                    color: white;
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                .property-actions button:last-child:hover {
                    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                    border-color: #dc3545;
                    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
                }

                .add-more-btn {
                    margin-top: 2rem;
                    display: inline-flex;
                    margin-left: auto;
                    margin-right: auto;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .navbar {
                        padding: 1rem 1.5rem;
                    }

                    .main-content {
                        padding-top: 6rem;
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }

                    .dashboard-header h1 {
                        font-size: 2rem;
                    }

                    .dashboard-header p {
                        font-size: 1rem;
                    }

                    .sidebar {
                        width: 280px;
                        right: ${sidebarOpen ? '0' : '-280px'};
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .user-info span {
                        display: none;
                    }

                    .property-item {
                        flex-wrap: wrap;
                    }

                    .property-actions {
                        width: 100%;
                        justify-content: flex-end;
                        margin-top: 0.5rem;
                    }

                    .property-list {
                        padding: 1rem;
                    }
                }
            `}</style>

            {/* Navbar */}
            <nav className="navbar">
                <div className="logo" onClick={handleBackHome}>
                    <div className="logo-icon">R</div>
                    Rentify
                </div>
                <div className="nav-right">
                    <div className="user-info">
                        <div className="user-avatar">{username ? username.charAt(0).toUpperCase() : '?'}</div>
                        {username && <span>{username}</span>}
                    </div>
                    <div className="hamburger" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </div>
                </div>
            </nav>

            {/* Overlay & Sidebar */}
            <div className="overlay" onClick={toggleSidebar}></div>
            <div className="sidebar">
                <div className="sidebar-header">
                    <span className="user-greeting">Hello, {username || 'Guest'}!</span>
                    <button className="close-btn" onClick={toggleSidebar}>
                        <X size={24} />
                    </button>
                </div>
                <ul className="sidebar-links">
                    <li><button onClick={() => { setCurrentView('dashboard'); toggleSidebar(); }}><Home size={20} /> Dashboard</button></li>
                    <li><button onClick={() => { navigate('/owner/add-property'); toggleSidebar(); }}><PlusCircle size={20} /> Add Property</button></li>
                    <li><button onClick={() => { setCurrentView('messages'); toggleSidebar(); }} style={{ position: 'relative' }}><Mail size={20} /> Messages{unreadMessages > 0 && <NotificationBadge count={unreadMessages} size="small" />}</button></li>
                    <li><button onClick={() => { navigate('/profile'); toggleSidebar(); }}><User size={20} /> Profile</button></li>
                    <li><button onClick={() => { navigate('/about'); toggleSidebar(); }}><Info size={20} /> About Us</button></li>
                    <li><button onClick={() => { navigate('/settings'); toggleSidebar(); }}><Settings size={20} /> Settings</button></li>
                </ul>
                <div className="theme-switcher">
                    <span className="theme-label">Theme</span>
                    <div className="theme-buttons">
                        <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}>Light</button>
                        <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}>Dark</button>
                    </div>
                </div>
                <div className="logout-section">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {currentView === 'messages' ? (
                    <MessagesPage />
                ) : (
                    <>
                        <div className="dashboard-header">
                            <h1>Welcome back, {username || 'Owner'}!</h1>
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
                                <Building2 size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <div>
                                <h3>Active Tenants</h3>
                                <p>{activeTenants}</p>
                                <div className="stat-change">Currently renting</div>
                            </div>
                            <div className="stat-icon green">
                                <Users size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <div>
                                <h3>Potential Revenue</h3>
                                <p>LKR {monthlyRevenue.toLocaleString()}</p>
                                <div className="stat-change">Total potential income</div>
                            </div>
                            <div className="stat-icon purple">
                                <DollarSign size={28} />
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
                                <TrendingUp size={28} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Incoming Reservations Section */}
                <div className="reservations-section">
                    <div className="section-header">
                        <h2 style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={24} />
                            Incoming Reservations
                            {pendingReservations > 0 && <NotificationBadge count={pendingReservations} size="medium" />}
                        </h2>
                        <p>Manage reservation requests from tenants</p>
                    </div>
                    <IncomingReservations onUpdate={refreshNotifications} />
                </div>

                        {/* Render Properties/Loading/Error/Empty */}
                        {propertyContent}
                    </>
                )}
            </div>

            {/* Logout Modal */}
            <LogoutModal 
                isOpen={showLogoutModal} 
                onClose={() => setShowLogoutModal(false)} 
            />

            {/* Chat Box */}
            {showChatBox && chatUser && (
                <ChatBox
                    otherUser={chatUser}
                    isOpen={showChatBox}
                    onClose={() => {
                        setShowChatBox(false);
                        setChatUser(null);
                        refreshNotifications(); // Refresh notification count
                    }}
                />
            )}

            {/* Notification Popup on Login */}
            {showNotificationPopup && (
                <NotificationPopup
                    notifications={[
                        {
                            type: 'messages',
                            icon: <MessageCircle size={24} />,
                            title: 'New Messages',
                            message: `You have ${unreadMessages} unread message${unreadMessages !== 1 ? 's' : ''}`,
                            count: unreadMessages
                        },
                        {
                            type: 'pending',
                            icon: <Calendar size={24} />,
                            title: 'Pending Reservations',
                            message: `${pendingReservations} reservation${pendingReservations !== 1 ? 's' : ''} awaiting your response`,
                            count: pendingReservations
                        }
                    ]}
                    onClose={() => setShowNotificationPopup(false)}
                    onNavigate={(type) => {
                        if (type === 'messages') {
                            setCurrentView('messages');
                        } else if (type === 'pending') {
                            setCurrentView('dashboard'); // Scroll to reservations section
                        }
                        setShowNotificationPopup(false);
                    }}
                />
            )}
        </div>
    );
};

export default OwnerDashboard;