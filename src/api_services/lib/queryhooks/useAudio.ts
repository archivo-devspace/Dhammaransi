import {useInfiniteQuery, useQuery} from 'react-query';
import {fetchAlbumLists, fetchSingleAlbum} from '../services/AudioService';
import {Album, ApiRes, ApiWithPaginations, Tayar} from '../../../types/apiRes';

export const useGetAlbums = (page: number) => {
  return useQuery<ApiWithPaginations<Album[]>>(
    ['albums', page], // queryKey, ensuring that page is included in the key for caching purposes
    fetchAlbumLists as any, // queryFn to fetch the album lists
    {
      keepPreviousData: true,
    },
  );
};

export const useGetAlbumsInfinite = () => {
  return useInfiniteQuery(
    'albums', // query key
    ({pageParam = 1}) => fetchAlbumLists(pageParam), // fetcher function with dynamic page param
    {
      getNextPageParam: lastPage => {
        const {current_page, last_page} = lastPage.data.results;
        return current_page < last_page ? current_page + 1 : undefined; // return next page or undefined to stop fetching
      },
      keepPreviousData: true, // keeps data from the previous page while loading next one
    },
  );
};

export const useGetSingleAlbum = (id: number) => {
  return useQuery<ApiRes<Tayar[]>>({
    queryKey: ['singleAlbum', id],
    queryFn: () => fetchSingleAlbum(id),
  });
};
