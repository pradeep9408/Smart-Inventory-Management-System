import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import apiService from '../services/api.service';

const ItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAddMode = !id;
  
  const [item, setItem] = useState({
    name: '',
    description: '',
    sku: '',
    currentStock: 0,
    minimumStock: 0,
    costPrice: 0,
    sellingPrice: 0,
    categoryId: '',
    supplier: '',
    location: '',
    active: true
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch categories
    apiService.getCategories()
      .then(response => {
        setCategories(response.data);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please refresh the page.');
      });

    // Fetch item details if in edit mode
    if (!isAddMode) {
      setLoading(true);
      apiService.getItem(id)
        .then(response => {
          const itemData = response.data;
          // Convert categoryId to string for form handling
          if (itemData.category) {
            itemData.categoryId = itemData.category.id.toString();
          }
          setItem(itemData);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch item details. Please try again.');
          setLoading(false);
          console.error('Error fetching item:', err);
        });
    }
  }, [id, isAddMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle numeric inputs
    if (['currentStock', 'minimumStock', 'costPrice', 'sellingPrice'].includes(name)) {
      const numValue = type === 'number' ? parseFloat(value) : value;
      setItem(prevState => ({
        ...prevState,
        [name]: numValue
      }));
    } else {
      setItem(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!item.name.trim()) {
      setError('Item name is required');
      setSubmitting(false);
      return;
    }

    if (!item.sku.trim()) {
      setError('SKU is required');
      setSubmitting(false);
      return;
    }

    // Prepare data for API
    const itemData = {
      ...item,
      currentStock: Number(item.currentStock),
      minimumStock: Number(item.minimumStock),
      costPrice: Number(item.costPrice),
      sellingPrice: Number(item.sellingPrice),
      // Convert categoryId to category object
      category: item.categoryId ? { id: Number(item.categoryId) } : null,
      // Remove categoryId as it's not expected by the backend
      categoryId: undefined
    };

    console.log('Sending item data:', itemData);

    const saveItem = isAddMode
      ? apiService.createItem(itemData)
      : apiService.updateItem(id, itemData);

    saveItem
      .then((response) => {
        console.log('Success response:', response);
        setSuccess(`Item ${isAddMode ? 'created' : 'updated'} successfully`);
        setSubmitting(false);
        setTimeout(() => {
          navigate('/items');
        }, 1500);
      })
      .catch(err => {
        console.error('Error saving item:', err);
        const resMessage =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          err.toString();
        setError(resMessage);
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h5">{isAddMode ? 'Add Item' : 'Edit Item'}</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={item.sku}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={item.description || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="categoryId"
                    value={item.categoryId || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Supplier</Form.Label>
                  <Form.Control
                    type="text"
                    name="supplier"
                    value={item.supplier || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="currentStock"
                    value={item.currentStock}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Minimum Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="minimumStock"
                    value={item.minimumStock}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Cost Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="costPrice"
                    value={item.costPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Selling Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="sellingPrice"
                    value={item.sellingPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={item.location || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                name="active"
                checked={item.active}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/items')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  isAddMode ? 'Create Item' : 'Update Item'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ItemForm; 