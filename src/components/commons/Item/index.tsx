/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {Colors} from '../../../theme';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {truncateText} from '../../../utils/common';
import SkeletonView from '../Skeleton';

type Props = {
  item: any;
  index: number;
  width: number;
  height: number;
  marginHorizontal: number;
  x: SharedValue<number>;
  fullWidth: number;
  truncateIndex: number;
  handleClick: (id: number) => void;
  isLoading?: boolean;
};

const Item = ({
  item,
  index,
  width,
  height,
  marginHorizontal,
  x,
  fullWidth,
  truncateIndex,
  handleClick,
  isLoading,
}: Props) => {
  const {theme} = useThemeContext();
  const animatedStyle = useAnimatedStyle(() => {
    const customHeight = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [height - 40, height, height - 40],
      Extrapolation.CLAMP,
    );

    const marginTop = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [16, 0, 16],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [1, 1, 1], // Change opacity from 0 to 1 and back to 0
      Extrapolation.CLAMP,
    );

    return {
      // transform: [{rotateZ: `${rotateZ}deg`}, {translateY: translateY}],
      opacity: opacity,
      height: customHeight,
      marginVertical: marginTop,
    };
  });

  const styles = styling(theme);

  return (
    <Animated.View
      style={[
        styles.container,
        {width: width, height: height, marginHorizontal: marginHorizontal},
        animatedStyle,
      ]}>
      {isLoading ? (
        <View style={styles.imageContainer}>
          <SkeletonView width={width} height={height * 0.8} borderRadius={20} />
          <View
            style={{
              height: height * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={[styles.text, {fontSize: height * 0.07}]}>
              Loading ...
            </Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={() => handleClick(item.id)}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../../assets/marguerite.jpg')}
              style={{
                width: width,
                height: height * 0.8,
                // borderBottomLeftRadius: 20,
                // borderBottomRightRadius: 20,
              }}
              resizeMode="cover"
            />
            <View
              style={{
                width: '100%',
                paddingHorizontal: 4,
                height: height * 0.2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.text, {fontSize: height * 0.09}]}>
                {truncateText(item?.description, truncateIndex)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default Item;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors[theme].secondary_light,
      borderRadius: 15,
      overflow: 'hidden',
      transformOrigin: 'bottom',
      position: 'relative',
    },
    imageContainer: {
      flex: 1,
      ...Platform.select({
        ios: {
          shadowColor: Colors[theme].text,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 7,
        },
      }),
    },
    text: {
      color: Colors[theme].text,
      textAlign: 'center',
      fontWeight: '500',
    },
  });
