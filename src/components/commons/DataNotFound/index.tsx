import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import React from 'react';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';
import {AntDesign, Feather, getFontFamily, remToPx} from '../../../utils/common';
import {useTranslation} from 'react-i18next';

export interface DataNotFoundProps {
  customStyle: StyleProp<ViewStyle>;
  error: unknown;
}

const DataNotFound = ({customStyle, error}: DataNotFoundProps) => {
  const {height} = useWindowDimensions();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = styling(theme);
  return (
    <View style={[styles.contiainer, customStyle]}>
      {error ? (
        <Feather
          name="wifi-off"
          size={height * 0.04}
          color={Colors[theme].primary}
        />
      ) : (
        <AntDesign
          name={'frowno'}
          size={height * 0.04}
          color={Colors[theme].primary}
        />
      )}
      <Text style={[styles.text, {fontSize: height * 0.021}]}>
        {error ? t('UTILS.FETCH_FAILED') : t('UTILS.NO_DATA_AVAILABLE')}
      </Text>
    </View>
  );
};

export default DataNotFound;

const styling = (theme: Theme) =>
  StyleSheet.create({
    contiainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: Colors[theme].secondary,
      borderRadius: 20,
      gap: 20,
      shadowColor: Colors[theme].text,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    text: {
      color: Colors[theme].text,
      marginHorizontal: 10,
      marginBottom: remToPx(0.8),
      textAlign: 'center',
      fontFamily: getFontFamily('regular'),
    },
  });
