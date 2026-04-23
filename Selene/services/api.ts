import axios from 'axios';

const api = axios.create({
  baseURL: 'https://selene-mobile.onrender.com'
})

export default api;