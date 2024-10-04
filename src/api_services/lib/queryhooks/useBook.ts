import {useQuery} from 'react-query';
import {ApiRes, BookApiRes} from '../../../types/apiRes';
import {fetchBooksList} from '../services/BooksService';

export const useGetBookList = () => {
  return useQuery<ApiRes<BookApiRes[]>, Error>({
    queryKey: ['books'],
    queryFn: fetchBooksList,
    onError: (error) => {
      console.error('Error fetching books:', error.message);
    },
  });
};