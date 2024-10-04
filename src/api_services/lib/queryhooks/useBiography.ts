import {useQuery} from 'react-query';
import {ApiRes, BiographyApiRes} from '../../../types/apiRes';
import {fetchBiography} from '../services/BiographyService';

export const useGetBiography = () => {
  return useQuery<ApiRes<BiographyApiRes>>({
    queryKey: ['biography'],
    queryFn: fetchBiography,
  });
};
