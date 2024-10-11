import axiosInstance from '../AxiosInstance';

export const fetchAlbumLists = async (page: number) => {
  const res = await axiosInstance.get(`/tayar/albums?page=${page}`);
  return res.data; // assuming this is your response structure
};

export const fetchSingleAlbum = async (id: number) => {
  const res = await axiosInstance.get(`/tayar/album/${id}`);
  console.log('restesting');
  return res.data;
};
