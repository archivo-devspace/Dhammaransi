import axiosInstance from '../AxiosInstance';

export const fetchAlbumLists = async () => {
  const res = await axiosInstance.get('/tayar/albums');
  return res.data;
};


export const fetchSingleAlbum = async (id:number) => {
  const res = await axiosInstance.get(`/tayar/album/${id}`);
  return res.data;
};
