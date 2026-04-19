import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data) localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data) localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

// THIS IS THE MISSING PIECE!
export const updateProfile = async (profilePicUrl) => {
  const response = await api.put('/auth/profile', { profilePic: profilePicUrl });
  if (response.data) localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};