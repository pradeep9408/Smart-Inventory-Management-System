import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api.service';
import AuthService from '../services/auth.service';
import { Table, Badge, Modal, Button } from 'react-bootstrap';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.roles) {
      setIsAdmin(currentUser.roles.includes('ROLE_ADMIN'));
    }
    
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      console.log('Categories response:', response.data); // Debug log
      
      // Fetch item counts for each category if not provided by the backend
      const categoriesWithCounts = await Promise.all(
        response.data.map(async (category) => {
          if (category.itemCount === undefined || category.itemCount === null) {
            try {
              const itemsResponse = await apiService.getItemsByCategory(category.id);
              return {
                ...category,
                itemCount: itemsResponse.data.length
              };
            } catch (err) {
              console.error(`Error fetching items for category ${category.id}:`, err);
              return {
                ...category,
                itemCount: 0
              };
            }
          }
          return category;
        })
      );
      
      setCategories(categoriesWithCounts);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch categories. Please try again later.');
      setLoading(false);
      console.error('Error fetching categories:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await apiService.deleteCategory(categoryToDelete.id);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      
      // Refresh the list
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
      setShowDeleteModal(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="mb-4">Categories</h2>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
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
          <Link to="/categories/new" className="btn btn-primary">
            <i className="bi bi-plus-circle"></i> Add New Category
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
                <th>Name</th>
                <th>Description</th>
                <th>Items</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="fw-bold">{category.name}</td>
                    <td>{category.description || 'No description available'}</td>
                    <td>
                      <Badge bg="primary" pill>
                        {category.itemCount || 0} {category.itemCount === 1 ? 'item' : 'items'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={category.active ? 'success' : 'danger'}>
                        {category.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Link to={`/items?category=${category.id}`} className="btn btn-primary btn-sm d-flex align-items-center">
                          <i className="bi bi-box me-1"></i> Items
                        </Link>
                        <Link to={`/categories/${category.id}/edit`} className="btn btn-warning btn-sm d-flex align-items-center">
                          <i className="bi bi-pencil me-1"></i> Edit
                        </Link>
                        {isAdmin && (
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDeleteClick(category)}
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
                  <td colSpan="5" className="text-center">
                    No categories found
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
          Are you sure you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone.
          {categoryToDelete && categoryToDelete.itemCount > 0 && (
            <div className="alert alert-warning mt-3">
              Warning: This category contains {categoryToDelete.itemCount} items. Deleting it may affect these items.
            </div>
          )}
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
    </div>
  );
};

export default CategoryList; 