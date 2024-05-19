import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, ColorValue, Animated, Easing} from 'react-native';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

interface Props {
  durationMs?: number;
}

const startRotationAnimation = (
  durationMs: number,
  rotationDegree: Animated.Value,
): void => {
  Animated.loop(
    Animated.timing(rotationDegree, {
      toValue: 1,
      duration: durationMs,
      easing: Easing.sin,
      useNativeDriver: true,
    }),
  ).start();
};

const LoadingSpinner = ({durationMs = 1000}: Props): JSX.Element => {
  const rotationDegree = useRef(new Animated.Value(0)).current;

  const {theme} = useThemeContext();

  const styles = styling(theme);

  useEffect(() => {
    startRotationAnimation(durationMs, rotationDegree);
  }, [durationMs, rotationDegree]);

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <Animated.View style={[styles.background]} />
      <Animated.View
        style={[
          styles.progress,
          {
            borderTopColor: Colors[theme].primary_dark,

            borderBottomColor: Colors[theme].primary_dark,
          },
          {
            transform: [
              {
                rotateZ: rotationDegree.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const height = 45;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: height,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },
    background: {
      width: '100%',
      height: '100%',
      borderRadius: height / 2,
      borderWidth: 4,
      opacity: 0.5,
      borderColor: Colors[theme].primary,
    },
    progress: {
      width: '100%',
      height: '100%',
      borderRadius: height / 2,
      borderLeftColor: Colors[theme].primary_light,
      borderRightColor: Colors[theme].primary_light,
      borderWidth: 4,
      position: 'absolute',
    },
  });

export default LoadingSpinner;
