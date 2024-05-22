import {View, Easing, Animated, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef} from 'react';
import Svg, {G, Circle, Text} from 'react-native-svg';
import {useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

interface Props {
  percentage: string;
  centerText: string;

  fourthText?: string;
  customStyle?: any;
  circularSize?: number;
  fillColor?: string;
  strokeColor?: string;
  progressColor?: string;
  strokeWidthValue?: number;
}

const CircularProgressBar = ({
  percentage,
  centerText,
  fourthText,
  customStyle,
  circularSize = 55,
  strokeColor = '#B0B0B9',
  progressColor,
  strokeWidthValue = 4,
}: Props) => {
  const size = circularSize;
  const strokeWidth = strokeWidthValue;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef({setNativeProps: ({}) => {}});
  const {theme} = useThemeContext();

  useLayoutEffect(() => {
    const animation = (toValue: any) => {
      return Animated.timing(progressAnimation, {
        toValue,
        duration: 0,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    };
    animation(percentage);
  }, [progressAnimation, percentage]);

  useLayoutEffect(() => {
    progressAnimation.addListener(value => {
      const strokeDashoffset =
        circumference - (circumference * value.value) / 100;
      if (progressRef && progressRef?.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
  }, [progressAnimation, circumference, percentage]);
  return (
    <SafeAreaView style={styles.loaderContainer}>
      <View style={styles.loaderView}>
        <Svg width={size} height={size}>
          {centerText?.length !== 0 && (
            <Text
              fontSize={14}
              fill={'#FFFFFF'}
              letterSpacing={1.68}
              x={size / 2}
              y={
                !fourthText
                  ? customStyle
                    ? size / 1.8 - 20
                    : size / 1.8
                  : customStyle
                  ? size / 1.8 - 40
                  : size / 1.8 - 43
              }
              textAnchor="middle">
              {centerText}
            </Text>
          )}

          <G rotation="-90" origin={center}>
            <Circle
              stroke={strokeColor}
              fill="transparent"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <Circle
              stroke={progressColor}
              ref={progressRef as any}
              fill="transparent"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
            />
          </G>
        </Svg>
      </View>
    </SafeAreaView>
  );
};

export default CircularProgressBar;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 20,
  },
});
