import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to request headers if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  guest: () =>
    api.post('/auth/guest'),
  
  getMe: () =>
    api.get('/auth/me'),
};

export const roomAPI = {
  create: (displayName, socketId) =>
    api.post('/rooms', { displayName, socketId }),
  getByCode: (code) =>
    api.get(`/rooms/${code}`),
};

export const gameAPI = {
  getByRoomCode: (roomCode) => api.get(`/rooms/${roomCode}`),
}

export const friendAPI = {
  getFriends:     ()                        => api.get('/friends'),
  getRequests:    ()                        => api.get('/friends/requests'),
  sendRequest:    (username)                => api.post(`/friends/request/${username}`),
  acceptRequest:  (userId)                  => api.post(`/friends/accept/${userId}`),
  declineRequest: (userId)                  => api.post(`/friends/decline/${userId}`),
  removeFriend:   (userId)                  => api.delete(`/friends/${userId}`),
  sendInviteEmail:(friendId, roomCode)      => api.post('/friends/invite-email', { friendId, roomCode }),
}

export default api;
