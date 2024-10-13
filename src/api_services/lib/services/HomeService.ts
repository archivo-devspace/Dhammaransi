import axiosInstance from '../AxiosInstance';

export const fetchHomeScreenData = async () => {
  const res = await axiosInstance.get('/home');
  return res.data;
};
