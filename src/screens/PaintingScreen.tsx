import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  StatusBar,
  ScrollView,
  Platform,
  Vibration,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {useTranslation} from 'react-i18next';
import StackNavigation, {
  MainStackParamList,
  NavigationMainStackScreenProps,
} from '../navigations/StackNavigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  RouteProp,
  StackActions,
  StackRouter,
  useNavigation,
} from '@react-navigation/native';
import {Colors} from '../theme';
import TopNavigation from '../components/commons/TopNavigation';
import Slider from '@react-native-community/slider';
import {AntDesign, Entypo, getFontFamily, MaterialIcons} from '../utils/common';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import {CustomButton} from '../components/utils';
import {useTrackContext} from '../contexts/TrackContext';
import {useGetSinglePainting} from '../api_services/lib/queryhooks/usePainting';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import SkeletonView from '../components/commons/Skeleton';

interface SkeletonConfig {
  height: number;
  widthRatio: number;
  borderRadious: number;
}

interface SkeletonGroupProps {
  gap: number;
  config: SkeletonConfig[];
}

export interface PaintingScreenProps {
  route: RouteProp<MainStackParamList, 'PaintingScreen'>;
  navigation: NavigationMainStackScreenProps['navigation'];
}

const PaintingScreen = ({route}: PaintingScreenProps) => {
  const {theme} = useThemeContext();
  const playbackState = usePlaybackState();
  const styles = styling(theme);
  const {width, height} = useWindowDimensions();
  const progress = useProgress();
  const navigation = useNavigation();

  const {
    handlePlay,
    trackLists,
    setTrackLists,
    togglePlayingMode,
    getTrackDuration,
  } = useTrackContext();

  const {data, isLoading, isFetched, isError} = useGetSinglePainting(
    route.params.id,
  );

  const paintingDetails = data?.data?.results[0];

  const sameTrackExit = () => {
    const sameTrack = trackLists.find(
      track => track.id === paintingDetails?.id,
    );

    return sameTrack ? true : false;
  };

  const initializeTrack = () => {
    const track = {
      id: paintingDetails?.id as number,
      url: paintingDetails?.details[1]?.file as string,
      title: paintingDetails?.title ? (paintingDetails?.title as string) : '',
      artwork: paintingDetails?.details[0].file,
      artist: paintingDetails?.artist
        ? (paintingDetails?.artist as string)
        : '',
      date: paintingDetails?.created_at.split(' ')[0] as string,
    };
    setTrackLists([track]);
  };

  useEffect(() => {
    if (!isLoading && isFetched && !isError && data) {
      const sameTrack = sameTrackExit();

      if (!sameTrack) {
        TrackPlayer.reset();
        initializeTrack();
      }
    }
  }, [isFetched, data, isLoading, isError]);

  const handlePlayTrack = () => {
    const sameTrack = sameTrackExit();
    if (sameTrack && progress.position === 0) {
      handlePlay(paintingDetails?.id as number);
    }
    togglePlayingMode();
  };

  const IMG_HEIGHT = height * 0.39;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOfset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOfset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOfset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const display = interpolate(
      scrollOfset.value > IMG_HEIGHT ? scrollOfset.value : 0,
      [0, IMG_HEIGHT],
      [0, 1],
    );

    return {
      display: display === 0 ? 'none' : 'flex',
    };
  });

  const generateSkeletonViews = (config: SkeletonConfig[]): JSX.Element[] => {
    return config.map(({height, widthRatio, borderRadious}, index) => (
      <SkeletonView
        key={index}
        height={height}
        width={width * widthRatio}
        borderRadius={borderRadious}
      />
    ));
  };

  const SkeletonGroup: React.FC<SkeletonGroupProps> = ({gap, config}) => {
    return (
      <View style={[styles.group, {gap}]}>{generateSkeletonViews(config)}</View>
    );
  };

  const LoadingSkeleton = () => {
    const commonConfig: SkeletonConfig[] = [
      {height: 10, widthRatio: 0.9, borderRadious: 6},
      {height: 10, widthRatio: 0.8, borderRadious: 6},
      {height: 10, widthRatio: 0.7, borderRadious: 6},
      {height: 10, widthRatio: 0.6, borderRadious: 6},
    ];

    const autoConfig: SkeletonConfig[] = Array(16).fill({
      height: 8,
      widthRatio: 0.9,
      borderRadious: 6,
    });

    return (
      <View style={styles.skeletonContainer}>
        <SkeletonGroup
          gap={7}
          config={[
            ...commonConfig,
            ...commonConfig,
            ...commonConfig,
            ...commonConfig,
            ...commonConfig,
          ]}
        />
        <SkeletonGroup gap={6} config={autoConfig.slice(0, 8)} />
        <SkeletonGroup gap={6} config={autoConfig.slice(0, 6)} />
        <SkeletonGroup gap={6} config={autoConfig} />
        <SkeletonGroup gap={6} config={autoConfig.slice(0, 10)} />
      </View>
    );
  };

  const formattedDescription = paintingDetails?.description
    ?.replace(/<\/p>/gi, '\n\n') // Replace closing </p> with two newlines
    ?.replace(/<p[^>]*>/gi, '') // Remove opening <p> tags
    ?.replace(/<br\s*\/?>/gi, '\n') // Replace <br> with newline
    ?.replace(/&nbsp;/g, ' ') // Replace &nbsp; with a space
    ?.replace(/<\/?[^>]+(>|$)/g, ''); // Remove any remaining HTML tags

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle={'default'} />
      <Animated.View
        style={[headerAnimatedStyle, styles.header, {width: width}]}>
        <CustomButton
          onPress={() => {
            Vibration.vibrate(5);
            navigation.goBack();
          }}
          icon={
            <AntDesign name={'left'} size={26} color={Colors[theme].primary} />
          }
          gap={5}
          customButtonStyle={[styles.btnArrow]}
        />
        {isLoading ? (
          <View style={[styles.paintingTitle, {alignSelf: 'center'}]}>
            <SkeletonView
              height={height * 0.028}
              width={width * 0.6}
              borderRadius={20}
            />
          </View>
        ) : (
          <Text
            style={[
              styles.paintingTitle,
              {fontSize: height * 0.028, paddingHorizontal: 50},
            ]}>
            {paintingDetails?.title}
          </Text>
        )}
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <SkeletonView width={width} height={height * 0.4} borderRadius={8} />
        ) : (
          <Animated.Image
            source={{uri: paintingDetails?.details[0].file}}
            style={[
              {
                width: width,
                height: height * 0.4,
                resizeMode: 'stretch',
                borderRadius: 8,
              },
              imageAnimatedStyle,
            ]}
          />
        )}

        <View
          style={{
            backgroundColor: Colors[theme]?.secondary,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            paddingBottom: 10,
            gap: 10,
          }}>
          <View style={{alignItems: 'center', gap: 10}}>
            {isLoading ? (
              <View style={styles.paintingTitle}>
                <SkeletonView
                  height={height * 0.028}
                  width={width * 0.8}
                  borderRadius={20}
                />
              </View>
            ) : (
              <Text style={[styles.paintingTitle, {fontSize: height * 0.028}]}>
                {paintingDetails?.title}
              </Text>
            )}
            <View
              style={{
                width: width * 0.8,
                borderColor: Colors[theme]?.text,
                borderBottomWidth: 1,
                marginBottom: 20,
              }}
            />
            {/* Music  */}
            {isLoading ? (
              <SkeletonView
                width={width * 0.95}
                height={150}
                borderRadius={20}
              />
            ) : (
              <View style={[{width: width * 0.95}, styles.musicContainer]}>
                <Slider
                  value={progress.position}
                  minimumValue={0}
                  maximumValue={progress.duration}
                  thumbTintColor={Colors[theme].primary}
                  onSlidingComplete={async value => {
                    await TrackPlayer.seekTo(value);
                    await TrackPlayer.play();
                  }}
                  minimumTrackTintColor={Colors[theme].primary}
                  maximumTrackTintColor={Colors[theme].text}
                />
                <View style={styles.trackDuration}>
                  <Text style={styles.durationText}>
                    {new Date(progress.position * 1000)
                      .toISOString()
                      .substr(14, 5)}
                  </Text>
                  <Text style={styles.durationText}>
                    {getTrackDuration(progress)}
                  </Text>
                </View>
                <CustomButton
                  customButtonStyle={styles.btn}
                  onPress={handlePlayTrack}
                  icon={
                    playbackState.state === State.Playing ? (
                      <MaterialIcons
                        name={'pause-circle'}
                        size={height * 0.06}
                        style={{elevation: 2}}
                        color={Colors[theme].primary}
                      />
                    ) : playbackState.state === State.Paused ? (
                      <MaterialIcons
                        name={'play-circle'}
                        size={height * 0.06}
                        style={{elevation: 2}}
                        color={Colors[theme].primary}
                      />
                    ) : playbackState.state === State.Ready ||
                      playbackState.state === State.Buffering ? (
                      <LoadingSpinner
                        durationMs={1500}
                        bgColor={Colors[theme].secondary_dark}
                        color={Colors[theme].primary}
                        loaderSize={height * 0.06}
                        loadingText="connecting"
                        loadingTextColor={Colors[theme].primary}
                        loadingTextSize={6}
                      />
                    ) : (
                      <Entypo
                        name={'controller-stop'}
                        size={height * 0.06}
                        style={{elevation: 2}}
                        color={Colors[theme].primary}
                      />
                    )
                  }
                />
              </View>
            )}
            {/* Description */}
            <View
              style={{
                width,
                padding: 20,
                paddingBottom: 20,
              }}>
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <Text
                  style={{
                    textAlign: 'left',
                    letterSpacing: 3,
                    fontSize: height * 0.023,
                    color: Colors[theme]?.text,
                    fontFamily: getFontFamily('regular'),
                  }}>
                  {formattedDescription}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    paintingTitle: {
      paddingTop: 20,
      paddingHorizontal: 10,
      textAlign: 'center',
      color: Colors[theme]?.text,
      fontFamily: getFontFamily('regular'),
    },
    musicContainer: {
      padding: 20,
      borderColor: Colors[theme]?.primary,
      borderWidth: 1,
      borderRadius: 30,
    },
    trackDuration: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: '4%',
    },
    durationText: {
      color: Colors[theme].primary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    btn: {
      backgroundColor: 'transparent',
      alignSelf: 'center',
    },
    btnArrow: {
      left: 16,
      position: 'absolute',
      zIndex: 1,
      ...Platform.select({
        ios: {
          paddingTop: 60,
        },
        android: {
          paddingTop: 50,
        },
      }),
    },

    container: {
      flex: 1,
      backgroundColor: Colors[theme].secondary,
    },
    header: {
      ...Platform.select({
        ios: {
          paddingTop: 40,
        },
        android: {
          paddingTop: 30,
        },
      }),
      backgroundColor: Colors[theme].secondary,
      zIndex: 1,
      position: 'absolute',
      top: 0,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      borderColor: Colors[theme].secondary_dark,
      borderWidth: 1,
      paddingBottom: 10,
    },
    skeletonContainer: {
      padding: 30,
      flex: 1,
      gap: 35,
    },
    group: {
      alignItems: 'center',
    },
  });

export default PaintingScreen;
