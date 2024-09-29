// // CustomTabBar.js

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {FontAwesome} from '../../../utils/common';
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
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 1 : 0.65}]}>
      <Animated.View
        style={[
          styles.btn,
          viewStyle,
          {
            backgroundColor: focused
              ? Colors[theme].secondary_dark
              : 'transparent',
            paddingVertical: focused ? 10 : 0,
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
                color: Colors[theme].text,
                fontWeight: '500',
                fontSize: height * 0.018,
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
      alignItems: 'center',
      height: 75,
      width: '100%',
    },
    btn: {
      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: 14,
      borderRadius: 20,
      gap: 8,
    },
  });
