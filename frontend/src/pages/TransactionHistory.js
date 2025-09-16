import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api.service';
import AuthService from '../services/auth.service';
import { Table, Badge, Form, Row, Col } from 'react-bootstrap';
import moment from 'moment';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('');
  const { itemId } = useParams();

  useEffect(() => {
    // Check user roles
    const currentUser = AuthService.getCurrentUser();
    
    fetchTransactions();
  }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let response;
      
      if (itemId) {
        response = await apiService.getTransactionsByItem(itemId);
      } else {
        response = await apiService.getTransactions();
      }
      
      setTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch transaction history. Please try again later.');
      setLoading(false);
      console.error('Error fetching transactions:', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const filteredTransactions = filterType 
    ? transactions.filter(transaction => transaction.type === filterType)
    : transactions;

  const getTransactionTypeBadge = (type) => {
    switch(type) {
      case 'STOCK_IN':
        return <Badge bg="success">Stock In</Badge>;
      case 'STOCK_OUT':
        return <Badge bg="danger">Stock Out</Badge>;
      case 'ADJUSTMENT':
        return <Badge bg="warning">Adjustment</Badge>;
      default:
        return <Badge bg="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">
        {itemId ? 'Item Transaction History' : 'All Transactions'}
      </h2>
      
      {itemId && (
        <div className="mb-3">
          <Link to="/items" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left"></i> Back to Items
          </Link>
        </div>
      )}
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Type</Form.Label>
            <Form.Select 
              value={filterType} 
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

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
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Date & Time</th>
                {!itemId && <th>Item</th>}
                <th>Type</th>
                <th>Quantity</th>
                <th>User</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{moment(transaction.createdAt).format('MMM D, YYYY h:mm A')}</td>
                    {!itemId && (
                      <td>
                        <Link to={`/items/${transaction.itemId}`}>
                          {transaction.itemName} ({transaction.itemSku})
                        </Link>
                      </td>
                    )}
                    <td>{getTransactionTypeBadge(transaction.type)}</td>
                    <td className={transaction.type === 'STOCK_OUT' ? 'text-danger' : transaction.type === 'STOCK_IN' ? 'text-success' : ''}>
                      {transaction.type === 'STOCK_OUT' ? '-' : transaction.type === 'STOCK_IN' ? '+' : ''}
                      {Math.abs(transaction.quantity)}
                    </td>
                    <td>{transaction.username || 'System'}</td>
                    <td>{transaction.notes || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={itemId ? 5 : 6} className="text-center">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 