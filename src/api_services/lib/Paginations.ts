import axiosInstance from './AxiosInstance';

export const fetchPaintings = async () => {
  const res = await axiosInstance.get('/painting/all');
  return res.data;
};
