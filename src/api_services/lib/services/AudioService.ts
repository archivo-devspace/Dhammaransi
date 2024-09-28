import axiosInstance from '../AxiosInstance';

export const fetchAlbumLists = async () => {
  const res = await axiosInstance.get('/tayar/albums');
  return res.data;
};
