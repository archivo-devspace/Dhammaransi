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
  primary: '#8F7000',
  primary_light: '#C09900',
  primary_dark: '#2E2500',
  secondary: '#242526',
  secondary_light: '#3a3b3c',
  secondary_dark: '#18191a',
  text: '#9b9c9e',
  ...commonColor
};

export default {light, dark};
