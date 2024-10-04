import axiosInstance from '../AxiosInstance';

export const fetchBooksList = async () => {
  try{
    const res = await axiosInstance.get('/books');
  return res.data;
  }catch(error:any){
    if (error.response) {
      throw new Error(error.message); // Propagate error for react-query or direct handling
    } else {
      throw new Error('Network error. Please check your connection.');
    }
  }
};
