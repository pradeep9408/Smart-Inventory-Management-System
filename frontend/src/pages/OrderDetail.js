import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authHeader from '../services/auth-header';
import { API_URL } from '../constants';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/${id}`, { headers: authHeader() });
      setOrder(response.data);
      setNewStatus(response.data.status);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch order details. Please try again later.');
      setLoading(false);
      console.error('Error fetching order details:', err);
    }
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const updateOrderStatus = async () => {
    try {
      await axios.put(
        `${API_URL}/orders/${id}/status?status=${newStatus}`,
        {},
        { headers: authHeader() }
      );
      fetchOrderDetails();
    } catch (err) {
      setError('Failed to update order status. Please try again later.');
      console.error('Error updating order status:', err);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axios.delete(`${API_URL}/orders/${id}`, { headers: authHeader() });
        navigate('/orders');
      } catch (err) {
        setError('Failed to cancel order. Please try again later.');
        console.error('Error cancelling order:', err);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning';
      case 'PROCESSING':
        return 'bg-info';
      case 'COMPLETED':
        return 'bg-success';
      case 'CANCELLED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
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

  if (!order) {
    return <div className="alert alert-warning">Order not found</div>;
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>Order #{order.orderNumber}</h2>
          <p className="text-muted">
            {order.orderType} Order - Created on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="col-md-4 text-end">
          <Link to="/orders" className="btn btn-secondary me-2">
            <i className="bi bi-arrow-left"></i> Back to List
          </Link>
          {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
            <button onClick={handleCancelOrder} className="btn btn-danger">
              <i className="bi bi-x-circle"></i> Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">Order Details</div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Order Type:</strong>
                </div>
                <div className="col-md-8">{order.orderType}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>{order.orderType === 'SALE' ? 'Customer:' : 'Supplier:'}</strong>
                </div>
                <div className="col-md-8">
                  {order.orderType === 'SALE' 
                    ? (order.customer || 'N/A') 
                    : (order.supplier || 'N/A')}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Total Amount:</strong>
                </div>
                <div className="col-md-8">${order.totalAmount.toFixed(2)}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Status:</strong>
                </div>
                <div className="col-md-8">
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Notes:</strong>
                </div>
                <div className="col-md-8">{order.notes || 'No notes'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Created By:</strong>
                </div>
                <div className="col-md-8">{order.createdBy || 'System'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">Update Status</div>
            <div className="card-body">
              {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      id="status"
                      className="form-select"
                      value={newStatus}
                      onChange={handleStatusChange}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <button 
                    onClick={updateOrderStatus} 
                    className="btn btn-primary"
                    disabled={newStatus === order.status}
                  >
                    Update Status
                  </button>
                </>
              ) : (
                <p className="text-center">
                  This order is {order.status.toLowerCase()} and cannot be updated.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">Order Items</div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.item.name}</td>
                      <td>{item.item.sku}</td>
                      <td>{item.quantity}</td>
                      <td>${item.unitPrice.toFixed(2)}</td>
                      <td>${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No items in this order</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                  <td><strong>${order.totalAmount.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 