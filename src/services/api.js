import axios from 'axios';

const API = axios.create({
 baseURL: 'https://shopsprout-backend.onrender.com/api'
});

// Add token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Projects
export const getProjects = () => API.get('/projects');
export const createProject = (data) => API.post('/projects', data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// Services
export const getServices = () => API.get('/services');
export const createService = (data) => API.post('/services', data);

// Contacts
export const submitContact = (data) => API.post('/contacts', data);
export const getContacts = () => API.get('/contacts');

// Updates
export const getUpdates = (projectId) => API.get(`/updates/${projectId}`);
export const addUpdate = (projectId, data) => API.post(`/updates/${projectId}`, data);
// Agreements
export const getAgreements = () => API.get('/agreements');
export default API;