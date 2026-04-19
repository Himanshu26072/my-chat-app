import axios from 'axios';

const api = axios.create({
  // UPDATED: Now pointing to your live Render backend!
  baseURL: 'https://my-chat-app-4fpe.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests and attach the token if it exists
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;