import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api.service';
import AuthService from '../services/auth.service';
import { Button, Badge } from 'react-bootstrap';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    // Check user roles
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.roles) {
      setIsAdmin(currentUser.roles.includes('ROLE_ADMIN'));
      setIsManager(currentUser.roles.includes('ROLE_MANAGER'));
    }
    
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
      setLoading(false);
      console.error('Error fetching orders:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilter = (e) => {
    setFilterType(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.supplier && order.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'ALL' || order.orderType === filterType;
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'PROCESSING':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Orders</h2>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by order #, customer, or supplier"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-search"></i> Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <select 
            className="form-select" 
            value={filterType} 
            onChange={handleTypeFilter}
          >
            <option value="ALL">All Types</option>
            <option value="PURCHASE">Purchase</option>
            <option value="SALE">Sale</option>
          </select>
        </div>
        <div className="col-md-2">
          <select 
            className="form-select" 
            value={filterStatus} 
            onChange={handleStatusFilter}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="col-md-4 text-end">
          {(isAdmin || isManager) && (
            <Link to="/orders/new" className="btn btn-primary">
              <i className="bi bi-plus-circle"></i> Create New Order
            </Link>
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
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Type</th>
                <th>Date</th>
                <th>Customer/Supplier</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.orderType}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      {order.orderType === 'SALE' 
                        ? order.customer || 'N/A' 
                        : order.supplier || 'N/A'}
                    </td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <Badge bg={getStatusBadgeClass(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Link to={`/orders/${order.id}`} className="btn btn-info btn-sm d-flex align-items-center">
                          <i className="bi bi-eye me-1"></i> View
                        </Link>
                        {(isAdmin || isManager) && order.status === 'PENDING' && (
                          <Link to={`/orders/${order.id}/edit`} className="btn btn-warning btn-sm d-flex align-items-center">
                            <i className="bi bi-pencil me-1"></i> Edit
                          </Link>
                        )}
                        {order.status === 'PENDING' && (
                          <Button 
                            variant="danger" 
                            size="sm"
                            className="d-flex align-items-center"
                            onClick={() => console.log('Cancel order:', order.id)}
                          >
                            <i className="bi bi-x-circle me-1"></i> Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList; 