import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { useSafeArea, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TOPNAVI_H } from '../../../utils/constants';
import { Colors } from '../../../theme';
import { Theme, useThemeContext } from '../../../contexts/ThemeContext';
import { CustomButton } from '../../utils';
import { AntDesign } from '../../../utils/common';
import { useNavigation } from '@react-navigation/native';

const TopNavigation = (props: any) => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const { height,width } = useWindowDimensions();
  const { theme , languages} = useThemeContext();
  const { title, scrollA, backBtn = false } = props;
  const BANNER_H = height * 0.4;
  const isFloating = !!scrollA;
  const [isTransparent, setTransparent] = useState(isFloating);

  console.log("w", width)

  useEffect(() => {
    if (!scrollA) {
      return;
    }
    const listenerId = scrollA.addListener((a: any) => {
      const topNaviOffset = BANNER_H - TOPNAVI_H - top - (TOPNAVI_H - top + 65);
      isTransparent !== a.value < topNaviOffset &&
        setTransparent(!isTransparent);
    });
    return () => scrollA.removeListener(listenerId);
  });

  const styles = styling(theme, top, isFloating, isTransparent);

  return (
    <>
      <StatusBar
        barStyle={isTransparent ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        {
          isTransparent ? (
            backBtn && <CustomButton
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
          ) : (
            backBtn && <CustomButton
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
          )
        }

        <Text style={[styles.title, { left: backBtn && languages === 'mm' && width < 400 ? 16 : 0, fontSize: height * 0.02 }]}>{title}</Text>
      </View>
    </>
  );
};

const styling = (
  theme: Theme,
  top: number,
  isFloating: boolean,
  isTransparent: boolean,
) =>
  StyleSheet.create({
    container: {
      paddingTop: top - 10,
      marginBottom: isFloating ? - TOPNAVI_H - top : 0,
      height: TOPNAVI_H + top,
      justifyContent: 'center',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomColor: isTransparent
        ? 'transparent'
        : Colors[theme].secondary_dark,
      borderLeftColor: isTransparent
        ? 'transparent'
        : Colors[theme].secondary_dark,
      borderRightColor: isTransparent
        ? 'transparent'
        : Colors[theme].secondary_dark,
      borderWidth: isTransparent ? 0 : 1,
      backgroundColor: isTransparent ? 'transparent' : Colors[theme].secondary,
      shadowOpacity: isTransparent ? 0 : 0.5,
      elevation: isTransparent ? 0.05 : 5,
      zIndex: 100,
    },
    btn: {

      left: 4,
      position: 'absolute',
      paddingTop: top - 10,
      zIndex: 1
    },
    title: {
      textAlign: 'center',
      fontWeight: '700',
      alignSelf: 'center',
      opacity: isTransparent ? 0.1 : 0.7,
      color: isTransparent ? 'transparent' : Colors[theme].text,
      flexWrap: 'wrap', // Ensures text wraps to the next line if necessary
      width: '87%',
    },
  });

export default TopNavigation;
