import axios from 'axios';
import { API_URL } from '../constants';
import authHeader from './auth-header';

const ITEM_API_URL = `${API_URL}/items`;

class ItemService {
  getAllItems() {
    return axios.get(ITEM_API_URL, { headers: authHeader() });
  }

  getItemById(id) {
    return axios.get(`${ITEM_API_URL}/${id}`, { headers: authHeader() });
  }

  getItemBySku(sku) {
    return axios.get(`${ITEM_API_URL}/sku/${sku}`, { headers: authHeader() });
  }

  createItem(item) {
    return axios.post(ITEM_API_URL, item, { headers: authHeader() });
  }

  updateItem(id, item) {
    return axios.put(`${ITEM_API_URL}/${id}`, item, { headers: authHeader() });
  }

  deleteItem(id) {
    return axios.delete(`${ITEM_API_URL}/${id}`, { headers: authHeader() });
  }
}

const itemService = new ItemService();
export default itemService; 