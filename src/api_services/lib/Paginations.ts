import axiosInstance from './AxiosInstance';

export const fetchPaintings = async () => {
  const res = await axiosInstance.get('/painting/all');
  return res.data;
};

export const fetchSinglePainting = async (id: string) => {
  const response = await axiosInstance.get(`/painting/${id}`);
  return response.data; // Assuming the API response has the painting data in `data`
};
