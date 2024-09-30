import axiosInstance from '../AxiosInstance';

export const fetchBooksList = async () => {
  const res = await axiosInstance.get('/books');
  return res.data;
};
