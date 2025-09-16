import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from '../constants';

class ApiService {
  // Helper method to handle errors
  handleError(error) {
    if (error.response && error.response.status === 401) {
      // If 401 Unauthorized, redirect to login
      window.location.href = '/login';
    }
    throw error;
  }

  // Items
  getItems() {
    return axios.get(`${API_URL}/items`, { headers: authHeader() })
      .catch(this.handleError);
  }

  getItem(id) {
    return axios.get(`${API_URL}/items/${id}`, { headers: authHeader() })
      .catch(this.handleError);
  }

  getItemsByCategory(categoryId) {
    return axios.get(`${API_URL}/items/category/${categoryId}`, { headers: authHeader() })
      .catch(this.handleError);
  }

  createItem(item) {
    return axios.post(`${API_URL}/items`, item, { headers: authHeader() })
      .catch(this.handleError);
  }

  updateItem(id, item) {
    return axios.put(`${API_URL}/items/${id}`, item, { headers: authHeader() })
      .catch(this.handleError);
  }

  deleteItem(id) {
    return axios.delete(`${API_URL}/items/${id}`, { headers: authHeader() })
      .catch(this.handleError);
  }

  // Categories
  getCategories() {
    return axios.get(`${API_URL}/categories`, { headers: authHeader() })
      .catch(this.handleError);
  }

  getCategory(id) {
    return axios.get(`${API_URL}/categories/${id}`, { headers: authHeader() })
      .catch(this.handleError);
  }

  createCategory(category) {
    return axios.post(`${API_URL}/categories`, category, { headers: authHeader() })
      .catch(this.handleError);
  }

  updateCategory(id, category) {
    return axios.put(`${API_URL}/categories/${id}`, category, { headers: authHeader() })
      .catch(this.handleError);
  }

  deleteCategory(id) {
    return axios.delete(`${API_URL}/categories/${id}`, { headers: authHeader() })
      .catch(this.handleError);
  }

  // Orders
  getOrders() {
    return axios.get(`${API_URL}/orders`, { headers: authHeader() })
      .catch(this.handleError);
  }

  getOrder(id) {
    return axios.get(`${API_URL}/orders/${id}`, { headers: authHeader() })
      .catch(this.handleError);
  }

  createOrder(order) {
    return axios.post(`${API_URL}/orders`, order, { headers: authHeader() })
      .catch(this.handleError);
  }

  updateOrder(id, order) {
    return axios.put(`${API_URL}/orders/${id}`, order, { headers: authHeader() })
      .catch(this.handleError);
  }

  cancelOrder(id) {
    return axios.put(`${API_URL}/orders/${id}/cancel`, {}, { headers: authHeader() })
      .catch(this.handleError);
  }

  // Alerts
  getAlerts() {
    return axios.get(`${API_URL}/alerts`, { headers: authHeader() })
      .catch(this.handleError);
  }

  // Suppliers
  getSuppliers() {
    return axios.get(`${API_URL}/suppliers`, { headers: authHeader() })
      .catch(this.handleError);
  }

  getSupplier(id) {
    return axios.get(`${API_URL}/suppliers/${id}`, { headers: authHeader() })
      .catch(this.handleError);
  }

  createSupplier(supplier) {
    return axios.post(`${API_URL}/suppliers`, supplier, { headers: authHeader() })
      .catch(this.handleError);
  }

  updateSupplier(id, supplier) {
    return axios.put(`${API_URL}/suppliers/${id}`, supplier, { headers: authHeader() })
      .catch(this.handleError);
  }

  deleteSupplier(id) {
    return axios.delete(`${API_URL}/suppliers/${id}`, { headers: authHeader() })
      .catch(this.handleError);
  }

  // Transaction API methods
  createTransaction(transactionData) {
    return axios.post(`${API_URL}/transactions`, transactionData, { headers: authHeader() })
      .catch(this.handleError);
  }

  getTransactions() {
    return axios.get(`${API_URL}/transactions`, { headers: authHeader() })
      .catch(this.handleError);
  }

  getTransactionsByItem(itemId) {
    return axios.get(`${API_URL}/transactions/item/${itemId}`, { headers: authHeader() })
      .catch(this.handleError);
  }
}

const apiService = new ApiService();
export default apiService; 