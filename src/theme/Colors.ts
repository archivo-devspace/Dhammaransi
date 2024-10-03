const commonColor = {
  success: '#00C88C',
  warnning: '#ff9966',
  danger: '#C8001A',
  black: '#000'
};

const light = {
  primary: '#deab0d',
  primary_light: '#e3b627',
  primary_dark: '#916d09',
  secondary: '#E0E0E0',
  secondary_light: '#f7f7f7',
 secondary_dark: '#BDBDBD',
  text: '#272727',
  ...commonColor
};

const dark = {
  primary: '#ffbb32',
  primary_light: '#deab0d',
  primary_dark: '#5c4405',
  secondary: '#242526',
  secondary_light: '#3a3b3c',
  secondary_dark: '#18191a',
  text: '#ffffff',
  ...commonColor
};

export default {light, dark};
