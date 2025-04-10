import axios from 'axios';

const API_URL = '/api/notifications';

// Get notifications for current user
const getMyNotifications = async () => {
  const response = await axios.get(`${API_URL}/my`);
  return response.data;
};

// Mark notification as read
const markAsRead = async (notificationId) => {
  const response = await axios.patch(`${API_URL}/${notificationId}/read`);
  return response.data;
};

// Mark all notifications as read
const markAllAsRead = async () => {
  const response = await axios.patch(`${API_URL}/read-all`);
  return response.data;
};

// Delete a notification
const deleteNotification = async (notificationId) => {
  const response = await axios.delete(`${API_URL}/${notificationId}`);
  return response.data;
};

export const notificationService = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
