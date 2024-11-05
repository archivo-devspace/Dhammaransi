import axiosInstance from '../AxiosInstance';

export const fetchPaintings = async (page: number) => {
  const res = await axiosInstance.get(`/painting/all`, {
    params: {
      page,
      per_page: 5,
    },
  });
  return res.data;
};

export const fetchSinglePainting = async (id: number) => {
  const response = await axiosInstance.get(`/painting/${id}`);
  return response.data;
};
