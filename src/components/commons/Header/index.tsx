import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
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
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const {top} = insets;
  const styles = styling(theme);

  return (
    <View
      style={{
        marginTop: top,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        width: width,
      }}>
      <CustomButton
        onPress={() => navigation.goBack()}
        icon={
          <AntDesign
            name={'arrowleft'}
            size={30}
            color={Colors[theme].primary}
          />
        }
        customButtonStyle={styles.btn}
      />

      <Text style={[styles.headerText]}>{t(title)}</Text>
    </View>
  );
};

export default Header;

const styling = (theme: Theme) =>
  StyleSheet.create({
    btn: {
      backgroundColor: Colors[theme].secondary,
      left: 20,
      position: 'absolute',
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 25,
      color: Colors[theme].text,
    },
  });
