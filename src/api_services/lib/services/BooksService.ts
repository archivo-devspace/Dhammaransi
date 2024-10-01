import axiosInstance from '../AxiosInstance';

export const fetchBooksList = async () => {
  const res = await axiosInstance.get('/books');
  console.log("data")
  return res.data;
};
