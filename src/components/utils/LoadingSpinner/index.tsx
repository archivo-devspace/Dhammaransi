import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  ColorValue,
  Animated,
  Easing,
  Text,
} from 'react-native';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

interface Props {
  durationMs: number;
  loaderSize: number;
  loadingText: string;
  loadingTextColor: string;
  loadingTextSize: number;
  bgColor: string;
  color: string;
}

const startRotationAnimation = (
  durationMs: number,
  rotationDegree: Animated.Value,
): void => {
  Animated.loop(
    Animated.timing(rotationDegree, {
      toValue: 1,
      duration: durationMs,
      easing: Easing.bounce,
      useNativeDriver: true,
    }),
  ).start();
};

const startPulseAnimation = (
  durationMs: number,
  pulseScale: Animated.Value,
): void => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseScale, {
        toValue: 1.3,
        duration: durationMs,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulseScale, {
        toValue: 0.5,
        duration: durationMs,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]),
  ).start();
};

const LoadingSpinner = ({
  durationMs,
  loaderSize,
  bgColor,
  color,
  loadingText,
  loadingTextColor,
  loadingTextSize,
}: Props): JSX.Element => {
  const rotationDegree = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(0.5)).current;

  const {theme} = useThemeContext();

  const styles = styling(theme, loaderSize);

  useEffect(() => {
    startRotationAnimation(durationMs, rotationDegree);
    startPulseAnimation(durationMs, pulseScale);
  }, [durationMs, rotationDegree, pulseScale]);

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <Animated.View style={[styles.background, {borderColor: bgColor}]}>
        <Animated.View style={[{transform: [{scale: pulseScale}]}]}>
          <Text
            style={{
              alignSelf: 'center',
              color: loadingTextColor,
              fontSize: loadingTextSize,
              fontWeight: 'bold',
            }}>
            {loadingText}
          </Text>
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={[
          styles.progress,
          {
            borderTopColor: color,
            borderBottomColor: color,
            borderLeftColor: bgColor,
            borderRightColor: bgColor,
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

const styling = (theme: Theme, loaderSize: number) =>
  StyleSheet.create({
    container: {
      width: loaderSize,
      height: loaderSize,
      justifyContent: 'center',
      alignItems: 'center',
    },
    background: {
      width: '100%',
      height: '100%',
      borderRadius: loaderSize / 2,
      justifyContent: 'center',
      alignContent: 'center',
      borderWidth: 4,
      opacity: 1,
    },
    progress: {
      width: '100%',
      height: '100%',
      borderRadius: loaderSize / 2,

      borderWidth: 4,
      position: 'absolute',
    },
  });

export default LoadingSpinner;
