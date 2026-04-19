import api from './api';

export const fetchMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};

// Updated to accept an object containing text and/or file data
export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

export const editMessage = async (id, text) => {
  const response = await api.put(`/messages/${id}`, { text });
  return response.data;
};

export const removeMessage = async (id) => {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
};

export const clearAllMessages = async () => {
  const response = await api.delete('/messages/clear');
  return response.data;
};

// New function to handle the actual file upload
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};