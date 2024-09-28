import {useQuery} from 'react-query';
import {fetchPaintings} from '../Paginations';
import {ApiWithPaginations, PaintingApiRes} from '../../../types/apiRes';

export const useGetPaintings = () => {
  return useQuery<ApiWithPaginations<PaintingApiRes[]>>({
    queryKey: ['paintings'],
    queryFn: fetchPaintings,
  });
};
