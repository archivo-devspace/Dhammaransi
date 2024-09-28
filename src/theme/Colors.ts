const commonColor = {
  success: '#00C88C',
  warnning: '#8000C8',
  danger: '#C8001A',
  black: '#000'
};

const light = {
  primary: '#deab0d',
  primary_light: '#e3b627',
  primary_dark: '#916d09',
  secondary: '#E0E0E0',
  secondary_light: '#F5F5F5',
 secondary_dark: '#BDBDBD',
  text: '#272727',
  ...commonColor
};

const dark = {
  primary: '#deab0d',
  primary_light: '#deab0d',
  primary_dark: '#5c4405',
  secondary: '#242526',
  secondary_light: '#3a3b3c',
  secondary_dark: '#18191a',
  text: '#9b9c9e',
  ...commonColor
};

export default {light, dark};
