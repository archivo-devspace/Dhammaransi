import {useInfiniteQuery, useQuery} from 'react-query';
import {fetchPaintings, fetchSinglePainting} from '../services/PaintingService';
import {
  ApiRes,
  ApiWithPaginations,
  PaintingApiRes,
  SinglePaintingApiRes,
} from '../../../types/apiRes';

export const useGetPaintings = (page: number) => {
  return useQuery<ApiWithPaginations<SinglePaintingApiRes[]>>(
    ['paintings', page],
    fetchPaintings as any,
    {
      keepPreviousData: true,
    },
  );
};

export const useGetPaintingInfinite = () => {
  return useInfiniteQuery<ApiWithPaginations<SinglePaintingApiRes[]>>(
    'paintings', // query key
    ({pageParam = 1}) => fetchPaintings(pageParam),
    {
      getNextPageParam: lastPage => {
        const {current_page, last_page} = lastPage.data.results;
        return current_page < last_page ? current_page + 1 : undefined; // return next page or undefined to stop fetching
      },
      keepPreviousData: true, // keeps data from the previous page while loading next one
    },
  );
};

export const useGetSinglePainting = (id: number) => {
  return useQuery<ApiRes<SinglePaintingApiRes[]>>({
    queryKey: ['singlePainting', id],
    queryFn: () => fetchSinglePainting(id),
  });
};
