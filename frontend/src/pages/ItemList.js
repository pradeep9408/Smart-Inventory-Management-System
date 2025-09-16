import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import itemService from '../services/item.service';
import apiService from '../services/api.service';
import AuthService from '../services/auth.service';
import { Modal, Button, Form, InputGroup, Table, Badge } from 'react-bootstrap';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [itemToAdjust, setItemToAdjust] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const [adjustmentNote, setAdjustmentNote] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.roles) {
      setIsAdmin(currentUser.roles.includes('ROLE_ADMIN'));
    }
    
    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');
    
    if (categoryId) {
      setCategoryFilter(categoryId);
      fetchItemsByCategory(categoryId);
      fetchCategoryName(categoryId);
    } else {
      fetchItems();
    }
  }, [location.search]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems();
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch items. Please try again later.');
      setLoading(false);
      console.error('Error fetching items:', err);
    }
  };
  
  const fetchItemsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await apiService.getItemsByCategory(categoryId);
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch items for this category. Please try again later.');
      setLoading(false);
      console.error('Error fetching items by category:', err);
    }
  };
  
  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await apiService.getCategory(categoryId);
      setCategoryName(response.data.name);
    } catch (err) {
      console.error('Error fetching category details:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearCategoryFilter = () => {
    setCategoryFilter(null);
    setCategoryName('');
    navigate('/items');
  };
  
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await apiService.deleteItem(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
      
      // Refresh the list
      if (categoryFilter) {
        fetchItemsByCategory(categoryFilter);
      } else {
        fetchItems();
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
      setShowDeleteModal(false);
    }
  };
  
  const handleAdjustStockClick = (item) => {
    setItemToAdjust(item);
    setStockAdjustment(0);
    setAdjustmentNote('');
    setShowStockModal(true);
  };
  
  const handleStockAdjustmentChange = (e) => {
    setStockAdjustment(parseInt(e.target.value, 10) || 0);
  };
  
  const confirmStockAdjustment = async () => {
    if (!itemToAdjust) return;
    
    try {
      const updatedItem = {
        ...itemToAdjust,
        currentStock: itemToAdjust.currentStock + stockAdjustment
      };
      
      // Ensure stock doesn't go below zero
      if (updatedItem.currentStock < 0) {
        setError('Stock cannot be negative. Please adjust the quantity.');
        return;
      }
      
      await apiService.updateItem(itemToAdjust.id, updatedItem);
      
      // Create a transaction record if available in your API
      try {
        const transaction = {
          itemId: itemToAdjust.id,
          quantity: stockAdjustment,
          notes: adjustmentNote || 'Stock adjustment',
          type: stockAdjustment > 0 ? 'STOCK_IN' : 'STOCK_OUT'
        };
        await apiService.createTransaction(transaction);
      } catch (transactionErr) {
        console.error('Error creating transaction record:', transactionErr);
        // Continue even if transaction creation fails
      }
      
      setShowStockModal(false);
      setItemToAdjust(null);
      
      // Refresh the list
      if (categoryFilter) {
        fetchItemsByCategory(categoryFilter);
      } else {
        fetchItems();
      }
    } catch (err) {
      console.error('Error adjusting stock:', err);
      setError('Failed to adjust stock. Please try again.');
      setShowStockModal(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="mb-4">
        {categoryFilter ? `Items in ${categoryName}` : 'All Inventory Items'}
      </h2>
      
      {categoryFilter && (
        <div className="mb-3">
          <button 
            className="btn btn-outline-secondary" 
            onClick={clearCategoryFilter}
          >
            <i className="bi bi-arrow-left"></i> Back to All Items
          </button>
        </div>
      )}
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or SKU"
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
        <div className="col-md-6 text-end">
          <Link to="/items/new" className="btn btn-primary">
            <i className="bi bi-plus-circle"></i> Add New Item
          </Link>
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
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.sku}</td>
                    <td>{item.name}</td>
                    <td>{item.category ? item.category.name : 'N/A'}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className={`me-2 ${item.currentStock <= item.minimumStock ? 'text-danger fw-bold' : ''}`}>
                          {item.currentStock}
                        </span>
                        {item.currentStock <= item.minimumStock && (
                          <Badge bg="danger" pill>Low</Badge>
                        )}
                      </div>
                    </td>
                    <td>${item.sellingPrice}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleAdjustStockClick(item)}
                          className="d-flex align-items-center"
                        >
                          <i className="bi bi-box-arrow-in-down me-1"></i> Adjust
                        </Button>
                        <Link to={`/items/${item.id}`} className="btn btn-info btn-sm d-flex align-items-center">
                          <i className="bi bi-eye me-1"></i> View
                        </Link>
                        <Link to={`/items/${item.id}/edit`} className="btn btn-warning btn-sm d-flex align-items-center">
                          <i className="bi bi-pencil me-1"></i> Edit
                        </Link>
                        {isAdmin && (
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDeleteClick(item)}
                            className="d-flex align-items-center"
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the item "{itemToDelete?.name}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Stock Adjustment Modal */}
      <Modal show={showStockModal} onHide={() => setShowStockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adjust Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Current stock for <strong>{itemToAdjust?.name}</strong>: {itemToAdjust?.currentStock}</p>
          
          <Form.Group className="mb-3">
            <Form.Label>Adjustment Amount</Form.Label>
            <InputGroup>
              <Button 
                variant="outline-secondary" 
                onClick={() => setStockAdjustment(prev => prev - 1)}
              >
                -
              </Button>
              <Form.Control
                type="number"
                value={stockAdjustment}
                onChange={handleStockAdjustmentChange}
                aria-label="Stock adjustment amount"
              />
              <Button 
                variant="outline-secondary" 
                onClick={() => setStockAdjustment(prev => prev + 1)}
              >
                +
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">
              Use positive values to add stock, negative values to remove stock.
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={adjustmentNote}
              onChange={(e) => setAdjustmentNote(e.target.value)}
              placeholder="Optional: Add notes about this adjustment"
            />
          </Form.Group>
          
          <div className="alert alert-info">
            New stock level will be: <strong>{itemToAdjust ? itemToAdjust.currentStock + stockAdjustment : 0}</strong>
            {itemToAdjust && (itemToAdjust.currentStock + stockAdjustment) < 0 && (
              <div className="text-danger mt-2">
                Warning: Stock cannot be negative. Please adjust the quantity.
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStockModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={confirmStockAdjustment}
            disabled={itemToAdjust && (itemToAdjust.currentStock + stockAdjustment) < 0}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ItemList; 