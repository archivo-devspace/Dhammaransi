import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

const {width: windowWidth} = Dimensions.get('window');

interface SkeletonViewProps {
  width: number;
  height: number;
  borderRadius?: number;
}

const SkeletonView: React.FC<SkeletonViewProps> = ({
  width,
  height,
  borderRadius = 4,
}) => {
  const {theme} = useThemeContext();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShimmer = () => {
      shimmerAnim.setValue(0);
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ).start();
    };

    startShimmer();
  }, [shimmerAnim]);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-windowWidth, windowWidth],
  });

  const styles = styling(theme);

  return (
    <View style={[styles.skeletonContainer, {width, height, borderRadius}]}>
      <Animated.View
        style={[styles.shimmer, {transform: [{translateX: shimmerTranslateX}]}]}
      />
    </View>
  );
};

export default SkeletonView;

const styling = (theme: Theme) =>
  StyleSheet.create({
    skeletonContainer: {
      backgroundColor: Colors[theme].text,
      opacity: 0.4,
      overflow: 'hidden',
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: Colors[theme].secondary, // Lighter color for shimmer effect
      opacity: 0.4,
    },
  });
