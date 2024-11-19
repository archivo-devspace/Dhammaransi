/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TOPNAVI_H} from '../../../utils/constants';
import {Colors} from '../../../theme';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {CustomButton} from '../../utils';
import {AntDesign, getFontFamily} from '../../../utils/common';
import {useNavigation} from '@react-navigation/native';

const TopNavigation = (props: any) => {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const {height, width} = useWindowDimensions();
  const {theme, languages} = useThemeContext();
  const {title, scrollA, backBtn = false} = props;
  const BANNER_H = height * 0.4;
  const isFloating = !!scrollA;
  const [isTransparent, setTransparent] = useState(isFloating);

  console.log('home', isTransparent);

  useEffect(() => {
    if (!scrollA) {
      return;
    }
    const listenerId = scrollA.addListener((a: any) => {
      const topNaviOffset = BANNER_H - TOPNAVI_H - top - (TOPNAVI_H - top);
      isTransparent !== a.value < topNaviOffset &&
        setTransparent(!isTransparent);
    });
    return () => scrollA.removeListener(listenerId);
  });

  const styles = styling(theme, top, isFloating, isTransparent);

  return (
    <>
      {props.statusBar && (
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={Colors[theme].secondary}
          translucent
        />
      )}
      <View style={styles.container}>
        {isTransparent
          ? backBtn && (
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
            )
          : backBtn && (
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
            )}

        <Text
          style={[
            styles.title,
            {
              left: backBtn && languages === 'mm' && width < 400 ? 16 : 0,
              fontSize: height * 0.021,
              fontFamily: getFontFamily('bold'),
            },
          ]}>
          {title}
        </Text>
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
      paddingTop: top,
      marginBottom: -10,
      height: TOPNAVI_H + top,
      justifyContent: 'center',
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      borderBottomColor: isTransparent
        ? Colors[theme].secondary_dark
        : Colors[theme].secondary_dark,
      borderLeftColor: isTransparent
        ? Colors[theme].secondary_dark
        : Colors[theme].secondary_dark,
      borderRightColor: isTransparent
        ? Colors[theme].secondary_dark
        : Colors[theme].secondary_dark,

      backgroundColor: isTransparent
        ? Colors[theme].secondary
        : Colors[theme].secondary,
      shadowOpacity: isTransparent ? 0.5 : 0.5,
      elevation: isTransparent ? 5 : 5,
      zIndex: 100,
    },
    btn: {
      left: 4,
      position: 'absolute',
      paddingTop: top - 10,
      zIndex: 1,
    },
    title: {
      textAlign: 'center',

      alignSelf: 'center',
      color: isTransparent ? Colors[theme].text : Colors[theme].text,
      flexWrap: 'wrap', // Ensures text wraps to the next line if necessary
      width: '87%',
    },
  });

export default TopNavigation;
