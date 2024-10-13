import {useQuery} from 'react-query';
import {ApiRes, HomeScreenApiRes} from '../../../types/apiRes';
import {fetchHomeScreenData} from '../services/HomeService';

export const useGetHomeData = () => {
  return useQuery<ApiRes<HomeScreenApiRes>>({
    queryKey: ['homeData'],
    queryFn: fetchHomeScreenData,
  });
};
