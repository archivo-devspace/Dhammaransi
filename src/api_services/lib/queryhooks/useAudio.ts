import {useQuery} from 'react-query';
import {fetchAlbumLists} from '../services/AudioService';
import {Album, ApiWithPaginations} from '../../../types/apiRes';

export const useGetAlbums = () => {
  return useQuery<ApiWithPaginations<Album[]>>({
    queryKey: ['albums'],
    queryFn: fetchAlbumLists,
  });
};
