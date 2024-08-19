import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React from 'react';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CustomButton} from '../../utils';
import {AntDesign} from '../../../utils/common';
import {Colors} from '../../../theme';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

interface HeaderProps {
  title: string;
}

const Header = ({title}: HeaderProps) => {
  const {theme} = useThemeContext();
  const {height} = useWindowDimensions();

  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {top} = insets;
  const styles = styling(theme);
  const customMarginTop = top ;

  return (
    <View
      style={{
        marginTop: customMarginTop,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        height: height * 0.047,

      }}>
      <CustomButton
        onPress={() => navigation.goBack()}
        icon={
          <AntDesign
            name={'arrowleft'}
            size={height * 0.04}
            color={Colors[theme].primary}
          />
        }
        gap={5}
        customButtonStyle={styles.btn}
      />

      <Text style={[styles.headerText, {fontSize: height * 0.025}]}>{t(title)}</Text>
    </View>
  );
};

export default Header;

const styling = (theme: Theme) =>
  StyleSheet.create({
    btn: {
      backgroundColor: Colors[theme].secondary,
      left: 16,
      position: 'absolute',
    },
    headerText: {
      fontWeight: 'bold',
      color: Colors[theme].text,
    }
  });
