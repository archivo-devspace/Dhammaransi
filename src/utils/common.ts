import axios, { AxiosError } from "axios";


import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';


export {FontAwesome,AntDesign,Entypo}

export const handleAxiosError = (error:any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data
    } else if (axiosError.request) {
      throw new Error('No response received from the server.');
    } else {
      throw new Error('Error setting up the request.');
    }
  } else {
    throw error;
  }
}