import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ItemList from './pages/ItemList';
import ItemDetail from './pages/ItemDetail';
import ItemForm from './pages/ItemForm';
import CategoryList from './pages/CategoryList';
import CategoryForm from './pages/CategoryForm';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import AlertList from './pages/AlertList';
import NotFound from './pages/NotFound';
import TransactionHistory from './pages/TransactionHistory';

// Services
import AuthService from './services/auth.service';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Check for user on initial load and when location changes
  useEffect(() => {
    const checkUser = () => {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    };
    
    checkUser();
  }, [location.pathname]);
  
  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="App">
      <Header currentUser={currentUser} logOut={logOut} />
      
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
          <Route 
            path="/profile" 
            element={currentUser ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/items" 
            element={currentUser ? <ItemList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/items/new" 
            element={currentUser ? <ItemForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/items/:id" 
            element={currentUser ? <ItemDetail /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/items/:id/edit" 
            element={currentUser ? <ItemForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/categories" 
            element={currentUser ? <CategoryList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/categories/new" 
            element={currentUser ? <CategoryForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/categories/:id/edit" 
            element={currentUser ? <CategoryForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/orders" 
            element={currentUser ? <OrderList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/orders/:id" 
            element={currentUser ? <OrderDetail /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/alerts" 
            element={currentUser ? <AlertList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/transactions" 
            element={
              currentUser ? <TransactionHistory /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/items/:itemId/transactions" 
            element={
              currentUser ? <TransactionHistory /> : <Navigate to="/login" />
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
}

export default App; 