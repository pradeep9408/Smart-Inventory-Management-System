import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authHeader from '../services/auth-header';
import { API_URL } from '../constants';
import AuthService from '../services/auth.service';
import { Button, Card, Badge } from 'react-bootstrap';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    // Check user roles
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.roles) {
      setIsAdmin(currentUser.roles.includes('ROLE_ADMIN'));
      setIsManager(currentUser.roles.includes('ROLE_MANAGER'));
    }
    
    const getItemData = async () => {
      await fetchItemDetails();
      await fetchItemTransactions();
    };
    
    getItemData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/items/${id}`, { headers: authHeader() });
      setItem(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch item details. Please try again later.');
      setLoading(false);
      console.error('Error fetching item details:', err);
    }
  };

  const fetchItemTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions/item/${id}`, { headers: authHeader() });
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching item transactions:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to deactivate this item?')) {
      try {
        await axios.delete(`${API_URL}/items/${id}`, { headers: authHeader() });
        navigate('/items');
      } catch (err) {
        setError('Failed to deactivate item. Please try again later.');
        console.error('Error deactivating item:', err);
      }
    }
  };

  const handleAdjustStockClick = (item, action) => {
    // Implement the logic to handle adjusting stock
    console.log(`Adjust stock action: ${action} for item:`, item);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!item) {
    return <div className="alert alert-warning">Item not found</div>;
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>{item.name}</h2>
          <p className="text-muted">SKU: {item.sku}</p>
        </div>
        <div className="col-md-4 text-end">
          <Link to="/items" className="btn btn-secondary me-2">
            <i className="bi bi-arrow-left"></i> Back to List
          </Link>
          <Link to={`/items/${id}/edit`} className="btn btn-warning me-2">
            <i className="bi bi-pencil"></i> Edit
          </Link>
          <Link to={`/items/${id}/transactions`} className="btn btn-info me-2">
            <i className="bi bi-clock-history"></i> View Transaction History
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            <i className="bi bi-trash"></i> Deactivate
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <Card className="mb-4">
            <Card.Header>Item Details</Card.Header>
            <Card.Body>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Description:</strong>
                </div>
                <div className="col-md-8">{item.description || 'No description available'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Category:</strong>
                </div>
                <div className="col-md-8">{item.category ? item.category.name : 'N/A'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Current Stock:</strong>
                </div>
                <div className="col-md-8">
                  <span className={item.currentStock <= item.minimumStock ? 'text-danger' : ''}>
                    {item.currentStock} units
                  </span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Minimum Stock:</strong>
                </div>
                <div className="col-md-8">{item.minimumStock} units</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Cost Price:</strong>
                </div>
                <div className="col-md-8">${item.costPrice}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Selling Price:</strong>
                </div>
                <div className="col-md-8">${item.sellingPrice}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Location:</strong>
                </div>
                <div className="col-md-8">{item.location || 'Not specified'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Supplier:</strong>
                </div>
                <div className="col-md-8">{item.supplier || 'Not specified'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Expiry Date:</strong>
                </div>
                <div className="col-md-8">{item.expiryDate || 'Not applicable'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Status:</strong>
                </div>
                <div className="col-md-8">
                  <Badge bg={item.active ? 'success' : 'danger'}>
                    {item.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          {item.imageUrl ? (
            <div className="card mb-4">
              <div className="card-header">Product Image</div>
              <div className="card-body text-center">
                <img src={item.imageUrl} alt={item.name} className="img-fluid" />
              </div>
            </div>
          ) : null}

          <div className="card mb-4">
            <div className="card-header">Quick Actions</div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  className="d-flex align-items-center justify-content-center"
                  onClick={() => navigate(`/items/${id}/transactions`)}
                >
                  <i className="bi bi-clock-history me-2"></i> View Transaction History
                </Button>
                <Button 
                  variant="success" 
                  className="d-flex align-items-center justify-content-center"
                  onClick={() => handleAdjustStockClick(item, 'add')}
                >
                  <i className="bi bi-plus-circle me-2"></i> Add Stock
                </Button>
                <Button 
                  variant="warning" 
                  className="d-flex align-items-center justify-content-center"
                  onClick={() => handleAdjustStockClick(item, 'remove')}
                >
                  <i className="bi bi-dash-circle me-2"></i> Remove Stock
                </Button>
                {(isAdmin || isManager) && (
                  <Button 
                    variant="info" 
                    className="d-flex align-items-center justify-content-center"
                    onClick={() => navigate(`/items/${id}/edit`)}
                  >
                    <i className="bi bi-pencil me-2"></i> Edit Item
                  </Button>
                )}
                {isAdmin && (
                  <Button 
                    variant="danger" 
                    className="d-flex align-items-center justify-content-center"
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash me-2"></i> Delete Item
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">Transaction History</div>
        <div className="card-body">
          {transactions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Reason</th>
                    <th>Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                      <td>{transaction.type}</td>
                      <td>
                        <span className={transaction.quantity > 0 ? 'text-success' : 'text-danger'}>
                          {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                        </span>
                      </td>
                      <td>{transaction.reason}</td>
                      <td>{transaction.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No transaction history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail; 