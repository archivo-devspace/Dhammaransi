const commonColor = {
  success: '#00C88C',
  warnning: '#8000C8',
  danger: '#C8001A',
};

const light = {
  primary: '#FFD700',
  primary_light: '#FFE333',
  primary_dark: '#B3A125',
  secondary: '#E0E0E0',
  secondary_light: '#F5F5F5',
 secondary_dark: '#BDBDBD',
  text: 'black',
  ...commonColor
};

const dark = {
  primary: '#C89E00',
  primary_light: '#C8AB00',
  primary_dark: '#8F7000',
  secondary: '#1a202c',
  secondary_light: '#39424f',
  secondary_dark: '#0d1117',
  text: '#FFFFFF',
  ...commonColor
};

export default {light, dark};
