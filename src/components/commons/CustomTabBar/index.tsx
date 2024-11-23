/* eslint-disable react-native/no-inline-styles */
// // CustomTabBar.js

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Vibration,
} from 'react-native';
import React from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {FontAwesome, getFontFamily} from '../../../utils/common';
import {TabBar} from '../../../navigations/BottomNavigation';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

interface CustomTabBarProps {
  rest: any;
  item: TabBar;
}

const CustomTabBar = ({rest, item}: CustomTabBarProps) => {
  const {onPress, accessibilityState} = rest;
  const focused = accessibilityState.selected;
  const {height} = useWindowDimensions();

  const {theme} = useThemeContext();
  const styles = styling(theme);

  const handlePress = () => {
    Vibration.vibrate(5);
    onPress();
  }

  const viewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(focused ? 1 : 0.5, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(focused ? 1 : 0, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 1 : 1}]}>
      <Animated.View
        style={[
          styles.btn,
          viewStyle,
          {
            // backgroundColor: focused
            //   ? Colors[theme].secondary_dark
            //   : 'transparent',
            // paddingVertical: focused ? 10 : 0,
          },
        ]}>
        <FontAwesome
          name={item.icon}
          size={focused ? height * 0.025 : height * 0.05}
          color={focused ? Colors[theme].primary : 'gray'}
        />

        <Animated.View style={textStyle}>
          {focused && (
            <Text
              style={{
                color: Colors[theme].primary,
                fontFamily: getFontFamily('bold'),
                fontSize: height * 0.019,
              }}>
              {item.label}
            </Text>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default CustomTabBar;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      height: 'auto',
      width: '100%',
      alignSelf:'center',
    
    },
    btn: {
      marginVertical: 6,
      alignItems:'center',
      justifyContent:'center',
      borderRadius: 20,
      gap: 2,
      paddingTop: 8,
      paddingBottom: 4
    },
  });
