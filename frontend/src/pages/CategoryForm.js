import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import apiService from '../services/api.service';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAddMode = !id;
  
  const [category, setCategory] = useState({
    name: '',
    description: '',
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAddMode) {
      setLoading(true);
      apiService.getCategory(id)
        .then(response => {
          setCategory(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch category details. Please try again.');
          setLoading(false);
          console.error('Error fetching category:', err);
        });
    }
  }, [id, isAddMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!category.name.trim()) {
      setError('Category name is required');
      setSubmitting(false);
      return;
    }

    const saveCategory = isAddMode
      ? apiService.createCategory(category)
      : apiService.updateCategory(id, category);

    saveCategory
      .then(() => {
        setSuccess(`Category ${isAddMode ? 'created' : 'updated'} successfully`);
        setSubmitting(false);
        setTimeout(() => {
          navigate('/categories');
        }, 1500);
      })
      .catch(err => {
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
        <Card.Header as="h5">{isAddMode ? 'Add Category' : 'Edit Category'}</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={category.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={category.description || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                name="active"
                checked={category.active}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/categories')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  isAddMode ? 'Create Category' : 'Update Category'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CategoryForm; 