import axios from 'axios';
import { API_URL } from '../constants';

const AUTH_API_URL = `${API_URL}/auth/`;

class AuthService {
  login(username, password) {
    return axios
      .post(AUTH_API_URL + 'signin', {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(username, email, password, fullName, phone, roles = ["ROLE_EMPLOYEE"]) {
    return axios.post(AUTH_API_URL + 'signup', {
      username,
      email,
      password,
      fullName,
      phone,
      roles
    });
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
}

const authService = new AuthService();
export default authService; 