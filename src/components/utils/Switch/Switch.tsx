import {View, Text, StyleSheet, Pressable, Animated} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../../theme';
import {useThemeContext} from '../../../contexts/ThemeContext';

type Props = {
  value: boolean;
  handleSwitch: () => void;
};

const Switch = (props: Props) => {
  const {theme} = useThemeContext();
  const {value, handleSwitch} = props;
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    // Update the animated value when the value prop changes
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 300, // Adjust the animation duration
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 28], // Adjust the distance of the switch head
  });

  const defaultStyles = {
    bgGradientColors: [Colors[theme]?.primary, Colors[theme]?.secondary_dark],
    headGradientColors: [
      Colors[theme]?.primary,
      Colors[theme]?.secondary_light,
    ],
  };

  const activeStyles = {
    bgGradientColors: [Colors[theme]?.primary, Colors[theme]?.secondary_dark],
    headGradientColors: [
      Colors[theme]?.secondary_dark,
      Colors[theme]?.secondary_light,
    ],
  };
  const currentStyles = value ? activeStyles : defaultStyles;

  return (
    <Pressable onPress={handleSwitch} style={styles.pressable}>
      <LinearGradient
        colors={currentStyles.bgGradientColors}
        style={styles.backgroundGradient}
        start={{
          x: 0,
          y: 0.5,
        }}>
        <View style={styles.innerContainer}>
          <Animated.View
            style={{
              transform: [{translateX}],
            }}>
            <LinearGradient
              colors={currentStyles.headGradientColors}
              style={styles.headGradient}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: 56,
    height: 32,
    borderRadius: 16,
  },
  backgroundGradient: {
    borderRadius: 16,
    flex: 1,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  headGradient: {
    width: 24,
    height: 24,
    borderRadius: 100,
  },
});

export default Switch;
