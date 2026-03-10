import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, MapPin, BedDouble, Bath, Square, AlertCircle, Loader2, ChevronLeft, ChevronRight, Menu, X, Home, User, Info, Mail, Settings, LogOut, Heart, Filter, Star, Calendar, Eye, Phone } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import LogoutModal from '../../components/LogoutModal';
import ReserveModal from '../../components/ReserveModal';
import MyReservations from '../../components/MyReservations';
import ChatBox from '../../components/ChatBox';
import MessagesPage from '../../components/MessagesPage';
import NotificationBadge from '../../components/NotificationBadge';
import NotificationPopup from '../../components/NotificationPopup';
import { useNotifications } from '../../hooks/useNotifications';
import { MessageCircle } from 'lucide-react';

const TenantDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [username] = useState(() => sessionStorage.getItem('username') || 'Guest');
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState('all');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [customMinPrice, setCustomMinPrice] = useState('');
    const [customMaxPrice, setCustomMaxPrice] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showPropertyModal, setShowPropertyModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [currentView, setCurrentView] = useState('properties'); // 'properties', 'reservations', or 'messages'
    const [showChatBox, setShowChatBox] = useState(false);
    const [chatUser, setChatUser] = useState(null);
    const [chatProperty, setChatProperty] = useState(null);

    // Notifications
    const { unreadMessages, updatedReservations, refresh: refreshNotifications } = useNotifications();
    const [showNotificationPopup, setShowNotificationPopup] = useState(false);
    const [hasShownPopup, setHasShownPopup] = useState(false);

    // Helper function to get price values based on selected range
    const getPriceValues = () => {
        switch (priceRange) {
            case 'low':
                return { minPrice: null, maxPrice: 100000 };
            case 'mid':
                return { minPrice: 100000, maxPrice: 200000 };
            case 'high':
                return { minPrice: 200000, maxPrice: null };
            case 'custom':
                return {
                    minPrice: customMinPrice ? parseInt(customMinPrice) : null,
                    maxPrice: customMaxPrice ? parseInt(customMaxPrice) : null
                };
            default:
                return { minPrice: null, maxPrice: null };
        }
    };

    // Mock data for when backend is not available
    const mockProperties = [
        {
            id: 1,
            title: 'Modern Downtown Apartment',
            location: 'Colombo, Western Province',
            price: 120000,
            bedrooms: 2,
            bathrooms: 2,
            area: 950,
            type: 'apartment',
            rating: 4.8,
            status: 'active',
            imageFilenames: [],
            features: ['Parking', 'Gym', 'Pool']
        },
        {
            id: 2,
            title: 'Cozy Studio near Park',
            location: 'Negombo, Western Province',
            price: 85000,
            bedrooms: 1,
            bathrooms: 1,
            area: 500,
            type: 'studio',
            rating: 4.5,
            status: 'active',
            imageFilenames: [],
            features: ['Pet Friendly', 'Garden']
        },
        {
            id: 3,
            title: 'Spacious Family Home',
            location: 'Kandy, Central Province',
            price: 210000,
            bedrooms: 4,
            bathrooms: 3,
            area: 2200,
            type: 'house',
            rating: 4.9,
            status: 'active',
            imageFilenames: [],
            features: ['Garage', 'Backyard', 'Fireplace']
        },
        {
            id: 4,
            title: 'Luxury Penthouse Suite',
            location: 'Colombo 3, Western Province',
            price: 350000,
            bedrooms: 3,
            bathrooms: 3,
            area: 1800,
            type: 'apartment',
            rating: 5.0,
            status: 'active',
            imageFilenames: [],
            features: ['Concierge', 'Rooftop', 'Smart Home']
        },
        {
            id: 5,
            title: 'Charming Loft Space',
            location: 'Galle, Southern Province',
            price: 140000,
            bedrooms: 2,
            bathrooms: 1,
            area: 1100,
            type: 'loft',
            rating: 4.6,
            status: 'active',
            imageFilenames: [],
            features: ['High Ceilings', 'Exposed Brick']
        },
        {
            id: 6,
            title: 'Beach View Condo',
            location: 'Bentota, Southern Province',
            price: 190000,
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            type: 'condo',
            rating: 4.7,
            status: 'active',
            imageFilenames: [],
            features: ['Ocean View', 'Balcony', 'Pool']
        }
    ];

    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Debug: Log when chat state changes
    useEffect(() => {
        console.log('🔄 Chat State Changed:', {
            showChatBox,
            chatUser,
            chatProperty
        });
    }, [showChatBox, chatUser, chatProperty]);

    // Show notification popup on login if there are uncaught activities
    useEffect(() => {
        const hasNotifications = unreadMessages > 0 || updatedReservations > 0;
        const lastShown = sessionStorage.getItem('last_notification_popup');

        console.log('🔔 Notification Check:', {
            unreadMessages,
            updatedReservations,
            hasNotifications,
            hasShownPopup,
            lastShown
        });

        // Show popup only once per session and only if there are notifications
        if (hasNotifications && !hasShownPopup && !lastShown) {
            console.log('✅ Showing notification popup in 1 second...');
            const timer = setTimeout(() => {
                console.log('🎉 Opening notification popup now!');
                setShowNotificationPopup(true);
                setHasShownPopup(true);
                sessionStorage.setItem('last_notification_popup', 'true');
            }, 1000); // Show after 1 second

            return () => clearTimeout(timer);
        } else {
            console.log('❌ Not showing popup:', {
                reason: !hasNotifications ? 'No notifications' :
                    hasShownPopup ? 'Already shown' :
                        lastShown ? 'Shown in session' : 'Unknown'
            });
        }
    }, [unreadMessages, updatedReservations, hasShownPopup, username]);

    const fetchProperties = useCallback(async (page = 0, location = '', propertyType = 'all', minPrice = null, maxPrice = null) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ page: page, size: 9, sort: 'createdAt,desc' });
            if (location && location.trim()) params.append('location', location.trim());
            if (propertyType && propertyType !== 'all') params.append('propertyType', propertyType);
            if (minPrice && minPrice > 0) params.append('minPrice', minPrice.toString());
            if (maxPrice && maxPrice > 0) params.append('maxPrice', maxPrice.toString());
            const response = await apiClient.get(`/properties?${params.toString()}`);
            setProperties(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setCurrentPage(response.data.number || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (err) {
            console.error("Failed to fetch properties:", err);
            setError("Could not load properties. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search term to avoid API calls on every keystroke
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    // Debounce the search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const getPriceValuesLocal = () => {
            switch (priceRange) {
                case 'low':
                    return { minPrice: null, maxPrice: 100000 };
                case 'mid':
                    return { minPrice: 100000, maxPrice: 200000 };
                case 'high':
                    return { minPrice: 200000, maxPrice: null };
                case 'custom':
                    return {
                        minPrice: customMinPrice ? parseInt(customMinPrice) : null,
                        maxPrice: customMaxPrice ? parseInt(customMaxPrice) : null
                    };
                default:
                    return { minPrice: null, maxPrice: null };
            }
        };

        const { minPrice, maxPrice } = getPriceValuesLocal();
        fetchProperties(currentPage, debouncedSearchTerm, selectedFilter, minPrice, maxPrice);
    }, [currentPage, debouncedSearchTerm, selectedFilter, priceRange, customMinPrice, customMaxPrice, fetchProperties]);

    const handleLogout = () => {
        console.log('Tenant logout initiated');

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

    const handleThemeChange = (newTheme) => setTheme(newTheme);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Immediately update the debounced search term and reset to first page
        setDebouncedSearchTerm(searchTerm);
        if (currentPage !== 0) {
            setCurrentPage(0);
        } else {
            const { minPrice, maxPrice } = getPriceValues();
            fetchProperties(0, searchTerm, selectedFilter, minPrice, maxPrice);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setCurrentPage(newPage);
    };

    const toggleFavorite = (id) => {
        setFavorites(prev =>
            prev.includes(id)
                ? prev.filter(fav => fav !== id)
                : [...prev, id]
        );
    };

    const handlePropertyClick = (property) => {
        setSelectedProperty(property);
        setCurrentImageIndex(0); // Reset to first image
        setShowPropertyModal(true);
    };

    const closePropertyModal = () => {
        setShowPropertyModal(false);
        setSelectedProperty(null);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        if (selectedProperty?.imageFilenames?.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === selectedProperty.imageFilenames.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedProperty?.imageFilenames?.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedProperty.imageFilenames.length - 1 : prev - 1
            );
        }
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    // Touch/Swipe handling
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && selectedProperty?.imageFilenames?.length > 1) {
            nextImage();
        }
        if (isRightSwipe && selectedProperty?.imageFilenames?.length > 1) {
            prevImage();
        }
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (!showPropertyModal || !selectedProperty?.imageFilenames?.length) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevImage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextImage();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closePropertyModal();
        }
    };

    // Add keyboard event listener when modal is open
    useEffect(() => {
        if (showPropertyModal) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [showPropertyModal, selectedProperty]);

    const propertyTypes = [
        { value: 'all', label: 'All Types', icon: '🏘️' },
        { value: 'apartment', label: 'Apartment', icon: '🏢' },
        { value: 'house', label: 'House', icon: '🏡' },
        { value: 'villa', label: 'Villa', icon: '🏰' },
        { value: 'studio', label: 'Studio', icon: '🏠' },
        { value: 'room', label: 'Room', icon: '🚪' }
    ];

    // Filter out unavailable/reserved properties
    const filteredProperties = properties.filter(prop =>
        prop.status === 'active' || prop.status === 'available' || !prop.status
    );

    let propertyContent;
    if (isLoading && properties.length === 0) {
        propertyContent = (
            <div className="loading-state">
                <Loader2 size={48} className="animate-spin" />
                <p>Loading available properties...</p>
            </div>
        );
    } else if (error) {
        propertyContent = (
            <div className="error-state">
                <AlertCircle size={48} color="var(--danger-color)" />
                <h3>Error Loading Properties</h3>
                <p>{error}</p>
                <button onClick={() => {
                    const { minPrice, maxPrice } = getPriceValues();
                    fetchProperties(currentPage, searchTerm, selectedFilter, minPrice, maxPrice);
                }} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    } else if (filteredProperties.length === 0) {
        propertyContent = (
            <div className="no-results">
                <h3>No Properties Found</h3>
                {searchTerm ? (
                    <p>No properties match your search criteria "{searchTerm}".</p>
                ) : (
                    <p>Try adjusting your filters or search criteria</p>
                )}
            </div>
        );
    } else {
        propertyContent = (
            <>
                <div className="results-header">
                    <div className="results-count">
                        Found <strong>{filteredProperties.length}</strong> of <strong>{totalElements}</strong> {filteredProperties.length === 1 ? 'property' : 'properties'}
                        {searchTerm && ` for "${searchTerm}"`}
                    </div>
                </div>

                <div className="properties-grid">
                    {filteredProperties.map(prop => (
                        <div key={prop.id} className="property-card">
                            <div className="property-image">
                                {prop.imageFilenames && prop.imageFilenames.length > 0 ? (
                                    <img
                                        src={`https://project-rentify-production.up.reailway.app/api/files/${prop.imageFilenames[0]}`}
                                        alt={prop.title}
                                        loading="lazy"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                                        {propertyTypes.find(t => t.value === prop.type)?.icon || '🏢'}
                                    </div>
                                )}
                                <div className="property-badge">
                                    <Calendar size={14} />
                                    {prop.status === 'active' ? 'Available' : prop.status}
                                </div>
                                {prop.rating && (
                                    <div className="rating-badge">
                                        <Star size={14} fill="currentColor" />
                                        {prop.rating}
                                    </div>
                                )}
                            </div>
                            <div className="property-content">
                                <h3 className="property-title">{prop.title}</h3>
                                <div className="property-location">
                                    <MapPin size={16} />
                                    <span>{prop.location}</span>
                                </div>
                                <div className="property-details">
                                    {prop.bedrooms != null && (
                                        <div className="detail-item">
                                            <BedDouble size={16} />
                                            <span>{prop.bedrooms} Bed{prop.bedrooms !== 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                    {prop.bathrooms != null && (
                                        <div className="detail-item">
                                            <Bath size={16} />
                                            <span>{prop.bathrooms} Bath{prop.bathrooms !== 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                    {prop.area != null && (
                                        <div className="detail-item">
                                            <Square size={16} />
                                            <span>{prop.area} sqft</span>
                                        </div>
                                    )}
                                </div>
                                {prop.features && prop.features.length > 0 && (
                                    <div className="property-features">
                                        {prop.features.slice(0, 3).map((feature, idx) => (
                                            <span key={idx} className="feature-tag">{feature}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="property-footer">
                                    <button
                                        className="reserve-property-btn"
                                        onClick={() => {
                                            setSelectedProperty(prop);
                                            setShowReserveModal(true);
                                        }}
                                    >
                                        <Calendar size={18} />
                                        Reserve Property
                                    </button>
                                    <div className="property-footer-bottom">
                                        <div className="property-price-section">
                                            <div className="property-price">
                                                LKR {prop.price ? prop.price.toLocaleString() : 'N/A'}
                                            </div>
                                            <div className="price-period">per month</div>
                                        </div>
                                        <div className="property-actions">
                                            <button
                                                className="view-details-btn"
                                                onClick={() => handlePropertyClick(prop)}
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className={`favorite-btn ${favorites.includes(prop.id) ? 'active' : ''}`}
                                                onClick={() => toggleFavorite(prop.id)}
                                                title="Add to Favorites"
                                            >
                                                <Heart size={18} fill={favorites.includes(prop.id) ? 'currentColor' : 'none'} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={isLoading || currentPage === 0}
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>
                        <span>Page {currentPage + 1} of {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={isLoading || currentPage >= totalPages - 1}
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </>
        );
    }

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
                    --border-color: rgba(107, 124, 140, 0.2);
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
                    --border-color: rgba(196, 205, 213, 0.2);
                }

                .dashboard-container {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
                    min-height: 100vh;
                    background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
                    color: var(--text-primary);
                    position: relative;
                    overflow-x: hidden;
                }

                .circle {
                    position: fixed;
                    border-radius: 50%;
                    background: rgba(91, 141, 184, 0.15);
                    animation: float 20s infinite ease-in-out;
                    pointer-events: none;
                    z-index: 0;
                }

                body.dark-theme .circle {
                    background: rgba(123, 165, 204, 0.2);
                }

                .circle-1 {
                    width: 150px;
                    height: 150px;
                    top: 10%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .circle-2 {
                    width: 110px;
                    height: 110px;
                    top: 50%;
                    right: 15%;
                    animation-delay: 2s;
                }

                .circle-3 {
                    width: 180px;
                    height: 180px;
                    bottom: 15%;
                    left: 5%;
                    animation-delay: 4s;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-30px) translateX(30px);
                        opacity: 0.5;
                    }
                }

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
                    font-weight: 500;
                    font-size: 0.95rem;
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
                    padding: 0;
                }

                .sidebar-links button:hover {
                    color: var(--accent-color);
                }

                .favorites-badge {
                    background: var(--danger-color);
                    color: #FBF8F0;
                    padding: 0.125rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-left: auto;
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
                    padding: 2rem 4rem;
                    max-width: 1400px;
                    margin-left: auto;
                    margin-right: auto;
                    position: relative;
                    z-index: 1;
                }

                .dashboard-header {
                    margin-bottom: 2.5rem;
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
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    line-height: 1.1;
                }

                .dashboard-header p {
                    color: var(--text-secondary);
                    font-size: 1.25rem;
                    line-height: 1.6;
                }

                .search-section {
                    background: var(--card-bg);
                    backdrop-filter: blur(10px);
                    padding: 2rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    border: 1px solid var(--border-color);
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
                    border-radius: 8px;
                    font-size: 1rem;
                    background: var(--bg-gradient-start);
                    color: var(--text-primary);
                    transition: all 0.3s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px rgba(91, 141, 184, 0.1);
                }

                .search-input:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .filter-btn, .search-button {
                    padding: 1rem 2rem;
                    background: var(--accent-color);
                    color: #FBF8F0;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }

                .filter-btn:hover, .search-button:hover {
                    background: var(--accent-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(91, 141, 184, 0.3);
                }

                .filter-btn:disabled, .search-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
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
                    background: var(--bg-gradient-start);
                    color: var(--text-primary);
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .filter-select:focus {
                    outline: none;
                    border-color: var(--accent-color);
                }

                .custom-price-inputs {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                    flex-wrap: wrap;
                }

                .price-input-group {
                    flex: 1;
                    min-width: 150px;
                }

                .price-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 0.95rem;
                    background: var(--bg-gradient-start);
                    color: var(--text-primary);
                    transition: all 0.3s ease;
                }

                .price-input:focus {
                    outline: none;
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px rgba(91, 141, 184, 0.1);
                }

                .price-input::placeholder {
                    color: var(--text-secondary);
                    opacity: 0.7;
                }

                .type-filters {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .type-chip {
                    padding: 0.75rem 1.5rem;
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--card-bg);
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .type-chip:hover {
                    border-color: var(--accent-color);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(91, 141, 184, 0.2);
                }

                .type-chip.active {
                    background: var(--accent-color);
                    color: #FBF8F0;
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

                .loading-state, .error-state, .no-results {
                    text-align: center;
                    padding: 4rem 2rem;
                    margin-top: 2rem;
                    background: var(--card-bg);
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }

                .loading-state p, .error-state p, .no-results p {
                    color: var(--text-secondary);
                    margin-top: 1rem;
                    margin-bottom: 1.5rem;
                    font-size: 1.05rem;
                }

                .no-results h3, .error-state h3 {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
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

                .retry-button {
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

                .retry-button:hover {
                    background: var(--accent-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(91, 141, 184, 0.2);
                }

                .properties-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 1.5rem;
                    animation: fadeIn 0.5s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .property-card {
                    background: transparent;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .property-card:hover {
                    transform: translateY(-8px);
                }

                .property-image {
                    width: 100%;
                    height: 220px;
                    background: linear-gradient(135deg, #5B8DB8 0%, #7BA5CC 100%);
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
                    border-radius: 8px;
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
                    border-radius: 8px;
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
                    background: var(--bg-gradient-start);
                    padding: 0.375rem 0.875rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    border: 1px solid var(--border-color);
                }

                .property-footer {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-color);
                }

                .reserve-property-btn {
                    width: 100%;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .reserve-property-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
                }

                .property-footer-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
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

                .property-actions {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }

                .view-details-btn {
                    padding: 0.5rem;
                    border: 2px solid var(--accent-color);
                    background: transparent;
                    color: var(--accent-color);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                }

                .view-details-btn:hover {
                    background: var(--accent-color);
                    color: white;
                    transform: scale(1.1);
                }

                .favorite-btn {
                    background: none;
                    border: 2px solid var(--border-color);
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0.75rem;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .favorite-btn:hover {
                    border-color: var(--danger-color);
                    color: var(--danger-color);
                    transform: scale(1.1);
                }

                .favorite-btn.active {
                    background: var(--danger-color);
                    border-color: var(--danger-color);
                    color: white;
                }

                .pagination {
                    margin-top: 2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                }

                .pagination button {
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    border: 2px solid var(--accent-color);
                    background: transparent;
                    color: var(--accent-color);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                }

                .pagination button:hover:not(:disabled) {
                    background: var(--accent-color);
                    color: #FBF8F0;
                    transform: translateY(-2px);
                }

                .pagination button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pagination span {
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                @media (max-width: 1024px) {
                    .main-content {
                        padding: 2rem 2rem;
                    }

                    .dashboard-header h1 {
                        font-size: 2.5rem;
                    }
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3000;
                    padding: 2rem;
                }

                body.dark-theme .modal-overlay {
                    background: rgba(0, 0, 0, 0.7);
                }

                .property-modal {
                    background: linear-gradient(135deg, #fffef7 0%, #faf8f0 100%);
                    border-radius: 16px;
                    width: 100%;
                    max-width: 900px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: modalSlideIn 0.3s ease-out;
                    border: 1px solid rgba(102, 126, 234, 0.1);
                    display: flex;
                    flex-direction: column;
                    margin: auto;
                }

                body.dark-theme .property-modal {
                    background: linear-gradient(135deg, #2a3844 0%, #1f2937 100%);
                    border: 1px solid rgba(102, 126, 234, 0.2);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }

                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .modal-header h2 {
                    margin: 0;
                    color: var(--text-primary);
                    font-size: 1.5rem;
                }

                .modal-close-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-secondary);
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .modal-close-btn:hover {
                    background: var(--border-color);
                    color: var(--text-primary);
                }

                .modal-content {
                    padding: 0;
                    overflow-y: auto;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    width: 100%;
                    max-width: 100%;
                    margin: 0 auto;
                }

                .modal-details {
                    padding: 0 2rem 2rem 2rem;
                    width: 100%;
                    max-width: 100%;
                    margin: 0 auto;
                }

                .modal-image-gallery {
                    margin-bottom: 0;
                    padding: 2rem 2rem 1rem 2rem;
                    width: 100%;
                    max-width: 100%;
                    margin: 0 auto;
                }

                .image-viewer {
                    position: relative;
                    margin-bottom: 1rem;
                }

                .modal-main-image {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                }

                .image-nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10;
                }

                .image-nav-btn:hover {
                    background: rgba(0, 0, 0, 0.9);
                    transform: translateY(-50%) scale(1.1);
                }

                .prev-btn {
                    left: 10px;
                }

                .next-btn {
                    right: 10px;
                }

                .image-counter {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .image-thumbnails {
                    display: flex;
                    gap: 0.5rem;
                    overflow-x: auto;
                    padding: 0.5rem 0;
                    margin-bottom: 1rem;
                }

                .thumbnail {
                    width: 80px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 2px solid transparent;
                    flex-shrink: 0;
                }

                .thumbnail:hover {
                    transform: scale(1.05);
                    border-color: var(--accent-color);
                }

                .thumbnail.active {
                    border-color: var(--accent-color);
                    transform: scale(1.05);
                }

                .image-dots {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: none;
                    background: var(--border-color);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .dot:hover {
                    background: var(--accent-color);
                    transform: scale(1.2);
                }

                .dot.active {
                    background: var(--accent-color);
                    transform: scale(1.2);
                }

                .more-images {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 80px;
                    height: 60px;
                    background: var(--border-color);
                    border-radius: 8px;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-align: center;
                }

                .modal-header-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .modal-location {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                }

                .modal-price {
                    text-align: right;
                }

                .price-amount {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--accent-color);
                    display: block;
                }

                .modal-features {
                    margin-bottom: 2rem;
                }

                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: var(--bg-gradient-start);
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                }

                .feature-item div {
                    display: flex;
                    flex-direction: column;
                }

                .feature-label {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .feature-value {
                    font-weight: 600;
                    color: var(--text-primary);
                    text-transform: capitalize;
                }

                .modal-description {
                    margin-bottom: 2rem;
                }

                .modal-description h3 {
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }

                .modal-description p {
                    line-height: 1.6;
                    color: var(--text-secondary);
                }

                .modal-contact {
                    margin-bottom: 2rem;
                }

                .modal-contact h3 {
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }

                .contact-info, .owner-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    color: var(--text-secondary);
                }

                .modal-amenities {
                    margin-bottom: 2rem;
                }

                .modal-amenities h3 {
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }

                .amenities-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .amenity-tag {
                    padding: 0.5rem 1rem;
                    background: var(--accent-color);
                    color: white;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .modal-actions {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .favorite-action-btn, .contact-btn {
                    flex: 1;
                    min-width: 200px;
                    padding: 1rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .favorite-action-btn {
                    background: transparent;
                    border: 2px solid var(--danger-color);
                    color: var(--danger-color);
                }

                .favorite-action-btn.active {
                    background: var(--danger-color);
                    color: white;
                }

                .contact-btn {
                    background: var(--accent-color);
                    color: white;
                }

                .contact-btn:hover {
                    background: var(--accent-hover);
                    transform: translateY(-2px);
                }

                .reservations-view {
                    padding: 20px 0;
                }

                .view-header {
                    margin-bottom: 20px;
                }

                .back-btn {
                    background: var(--card-bg);
                    border: 2px solid var(--border-color);
                    color: var(--text-primary);
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 600;
                    transition: all 0.3s;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .back-btn:hover {
                    background: var(--accent-color);
                    color: white;
                    border-color: var(--accent-color);
                    transform: translateX(-5px);
                }

                @media (max-width: 768px) {
                    .navbar {
                        padding: 1rem 1.5rem;
                    }

                    .main-content {
                        padding: 1rem 1.5rem;
                        margin-top: 4rem;
                    }

                    .user-info span {
                        display: none;
                    }

                    .dashboard-header h1 {
                        font-size: 2rem;
                    }

                    .dashboard-header p {
                        font-size: 1rem;
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

                    /* Mobile Image Gallery Styles */
                    .modal-overlay {
                        padding: 0.5rem;
                    }

                    .modal-header {
                        padding: 1rem 1.5rem;
                    }

                    .modal-image-gallery {
                        padding: 1.5rem 1.5rem 0.75rem 1.5rem;
                    }

                    .modal-details {
                        padding: 0 1.5rem 1.5rem 1.5rem;
                    }

                    .image-nav-btn {
                        width: 50px;
                        height: 50px;
                    }

                    .image-counter {
                        top: 15px;
                        right: 15px;
                        padding: 0.75rem 1rem;
                    }

                    .image-thumbnails {
                        gap: 0.25rem;
                    }

                    .thumbnail {
                        width: 60px;
                        height: 45px;
                    }

                    .modal-main-image {
                        height: 250px;
                        user-select: none;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        touch-action: pan-y;
                    }

                    .modal-header-info {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .modal-price {
                        text-align: left;
                    }

                    .feature-grid {
                        grid-template-columns: 1fr;
                    }

                    .modal-actions {
                        flex-direction: column;
                    }

                    .favorite-action-btn, .contact-btn {
                        min-width: auto;
                    }

                    .sidebar {
                        width: 280px;
                        right: ${sidebarOpen ? '0' : '-280px'};
                    }
                }
            `}</style>

            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>

            <nav className="navbar">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className="logo-icon">R</div>
                    Rentify
                </div>
                <div className="nav-right">
                    <div className="user-info">
                        <div className="user-avatar">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <span>{username}</span>
                    </div>
                    <div className="hamburger" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </div>
                </div>
            </nav>

            <div className="overlay" onClick={toggleSidebar}></div>

            <div className="sidebar">
                <div className="sidebar-header">
                    <span className="user-greeting">Hello, {username}!</span>
                    <button className="close-btn" onClick={toggleSidebar}>
                        <X size={24} />
                    </button>
                </div>

                <ul className="sidebar-links">
                    <li>
                        <button onClick={() => { navigate('/'); toggleSidebar(); }}>
                            <Home size={20} /> Home
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { setCurrentView('reservations'); toggleSidebar(); }} style={{ position: 'relative' }}>
                            <Calendar size={20} /> My Reservations
                            {updatedReservations > 0 && <NotificationBadge count={updatedReservations} size="small" />}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { setCurrentView('messages'); toggleSidebar(); }} style={{ position: 'relative' }}>
                            <Mail size={20} /> Messages
                            {unreadMessages > 0 && <NotificationBadge count={unreadMessages} size="small" />}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { alert(`You have ${favorites.length} favorite properties!`); }}>
                            <Heart size={20} /> Favorites
                            {favorites.length > 0 && <span className="favorites-badge">{favorites.length}</span>}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { navigate('/profile'); toggleSidebar(); }}>
                            <User size={20} /> Profile
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { navigate('/about'); toggleSidebar(); }}>
                            <Info size={20} /> About Us
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { navigate('/contact'); toggleSidebar(); }}>
                            <Mail size={20} /> Contact
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { navigate('/settings'); toggleSidebar(); }}>
                            <Settings size={20} /> Settings
                        </button>
                    </li>
                </ul>

                <div className="theme-switcher">
                    <span className="theme-label">Theme</span>
                    <div className="theme-buttons">
                        <button
                            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('light')}
                        >
                            Light
                        </button>
                        <button
                            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('dark')}
                        >
                            Dark
                        </button>
                    </div>
                </div>

                <div className="logout-section">
                    <button className="logout-btn" onClick={handleLogout} disabled={isLoading}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="main-content">
                {currentView === 'properties' ? (
                    <>
                        <div className="dashboard-header">
                            <h1>Find Your Perfect Home</h1>
                            <p>Browse through our verified property listings and find your dream rental</p>
                        </div>

                        <div className="search-section">
                            <form onSubmit={handleSearchSubmit}>
                                <div className="search-bar">
                                    <div className="search-input-wrapper">
                                        <Search size={20} className="search-icon" />
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Search by location, property name, or features..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="filter-btn"
                                        onClick={() => setFilterOpen(!filterOpen)}
                                    >
                                        <Filter size={20} />
                                        Filters
                                    </button>
                                    <button
                                        type="submit"
                                        className="search-button"
                                        disabled={isLoading}
                                    >
                                        <Search size={20} />
                                        Search
                                    </button>
                                </div>
                            </form>

                            <div className="filters-row">
                                <div className="filter-group">
                                    <label className="filter-label">Price Range</label>
                                    <select
                                        className="filter-select"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                    >
                                        <option value="all">All Prices</option>
                                        <option value="low">Under LKR 100,000</option>
                                        <option value="mid">LKR 100,000 - 200,000</option>
                                        <option value="high">LKR 200,000+</option>
                                        <option value="custom">Custom Range</option>
                                    </select>
                                </div>

                                {priceRange === 'custom' && (
                                    <div className="custom-price-inputs">
                                        <div className="price-input-group">
                                            <label className="filter-label">Min Price (LKR)</label>
                                            <input
                                                type="number"
                                                className="price-input"
                                                placeholder="e.g., 50000"
                                                value={customMinPrice}
                                                onChange={(e) => setCustomMinPrice(e.target.value)}
                                                min="0"
                                            />
                                        </div>
                                        <div className="price-input-group">
                                            <label className="filter-label">Max Price (LKR)</label>
                                            <input
                                                type="number"
                                                className="price-input"
                                                placeholder="e.g., 150000"
                                                value={customMaxPrice}
                                                onChange={(e) => setCustomMaxPrice(e.target.value)}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                )}
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

                        {propertyContent}
                    </>
                ) : currentView === 'reservations' ? (
                    <div className="reservations-view">
                        <div className="view-header">
                            <button
                                className="back-btn"
                                onClick={() => setCurrentView('properties')}
                            >
                                ← Back to Properties
                            </button>
                        </div>
                        <MyReservations />
                    </div>
                ) : currentView === 'messages' ? (
                    <div className="messages-view">
                        <div className="view-header">
                            <button
                                className="back-btn"
                                onClick={() => setCurrentView('properties')}
                            >
                                ← Back to Properties
                            </button>
                        </div>
                        <MessagesPage />
                    </div>
                ) : null}
            </div>

            {/* Property Details Modal */}
            {showPropertyModal && selectedProperty && (
                <div className="modal-overlay" onClick={closePropertyModal}>
                    <div className="property-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedProperty.title}</h2>
                            <button className="modal-close-btn" onClick={closePropertyModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-content">
                            {/* Image Gallery */}
                            {selectedProperty.imageFilenames && selectedProperty.imageFilenames.length > 0 && (
                                <div className="modal-image-gallery">
                                    <div className="image-viewer">
                                        <img
                                            src={`https://project-rentify-production.up.reailway.app/api/files/${selectedProperty.imageFilenames[currentImageIndex]}`}
                                            alt={`${selectedProperty.title} ${currentImageIndex + 1}`}
                                            className="modal-main-image"
                                            onTouchStart={onTouchStart}
                                            onTouchMove={onTouchMove}
                                            onTouchEnd={onTouchEnd}
                                        />

                                        {/* Navigation Arrows */}
                                        {selectedProperty.imageFilenames.length > 1 && (
                                            <>
                                                <button
                                                    className="image-nav-btn prev-btn"
                                                    onClick={prevImage}
                                                    aria-label="Previous image"
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button
                                                    className="image-nav-btn next-btn"
                                                    onClick={nextImage}
                                                    aria-label="Next image"
                                                >
                                                    <ChevronRight size={24} />
                                                </button>
                                            </>
                                        )}

                                        {/* Image Counter */}
                                        {selectedProperty.imageFilenames.length > 1 && (
                                            <div className="image-counter">
                                                {currentImageIndex + 1} / {selectedProperty.imageFilenames.length}
                                            </div>
                                        )}
                                    </div>

                                    {/* Thumbnails */}
                                    {selectedProperty.imageFilenames.length > 1 && (
                                        <div className="image-thumbnails">
                                            {selectedProperty.imageFilenames.map((filename, index) => (
                                                <img
                                                    key={index}
                                                    src={`https://project-rentify-production.up.reailway.app/api/files/${filename}`}
                                                    alt={`${selectedProperty.title} ${index + 1}`}
                                                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                                    onClick={() => goToImage(index)}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Dots Indicator */}
                                    {selectedProperty.imageFilenames.length > 1 && (
                                        <div className="image-dots">
                                            {selectedProperty.imageFilenames.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                                    onClick={() => goToImage(index)}
                                                    aria-label={`Go to image ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="modal-details">
                                {/* Location and Price */}
                                <div className="modal-header-info">
                                    <div className="modal-location">
                                        <MapPin size={18} />
                                        <span>{selectedProperty.location}</span>
                                    </div>
                                    <div className="modal-price">
                                        <span className="price-amount">LKR {selectedProperty.price?.toLocaleString()}</span>
                                        <span className="price-period">per month</span>
                                    </div>
                                </div>

                                {/* Property Features */}
                                <div className="modal-features">
                                    <div className="feature-grid">
                                        <div className="feature-item">
                                            <Building2 size={20} />
                                            <div>
                                                <span className="feature-label">Type</span>
                                                <span className="feature-value">{selectedProperty.propertyType || selectedProperty.type}</span>
                                            </div>
                                        </div>
                                        {selectedProperty.bedrooms != null && (
                                            <div className="feature-item">
                                                <BedDouble size={20} />
                                                <div>
                                                    <span className="feature-label">Bedrooms</span>
                                                    <span className="feature-value">{selectedProperty.bedrooms}</span>
                                                </div>
                                            </div>
                                        )}
                                        {selectedProperty.bathrooms != null && (
                                            <div className="feature-item">
                                                <Bath size={20} />
                                                <div>
                                                    <span className="feature-label">Bathrooms</span>
                                                    <span className="feature-value">{selectedProperty.bathrooms}</span>
                                                </div>
                                            </div>
                                        )}
                                        {selectedProperty.area != null && (
                                            <div className="feature-item">
                                                <Square size={20} />
                                                <div>
                                                    <span className="feature-label">Area</span>
                                                    <span className="feature-value">{selectedProperty.area} sqft</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {selectedProperty.description && (
                                    <div className="modal-description">
                                        <h3>Description</h3>
                                        <p>{selectedProperty.description}</p>
                                    </div>
                                )}

                                {/* Contact Information */}
                                {selectedProperty.contact && (
                                    <div className="modal-contact">
                                        <h3>Contact Information</h3>
                                        <div className="contact-info">
                                            <Phone size={18} />
                                            <span>{selectedProperty.contact}</span>
                                        </div>
                                        {selectedProperty.ownerUsername && (
                                            <div className="owner-info">
                                                <User size={18} />
                                                <span>Owner: {selectedProperty.ownerUsername}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Additional Features */}
                                {selectedProperty.features && selectedProperty.features.length > 0 && (
                                    <div className="modal-amenities">
                                        <h3>Amenities</h3>
                                        <div className="amenities-list">
                                            {selectedProperty.features.map((feature, index) => (
                                                <span key={index} className="amenity-tag">{feature}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="modal-actions">
                                    <button
                                        className={`favorite-action-btn ${favorites.includes(selectedProperty.id) ? 'active' : ''}`}
                                        onClick={() => toggleFavorite(selectedProperty.id)}
                                    >
                                        <Heart size={20} fill={favorites.includes(selectedProperty.id) ? 'currentColor' : 'none'} />
                                        {favorites.includes(selectedProperty.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                                    </button>
                                    <button
                                        className="contact-btn"
                                        onClick={() => {
                                            console.log('🔵 Contact Owner clicked!');
                                            console.log('📦 Selected Property:', selectedProperty);
                                            console.log('👤 Owner:', selectedProperty?.owner);

                                            if (!selectedProperty?.owner) {
                                                alert('⚠️ Owner information not available. Please try refreshing the page.');
                                                return;
                                            }

                                            setChatUser(selectedProperty.owner);
                                            setChatProperty({
                                                id: selectedProperty.id,
                                                title: selectedProperty.title
                                            });
                                            setShowChatBox(true);
                                            console.log('✅ Chat should open now');
                                        }}
                                    >
                                        <Phone size={20} />
                                        Contact Owner
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
            />

            {/* Reserve Modal */}
            {showReserveModal && selectedProperty && (
                <ReserveModal
                    property={selectedProperty}
                    isOpen={showReserveModal}
                    onClose={() => setShowReserveModal(false)}
                    onSuccess={() => {
                        setShowReserveModal(false);
                        alert('Reservation request sent! The owner will be notified.');
                    }}
                />
            )}

            {/* Chat Box */}
            {showChatBox && chatUser && (
                <ChatBox
                    otherUser={chatUser}
                    propertyId={chatProperty?.id}
                    propertyTitle={chatProperty?.title}
                    isOpen={showChatBox}
                    onClose={() => {
                        setShowChatBox(false);
                        setChatUser(null);
                        setChatProperty(null);
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
                            type: 'reservations',
                            icon: <Calendar size={24} />,
                            title: 'Reservation Updates',
                            message: `${updatedReservations} reservation${updatedReservations !== 1 ? 's' : ''} updated by owner`,
                            count: updatedReservations
                        }
                    ]}
                    onClose={() => setShowNotificationPopup(false)}
                    onNavigate={(type) => {
                        if (type === 'messages') {
                            setCurrentView('messages');
                        } else if (type === 'reservations') {
                            setCurrentView('reservations');
                        }
                        setShowNotificationPopup(false);
                    }}
                />
            )}
        </div>
    );
};

export default TenantDashboard;