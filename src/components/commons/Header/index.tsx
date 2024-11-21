import { StyleSheet, Text, useWindowDimensions, Vibration, View } from 'react-native';
import React from 'react';
import { Theme, useThemeContext } from '../../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomButton } from '../../utils';
import { AntDesign, getFontFamily } from '../../../utils/common';
import { Colors } from '../../../theme';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  backArrow?:boolean;
}

const Header = ({ title,backArrow=true }: HeaderProps) => {
  const { theme } = useThemeContext();
  const { height } = useWindowDimensions();

  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { top } = insets;
  const styles = styling(theme);
  const customMarginTop = top + 10;

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
      {backArrow && <CustomButton
        onPress={() => {Vibration.vibrate(5);navigation.goBack()}}
        icon={
          <AntDesign
            name={'left'}
            size={26}
            color={Colors[theme].primary}
          />
        }
        gap={5}
        customButtonStyle={styles.btn}
      />}

      <Text style={[styles.headerText, {
        fontSize: height * 0.026,  fontFamily: getFontFamily('regular'),
      }]}>{t(title)}</Text>
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
      color: Colors[theme].text,
    }
  });
