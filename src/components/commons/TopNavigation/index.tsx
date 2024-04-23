import React, {useState, useEffect} from 'react';
import {View, Text, StatusBar, SafeAreaView, StyleSheet} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import {BANNER_H, TOPNAVI_H} from '../../../utils/constants';
import {CustomButton} from '../../utils';
import {AntDesign} from '../../../utils/common';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

const TopNavigation = (props: {title: any; scrollA: any}) => {
  const safeArea = useSafeArea();

  const {title, scrollA} = props;
  const isFloating = !!scrollA;
  const [isTransparent, setTransparent] = useState(isFloating);

  const {theme, setTheme} = useThemeContext();

  const styles = styling(theme);

  useEffect(() => {
    if (!scrollA) {
      return;
    }
    const listenerId = scrollA.addListener((a: {value: number}) => {
      const topNaviOffset = BANNER_H - TOPNAVI_H - safeArea.top - safeArea.top;
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
      <View
        style={[
          styles.container(safeArea, isFloating, isTransparent),
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          },
        ]}>
        <CustomButton
          icon={
            <AntDesign name="menu-fold" size={30} color={Colors[theme].text} />
          }
          customButtonStyle={styles.btn}
        />
        <Text style={styles.title(isTransparent)}>{title}</Text>
      </View>
    </>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: (
      safeArea: {top: number},
      isFloating: any,
      isTransparent: any,
    ) => ({
      paddingTop: safeArea.top,
      marginBottom: isFloating ? -TOPNAVI_H - safeArea.top : 0,
      height: TOPNAVI_H + safeArea.top,
      justifyContent: 'center',
      shadowOffset: {y: 0},
      backgroundColor: isTransparent ? '#0001' : '#FFF',
      shadowOpacity: isTransparent ? 0 : 0.5,
      elevation: isTransparent ? 0.01 : 5,
      zIndex: 100,
    }),
    title: (isTransparent: any) => ({
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

export default TopNavigation;
