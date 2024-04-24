import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import {BANNER_H, TOPNAVI_H} from '../../../utils/constants';
import {CustomButton} from '../../utils';
import {AntDesign} from '../../../utils/common';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

interface TopNavigationProps {
  title: string;
  scrollA?: any; // Adjust type accordingly
}

const TopNavigation: React.FC<TopNavigationProps> = props => {
  const safeArea = useSafeArea();

  const {title, scrollA} = props;
  const isFloating = !!scrollA;
  const [isTransparent, setTransparent] = useState(isFloating);

  const {theme, setTheme} = useThemeContext();

  const styles = styling(theme);

  console.log('top', safeArea.top);

  useEffect(() => {
    if (!scrollA) {
      return;
    }
    const listenerId = scrollA.addListener((a: {value: number}) => {
      const topNaviOffset = BANNER_H - TOPNAVI_H - safeArea.top;
      isTransparent !== a.value < topNaviOffset &&
        setTransparent(!isTransparent);
    });
    return () => scrollA.removeListener(listenerId);
  });

  return (
    <>
      <StatusBar
        barStyle={isTransparent ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container(safeArea, isFloating, isTransparent)}>
        <Text style={styles.title(isTransparent)}>{title}</Text>
      </View>
    </>
  );
};

const styling = (theme: Theme) => {
  return StyleSheet.create({
    container: (
      safeArea: {top: number},
      isFloating: boolean,
      isTransparent: boolean,
    ) => ({
      paddingTop: safeArea.top,
      marginBottom: isFloating ? -TOPNAVI_H - safeArea.top : 0,
      height: TOPNAVI_H + safeArea.top,
      justifyContent: 'center',
      shadowOffset: {y: 0},
      backgroundColor: isTransparent ? 'transparent' : '#FFF',
      shadowOpacity: isTransparent ? 0 : 0.5,
      elevation: isTransparent ? 0.01 : 5,
      zIndex: 100,
      alignItems: 'center',
      paddingHorizontal: 10,
    }),
    title: (isTransparent: boolean) => ({
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      color: isTransparent ? '#FFF' : '#000',
    }),

    btn: {
      width: 45,
      height: 45,
      borderRadius: 10,
      backgroundColor: Colors[theme]?.primary,
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default TopNavigation;
