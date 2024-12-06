import {Platform, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AntDesign} from '../../../utils/common';
import {Colors} from '../../../theme';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';

const NavigationBtn = () => {
  const {theme} = useThemeContext();

  // console.log('theme', theme);
  const styles = styling(theme);
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" translucent />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.topView}>
          <AntDesign
            size={30}
            name="menu-fold"
            color={Colors[theme]?.primary}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default NavigationBtn;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary_light,
    },
    safeAreaView: {
      marginBottom: Platform.OS === 'ios' ? 8 : 12,
    },
    topView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    text: {},
    contentConainer: {
      flex: 1,
    },
    bannerContainer: {
      flex: 1,
    },
    moviesContainer: {
      flex: 1,
    },
    audiosContainer: {},
  });
