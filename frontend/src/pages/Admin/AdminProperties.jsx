import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import performAdminLogout from '../../utils/adminLogout';
import './AdminProperties.css';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/properties');
      const data = response.data.content || response.data;
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]); // Ensure properties is always an array
      if (error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const viewOwnerDetails = (ownerId) => {
    navigate(`/admin/users/${ownerId}`);
  };

  if (loading) {
    return <div className="admin-loading">Loading properties...</div>;
  }

  return (
    <div className="admin-properties">
      <div className="admin-header">
        <h1>All Properties</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/admin')} className="back-btn">
            Back to Dashboard
          </button>
          <button onClick={performAdminLogout} className="logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="properties-stats">
        <div className="stat-item">
          <span className="stat-label">Total Properties:</span>
          <span className="stat-value">{properties.length}</span>
        </div>
      </div>

      <div className="properties-table-container">
        <table className="properties-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Price</th>
              <th>Owner</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(property => (
              <tr key={property.id}>
                <td>{property.id}</td>
                <td className="title-cell">
                  <span className="property-title">{property.title}</span>
                </td>
                <td>{property.location}</td>
                <td>
                  <span className="property-type">{property.propertyType}</span>
                </td>
                <td className="price-cell">
                  {formatPrice(property.price)}
                </td>
                <td>
                  <div className="owner-info">
                    <span className="owner-name">{property.ownerName || property.ownerUsername}</span>
                    <span className="owner-email">{property.ownerEmail}</span>
                  </div>
                </td>
                <td>{formatDate(property.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => viewOwnerDetails(property.ownerId)}
                      className="action-btn view-owner"
                    >
                      View Owner
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {properties.length === 0 && (
        <div className="no-properties">
          No properties found in the system.
        </div>
      )}
    </div>
  );
};

export default AdminProperties;