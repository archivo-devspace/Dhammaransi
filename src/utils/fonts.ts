import {isIOS} from './platformUtil';

export const fontFamilies = {
  Walone: {
    thin: 'Z06-Walone Thin',
    regular: isIOS() ? 'Z06-Walone' : 'Z06-Walone Regular',
    bold: 'Z06-Walone Bold',
  },
  // Adjust the above code to fit your chosen fonts' names
};
