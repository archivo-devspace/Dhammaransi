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

type Props = {
  item: any;
  index: number;
  width: number;
  height: number;
  marginHorizontal: number;
  x: SharedValue<number>;
  fullWidth: number;
  handleClick: (item: any) => void;
};

const Item = ({
  item,
  index,
  width,
  height,
  marginHorizontal,
  x,
  fullWidth,
  handleClick,
}: Props) => {
  const {theme} = useThemeContext();
  const animatedStyle = useAnimatedStyle(() => {
    const customHeight = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [height - 50, height, height - 50],
      Extrapolation.CLAMP,
    );

    const marginTop = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [25, 0, 25],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [0.3, 1, 0.3], // Change opacity from 0 to 1 and back to 0
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
      <TouchableOpacity onPress={() => handleClick(item)}>
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
              height: height * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.text}>
              {item?.name?.length > 14
                ? item?.name.slice(0, 20) + ' ...'
                : item?.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Item;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors[theme].secondary_light,
      borderRadius: 20,
      overflow: 'hidden',
      transformOrigin: 'bottom',
      position: 'relative',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        },
        android: {
          elevation: 0,
        },
      }),
    },
    imageContainer: {
      flex: 0,
    },
    text: {
      color: Colors[theme].text,
      textAlign: 'center',
    },
  });
