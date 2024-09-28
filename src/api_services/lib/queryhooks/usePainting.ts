import {useQuery} from 'react-query';
import {fetchPaintings, fetchSinglePainting} from '../Paginations';
import {
  ApiRes,
  ApiWithPaginations,
  PaintingApiRes,
  SinglePaintingApiRes,
} from '../../../types/apiRes';

export const useGetPaintings = () => {
  return useQuery<ApiWithPaginations<PaintingApiRes[]>>({
    queryKey: ['paintings'],
    queryFn: fetchPaintings,
  });
};

export const useGetSinglePainting = (id: string) => {
  return useQuery<ApiRes<SinglePaintingApiRes[]>>({
    queryKey: ['singlePainting', id],
    queryFn: () => fetchSinglePainting(id),
  });
};
