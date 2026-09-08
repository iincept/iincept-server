import axiosClient from './axiosClient';

export const login = async (email, password) => {
  const response = await axiosClient.post('/auth/login', { email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosClient.get('/auth/profile');
  return response.data;
};

export const logout = async () => {
  const response = await axiosClient.post('/auth/logout');
  return response.data;
};
