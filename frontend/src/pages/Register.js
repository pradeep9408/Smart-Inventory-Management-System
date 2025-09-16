import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import AuthService from '../services/auth.service';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ROLE_EMPLOYEE');
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeFullName = (e) => {
    setFullName(e.target.value);
  };

  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };

  const onChangeRole = (e) => {
    setRole(e.target.value);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage('');
    setSuccessful(false);
    setLoading(true);

    const roles = [role];

    AuthService.register(username, email, password, fullName, phone, roles)
      .then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
          setLoading(false);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
          setLoading(false);
        }
      );
  };

  return (
    <Container className="col-md-6 mt-5">
      <Card>
        <Card.Header as="h5" className="text-center">Sign Up</Card.Header>
        <Card.Body>
          <Form onSubmit={handleRegister}>
            {!successful && (
              <>
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
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={onChangeEmail}
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
                    minLength="6"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={onChangeFullName}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={phone}
                    onChange={onChangePhone}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={role}
                    onChange={onChangeRole}
                    required
                  >
                    <option value="ROLE_EMPLOYEE">Employee</option>
                    <option value="ROLE_ADMIN">Admin</option>
                    <option value="ROLE_MANAGER">Manager</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </Button>
                
                <div className="mt-3 text-center">
                  <p>
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </div>
              </>
            )}

            {message && (
              <Alert variant={successful ? "success" : "danger"} className="mt-3">
                {message}
              </Alert>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register; 