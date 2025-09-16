import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import authHeader from '../services/auth-header';
import { API_URL } from '../constants';
import AuthService from '../services/auth.service';
import { Button, Badge, Card } from 'react-bootstrap';

const AlertList = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ACTIVE');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    // Check user roles
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.roles) {
      setIsAdmin(currentUser.roles.includes('ROLE_ADMIN'));
      setIsManager(currentUser.roles.includes('ROLE_MANAGER'));
    }
    
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/alerts`, { headers: authHeader() });
      setAlerts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch alerts. Please try again later.');
      setLoading(false);
      console.error('Error fetching alerts:', err);
    }
  };

  const handleTypeFilter = (e) => {
    setFilterType(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleGenerateAlerts = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/alerts/generate`, {}, { headers: authHeader() });
      fetchAlerts();
    } catch (err) {
      setError('Failed to generate alerts. Please try again later.');
      setLoading(false);
      console.error('Error generating alerts:', err);
    }
  };

  const handleResolveAlert = async (id) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      await axios.put(
        `${API_URL}/alerts/${id}/resolve?resolvedBy=${currentUser.username}`,
        {},
        { headers: authHeader() }
      );
      fetchAlerts();
    } catch (err) {
      setError('Failed to resolve alert. Please try again later.');
      console.error('Error resolving alert:', err);
    }
  };

  const handleIgnoreAlert = async (id) => {
    try {
      await axios.put(`${API_URL}/alerts/${id}/ignore`, {}, { headers: authHeader() });
      fetchAlerts();
    } catch (err) {
      setError('Failed to ignore alert. Please try again later.');
      console.error('Error ignoring alert:', err);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = filterType === 'ALL' || alert.alertType === filterType;
    const matchesStatus = filterStatus === 'ALL' || alert.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const getAlertTypeBadgeClass = (type) => {
    switch (type) {
      case 'LOW_STOCK':
        return 'warning';
      case 'OUT_OF_STOCK':
        return 'danger';
      case 'EXPIRY_APPROACHING':
        return 'info';
      case 'EXPIRED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'danger';
      case 'RESOLVED':
        return 'success';
      case 'IGNORED':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Stock Alerts</h2>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <select 
            className="form-select" 
            value={filterType} 
            onChange={handleTypeFilter}
          >
            <option value="ALL">All Alert Types</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="EXPIRY_APPROACHING">Expiry Approaching</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
        <div className="col-md-3">
          <select 
            className="form-select" 
            value={filterStatus} 
            onChange={handleStatusFilter}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="RESOLVED">Resolved</option>
            <option value="IGNORED">Ignored</option>
          </select>
        </div>
        <div className="col-md-6 text-end">
          {(isAdmin || isManager) && (
            <Button onClick={handleGenerateAlerts} variant="primary">
              <i className="bi bi-bell me-1"></i> Generate Alerts
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="col-md-6 mb-4">
                <Card className="h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>
                      <Badge bg={getAlertTypeBadgeClass(alert.alertType)} className="me-2">
                        {alert.alertType.replace('_', ' ')}
                      </Badge>
                      <Badge bg={getStatusBadgeClass(alert.status)}>
                        {alert.status}
                      </Badge>
                    </span>
                    <small>{new Date(alert.createdAt).toLocaleString()}</small>
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>
                      <Link to={`/items/${alert.item.id}`}>
                        {alert.item.name}
                      </Link>
                    </Card.Title>
                    <Card.Text>{alert.message}</Card.Text>
                    
                    {alert.status === 'ACTIVE' && (
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          onClick={() => handleResolveAlert(alert.id)} 
                          variant="success"
                          size="sm"
                          className="d-flex align-items-center"
                        >
                          <i className="bi bi-check-circle me-1"></i> Resolve
                        </Button>
                        <Button 
                          onClick={() => handleIgnoreAlert(alert.id)} 
                          variant="secondary"
                          size="sm"
                          className="d-flex align-items-center"
                        >
                          <i className="bi bi-eye-slash me-1"></i> Ignore
                        </Button>
                      </div>
                    )}
                    
                    {alert.status === 'RESOLVED' && (
                      <div className="text-muted mt-2">
                        <small>
                          Resolved by {alert.resolvedBy} on {new Date(alert.resolvedAt).toLocaleString()}
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info">No alerts found</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertList; 