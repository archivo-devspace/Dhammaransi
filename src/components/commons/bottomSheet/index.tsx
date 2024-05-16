import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';
import Animated, {
  AnimatedProps,
  AnimatedScrollViewProps,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import BackDrop from '../BackDrop';
import {CustomButton} from '../../utils';
import {AntDesign, Entypo} from '../../../utils/common';
import {useTranslation} from 'react-i18next';

interface Props extends AnimatedProps<AnimatedScrollViewProps> {
  snapTo: string;
  backGroundColor: string;
  children: ReactNode;
}

export interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

const BottomSheet = forwardRef<BottomSheetMethods, Props>(
  ({snapTo, children, backGroundColor, ...rest}: Props, ref) => {
    const {theme} = useThemeContext();
    const styles = styling(theme);

    const {height} = Dimensions.get('screen');
    const closeHeight = height;
    const percentage = parseFloat(snapTo.replace('%', '')) / 100;
    const openHeight = height - height * percentage;
    const topAnimation = useSharedValue(closeHeight);
    const context = useSharedValue(0);
    const scrollBegin = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const [enableScroll, setEnableScroll] = useState(true);
    const {t} = useTranslation();

    const expand = useCallback(() => {
      'worklet';
      topAnimation.value = withTiming(openHeight);
    }, [openHeight, topAnimation]);

    const close = useCallback(() => {
      'worklet';
      topAnimation.value = withTiming(closeHeight);
    }, [openHeight, topAnimation]);

    useImperativeHandle(
      ref,
      () => ({
        expand,
        close,
      }),
      [expand, close],
    );

    const animationStyle = useAnimatedStyle(() => {
      const top = topAnimation.value;
      return {
        top,
      };
    });

    const pan = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate(event => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(event.translationY + context.value, {
            damping: 100,
            stiffness: 400,
          });
        }
      })
      .onEnd(() => {
        if (topAnimation.value > openHeight + 50) {
          topAnimation.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    const onScroll = useAnimatedScrollHandler({
      onBeginDrag: event => {
        scrollBegin.value = event.contentOffset.y;
      },
      onScroll: event => {
        scrollY.value = event.contentOffset.y;
      },
    });

    const panScroll = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate(event => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else if (event.translationY > 0 && scrollY.value === 0) {
          runOnJS(setEnableScroll)(false);
          topAnimation.value = withSpring(
            Math.max(
              context.value + event.translationY - scrollBegin.value,
              openHeight,
            ),
            {
              damping: 100,
              stiffness: 400,
            },
          );
        }
      })
      .onEnd(() => {
        runOnJS(setEnableScroll)(true);
        if (topAnimation.value > openHeight + 100) {
          topAnimation.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    const scrollViewGesture = Gesture.Native();

    return (
      <>
        <BackDrop
          topAnimation={topAnimation}
          openHeight={openHeight}
          closeHeight={closeHeight}
          close={close}
        />
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.continer,
              animationStyle,
              {backgroundColor: backGroundColor},
            ]}>
            <View style={styles.lineContainer}>
              <Text style={styles.playlists}>{t('UTILS.PLAYLIST')}</Text>

              <CustomButton customButtonStyle={styles.icon} onPress={close}>
                <Entypo
                  name="circle-with-cross"
                  size={25}
                  color={Colors[theme].text}
                />
              </CustomButton>
            </View>
            <GestureDetector
              gesture={Gesture.Simultaneous(scrollViewGesture, panScroll)}>
              <Animated.ScrollView
                scrollEnabled={enableScroll}
                bounces={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={onScroll}>
                {children}
              </Animated.ScrollView>
            </GestureDetector>
          </Animated.View>
        </GestureDetector>
      </>
    );
  },
);

export default BottomSheet;

const styling = (theme: Theme) =>
  StyleSheet.create({
    continer: {
      ...StyleSheet.absoluteFillObject,

      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,

      zIndex: 100,
      paddingBottom: 4,
      borderColor: Colors[theme].secondary_dark,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
    },
    lineContainer: {
      justifyContent: 'center',
      paddingVertical: 14,
      flexDirection: 'row',
    },
    line: {
      borderBottomWidth: 1,
      borderColor: Colors[theme].secondary,
    },
    playlists: {
      color: Colors[theme].text,
      fontSize: 20,
      fontWeight: '500',
    },
    icon: {
      backgroundColor: Colors[theme].primary,
      alignSelf: 'center',
      borderRadius: 30,
      padding: 4,
      position: 'absolute',
      right: 16,
    },
  });
