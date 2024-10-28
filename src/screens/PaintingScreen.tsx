import {
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {useTranslation} from 'react-i18next';
import {
  MainStackParamList,
  NavigationMainStackScreenProps,
} from '../navigations/StackNavigation';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import TopNavigation from '../components/commons/TopNavigation';
import Slider from '@react-native-community/slider';
import {Entypo, MaterialIcons} from '../utils/common';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import {CustomButton} from '../components/utils';
import {useTrackContext} from '../contexts/TrackContext';
// import {singlePaintingDetils} from '../utils/constants';
import {useGetSinglePainting} from '../api_services/lib/queryhooks/usePainting';

export interface PaintingScreenProps {
  route: RouteProp<MainStackParamList, 'PaintingScreen'>;
  navigation: NavigationMainStackScreenProps['navigation'];
}

const PaintingScreen = ({route, navigation}: PaintingScreenProps) => {
  const {theme} = useThemeContext();
  const playbackState = usePlaybackState();
  const styles = styling(theme);
  const {t} = useTranslation();
  const {width, height} = useWindowDimensions();
  const progress = useProgress();
  const {
    handlePlay,
    trackLists,
    setTrackLists,
    togglePlayingMode,
    getTrackDuration,
  } = useTrackContext();
  const scrollA = useRef(new Animated.Value(0)).current;

  const customHeight = height * 0.39;

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
      title: paintingDetails?.title as string,
      artwork: paintingDetails?.details[0].file,
      artist: 'Ashin Joti Sara',
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

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent barStyle="default" backgroundColor="transparent" />
      <TopNavigation
        title={t('TITLES.HOME')}
        scrollA={scrollA}
        backBtn={true}
      />

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonTextSmall} />
        </View>
      ) : (
        <View>
          <View style={[styles.bannerContainer, {height: customHeight}]}>
            <Image
              source={{uri: paintingDetails?.details[0].file}}
              style={{width: '100%', height: customHeight}}
            />
          </View>

          <View
            style={{
              backgroundColor: Colors[theme]?.secondary,
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              paddingBottom: 60,
              borderColor: Colors[theme]?.secondary_dark,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              gap: 10,
            }}>
            <View style={{alignItems: 'center', gap: 10}}>
              <Text style={styles.paintingTitle}>{paintingDetails?.title}</Text>

              <View
                style={{
                  width: width * 0.96,
                  borderColor: Colors[theme]?.text,
                  borderBottomWidth: 1,
                }}
              />

              {/* Music  */}
              <View style={[{width: width * 0.98}, styles.musicContainer]}>
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

              {/* Description */}
              <View style={{width, padding: 10}}>
                <Text
                  style={{
                    textAlign: 'center',
                    letterSpacing: 3,
                    color: Colors[theme]?.text,
                  }}>
                  {paintingDetails?.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
    },
    skeletonContainer: {
      padding: 20,
      alignItems: 'center',
    },
    skeletonImage: {
      width: '100%',
      height: 200,
      backgroundColor: Colors[theme]?.secondary_dark,
      borderRadius: 10,
      marginBottom: 20,
    },
    skeletonText: {
      width: '80%',
      height: 20,
      backgroundColor: Colors[theme]?.secondary_dark,
      borderRadius: 5,
      marginBottom: 10,
    },
    skeletonTextSmall: {
      width: '50%',
      height: 15,
      backgroundColor: Colors[theme]?.secondary_dark,
      borderRadius: 5,
    },
    bannerContainer: {
      alignItems: 'center',
      overflow: 'visible',
    },
    paintingTitle: {
      marginTop: 5,
      textAlign: 'center',
      fontSize: 20,
      color: Colors[theme]?.text,
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
  });

export default PaintingScreen;
