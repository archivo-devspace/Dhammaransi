import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import {useSafeArea, useSafeAreaInsets} from 'react-native-safe-area-context';
import {TOPNAVI_H} from '../../../utils/constants';
import {Colors} from '../../../theme';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';

const TopNavigation = (props: any) => {
  const {top} = useSafeAreaInsets();
  const {height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const {title, scrollA} = props;
  const BANNER_H = height * 0.4;
  const isFloating = !!scrollA;
  const [isTransparent, setTransparent] = useState(isFloating);

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
        <Text style={styles.title}>{title}</Text>
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
      paddingTop: top - 6,
      marginBottom: isFloating ? -TOPNAVI_H - top : 0,
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
    title: {
      textAlign: 'center',
      fontWeight: '600',
      fontVariant: ['small-caps'],
      paddingTop: 5,
      fontSize: 18,
      paddingHorizontal: 20,
      lineHeight: 22,
      opacity: isTransparent ? 0.1 : 0.7,
      color: isTransparent ? 'transparent' : Colors[theme].text,
    },
  });

export default TopNavigation;
