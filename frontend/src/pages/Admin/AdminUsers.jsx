import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import performAdminLogout from '../../utils/adminLogout';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setSelectedRole(roleParam);
    }
    fetchUsers();
  }, [searchParams]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const roleParam = searchParams.get('role');
      let response;
      
      if (roleParam && roleParam !== 'all') {
        response = await apiClient.get(`/admin/users/role/${roleParam}`);
        setUsers(Array.isArray(response.data) ? response.data : []);
      } else {
        response = await apiClient.get('/admin/users');
        const data = response.data.content || response.data;
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Ensure users is always an array
      if (error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    if (role === 'all') {
      navigate('/admin/users');
    } else {
      navigate(`/admin/users?role=${role}`);
    }
  };

  const viewUserProperties = (userId) => {
    navigate(`/admin/users/${userId}/properties`);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeClass = (roles) => {
    if (roles.includes('ROLE_ADMIN')) return 'role-admin';
    if (roles.includes('ROLE_OWNER')) return 'role-owner';
    if (roles.includes('ROLE_TENANT')) return 'role-tenant';
    return 'role-default';
  };

  if (loading) {
    return <div className="admin-loading">Loading users...</div>;
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>User Management</h1>
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

      <div className="filters">
        <div className="filter-buttons">
          <button 
            className={selectedRole === 'all' ? 'active' : ''}
            onClick={() => handleRoleFilter('all')}
          >
            All Users ({users.length})
          </button>
          <button 
            className={selectedRole === 'ROLE_OWNER' ? 'active' : ''}
            onClick={() => handleRoleFilter('ROLE_OWNER')}
          >
            Owners
          </button>
          <button 
            className={selectedRole === 'ROLE_TENANT' ? 'active' : ''}
            onClick={() => handleRoleFilter('ROLE_TENANT')}
          >
            Tenants
          </button>
          <button 
            className={selectedRole === 'ROLE_ADMIN' ? 'active' : ''}
            onClick={() => handleRoleFilter('ROLE_ADMIN')}
          >
            Admins
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Roles</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.fullName || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <div className="roles">
                    {user.roles.map(role => (
                      <span 
                        key={role} 
                        className={`role-badge ${getRoleBadgeClass(user.roles)}`}
                      >
                        {role.replace('ROLE_', '')}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    {user.roles.includes('ROLE_OWNER') && (
                      <button 
                        onClick={() => viewUserProperties(user.id)}
                        className="action-btn view-properties"
                      >
                        View Properties
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="no-users">
          No users found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default AdminUsers;