import {useQuery} from 'react-query';
import {fetchAlbumLists} from '../services/AudioService';
import {Album, ApiRes, ApiWithPaginations, BookApiRes} from '../../../types/apiRes';
import { fetchBooksList } from '../services/BooksService';

export const useGetBookList = () => {
  return useQuery<ApiRes<BookApiRes[]>>({
    queryKey: ['books'],
    queryFn: fetchBooksList,
  });
};
