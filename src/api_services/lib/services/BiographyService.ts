import axiosInstance from '../AxiosInstance';

export const fetchBiography = async () => {
  const res = await axiosInstance.get('/biography');
  return res.data;
};
