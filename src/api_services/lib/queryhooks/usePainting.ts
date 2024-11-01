import {useQuery} from 'react-query';
import {fetchPaintings, fetchSinglePainting} from '../services/PaintingService';
import {
  ApiRes,
  ApiWithPaginations,
  PaintingApiRes,
  SinglePaintingApiRes,
} from '../../../types/apiRes';

export const useGetPaintings = () => {
  return useQuery<ApiWithPaginations<SinglePaintingApiRes[]>>({
    queryKey: ['paintings'],
    queryFn: fetchPaintings,
  });
};

export const useGetSinglePainting = (id: number) => {
  return useQuery<ApiRes<SinglePaintingApiRes[]>>({
    queryKey: ['singlePainting', id],
    queryFn: () => fetchSinglePainting(id),
  });
};
