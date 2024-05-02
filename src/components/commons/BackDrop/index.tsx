import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {Colors} from '../../../theme';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';

type Props = {
  topAnimation: SharedValue<number>;
  openHeight: number;
  closeHeight: number;
  close: () => void;
};

const BackDrop = ({topAnimation, openHeight, closeHeight, close}: Props) => {
  const {theme} = useThemeContext();
  const styles = styling(theme);

  const backDropAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(
      topAnimation.value,
      [closeHeight, openHeight],
      [0, 0.5],
    );

    const display = opacity === 0 ? 'none' : 'flex';
    return {
      opacity,
      display,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        close();
      }}>
      <Animated.View style={[styles.container, backDropAnimation]}>
        <StatusBar backgroundColor={'transparent'} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default BackDrop;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'black',
      display: 'none',
    },
  });
