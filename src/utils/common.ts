import axios, {AxiosError} from 'axios';

import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import FontAwesomePro from 'react-native-vector-icons/FontAwesome5Pro';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {fontFamilies} from './fonts';

export {
  FontAwesome,
  AntDesign,
  Entypo,
  Ionicons,
  Feather,
  MaterialIcon,
  MaterialIcons,
  FontAwesomePro,
  FontAwesome6,
  Fontisto,
  Zocial,
  SimpleLineIcons,
};

export const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      throw axiosError.response.data;
    } else if (axiosError.request) {
      throw new Error('No response received from the server.');
    } else {
      throw new Error('Error setting up the request.');
    }
  } else {
    throw error;
  }
};

export const remToPx = (rem: number) => {
  const baseFontSize = 16;
  return rem * baseFontSize;
};

export const truncateText = (text: string, maxLength: number) => {
  if (!text) {
    return '';
  }
  return text.length > maxLength ? text.slice(0, maxLength) + ' ...' : text;
};

export const getFontFamily = (weight: 'thin' | 'regular' | 'bold') => {
  const selectedFontFamily = fontFamilies.Walone;
  return selectedFontFamily[weight];
};
