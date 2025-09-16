import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';

import AuthService from '../services/auth.service';

const Login = () => {
  const navigate = useNavigate();
  
  const form = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage('');
    setLoading(true);

    AuthService.login(username, password)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      });
  };

  return (
    <Container className="col-md-6 mt-5">
      <Card>
        <Card.Header as="h5" className="text-center">Login</Card.Header>
        <Card.Body>
          <Form onSubmit={handleLogin} ref={form}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={onChangeUsername}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={onChangePassword}
                required
              />
            </Form.Group>

            {message && (
              <Alert variant="danger" className="mt-3">
                {message}
              </Alert>
            )}

            <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <span>Login</span>
              )}
            </Button>
            
            <div className="mt-3 text-center">
              <p>
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login; 