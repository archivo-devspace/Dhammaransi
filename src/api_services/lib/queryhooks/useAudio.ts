import {useQuery} from 'react-query';
import {fetchAlbumLists, fetchSingleAlbum} from '../services/AudioService';
import {Album, ApiRes, ApiWithPaginations, Tayar} from '../../../types/apiRes';

export const useGetAlbums = () => {
  return useQuery<ApiWithPaginations<Album[]>>({
    queryKey: ['albums'],
    queryFn: fetchAlbumLists,
  });
};

export const useGetSingleAlbum = (id: number) => {
  return useQuery<ApiRes<Tayar[]>>({
    queryKey: ['singleAlbum', id],
    queryFn: () => fetchSingleAlbum(id),
  });
};
