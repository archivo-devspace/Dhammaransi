import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  useWindowDimensions,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {useTranslation} from 'react-i18next';
import {MainStackParamList} from '../navigations/StackNavigation';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import {SafeAreaView} from 'react-native';
import TopNavigation from '../components/commons/TopNavigation';
import YoutubePlayer from 'react-native-youtube-iframe';
import Slider from '@react-native-community/slider';
import {Entypo, MaterialIcon, MaterialIcons} from '../utils/common';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import {CustomButton} from '../components/utils';
import {useTrackContext} from '../contexts/TrackContext';
import {singlePaintingDetils} from '../utils/constants';
import {SinglePaintingDetialsProps} from '../types/golbal';

type Props = {
  route: RouteProp<MainStackParamList, 'PaintingScreen'>;
};

const PaintingScreen = ({route}: Props) => {
  console.log('route', route.params);
  const {theme} = useThemeContext();
  const [icon, setIcon] = useState();
  const playbackState = usePlaybackState();
  const styles = styling(theme);
  const {t} = useTranslation();
  const {width, height} = useWindowDimensions();
  const [playing, setPlaying] = useState(false);
  const [paintingDetils, setPaintingDetails] =
    useState<SinglePaintingDetialsProps>();
  const progress = useProgress();
  const {
    repeatIcon,
    changeRepeatMode,
    togglePlayingMode,

    currentTrack,
    onDownloadPress,
    onAlreadyDownloadPress,
    setDownloadingTrackIds,
    isAlreadyDownload,
    setAlreadyDownload,
    isDownloading,
    setDownloading,
    loading,
    setLoading,
    isModalVisible,
    setModalVisible,
    downloadProgress,
  } = useTrackContext();
  const scrollA = useRef(new Animated.Value(0)).current;

  const customHeight = height * 0.3;

  const BANNER_H = height * 0.4;

  useEffect(() => {
    MaterialIcon.getImageSource('circle', 20, Colors[theme].primary).then(
      setIcon,
    );
  }, []);

  const getPaintingDetails = async () => {
    setPaintingDetails(singlePaintingDetils);
  };

  useEffect(() => {
    getPaintingDetails();
  }, []);

  const getTrackDuration = (progress: any) => {
    const durationInSeconds = progress.duration - progress.position;

    if (durationInSeconds <= 0) {
      return '00:00';
    } else {
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);

      return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
  };

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlayer = async () => {
    paintingDetils && (await TrackPlayer.add(paintingDetils.music));
    togglePlayingMode();
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView>
        <TopNavigation title={t('TITLES.HOME')} scrollA={scrollA} />
      </SafeAreaView>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {
            useNativeDriver: true,
          },
        )}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}>
        <View style={styles.bannerContainer}>
          <Animated.View
            style={[
              {
                width: '100%',
                transform: [
                  {
                    translateY: scrollA.interpolate({
                      inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
                      outputRange: [
                        -BANNER_H / 2,
                        0,
                        BANNER_H * 0.75,
                        BANNER_H * 0.75,
                      ],
                    }),
                  },
                  {scale: 1},
                ],
              },
              {height: customHeight - 16},
            ]}>
            <Image
              source={require('../assets/marguerite.jpg')}
              //   style={{width: '100%', height: customHeight - 16}}
            />
          </Animated.View>
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
          <View
            style={{
              alignItems: 'center',
              gap: 10,
            }}>
            <Text style={styles.paintingTitle}>{paintingDetils?.title}</Text>
            <YoutubePlayer
              height={height * 0.28}
              width={width * 0.96}
              play={playing}
              videoId={paintingDetils?.video?.videoId}
              onChangeState={onStateChange}
            />
            <Text
              style={{
                color: Colors[theme]?.text,
                fontSize: 15,
                marginBottom: 15,
              }}>
              {paintingDetils?.video?.title}
            </Text>
            <View
              style={{
                borderBottomWidth: 1,
                width: width * 0.96,
                borderColor: Colors[theme]?.text,
              }}
            />
            {/* <View
              style={[
                {width: width * 0.96, height: height * 0.08},
                styles.musicContainer,
              ]}></View> */}
            <View style={[{width: width * 0.98}, styles.musicContainer]}>
              <Text
                style={{
                  color: Colors[theme]?.text,
                  fontSize: 15,
                  textAlign: 'center',
                  marginBottom: 15,
                }}>
                {paintingDetils?.music?.title}
              </Text>
              <Slider
                trackImage={icon}
                value={progress.position}
                minimumValue={0}
                maximumValue={progress.duration}
                thumbTintColor={Colors[theme].primary}
                onSlidingComplete={async value => {
                  await TrackPlayer.seekTo(value);
                  await TrackPlayer.play();
                }}
                thumbImage={icon}
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
                onPress={togglePlayer}
                icon={
                  playbackState.state === State.Playing ? (
                    <MaterialIcons
                      name={`pause-circle`}
                      size={60}
                      style={{elevation: 2}}
                      color={Colors[theme].primary}
                    />
                  ) : playbackState.state === State.Paused ? (
                    <MaterialIcons
                      name={`play-circle`}
                      size={60}
                      style={{elevation: 2}}
                      color={Colors[theme].primary}
                    />
                  ) : playbackState.state === State.Ready ||
                    playbackState.state === State.Buffering ? (
                    <LoadingSpinner
                      durationMs={1500}
                      bgColor={Colors[theme].secondary_dark}
                      color={Colors[theme].primary}
                      loaderSize={60}
                      loadingText="connecting"
                      loadingTextColor={Colors[theme].primary}
                      loadingTextSize={6}
                    />
                  ) : (
                    <Entypo
                      name={`controller-stop`}
                      size={60}
                      style={{elevation: 2}}
                      color={Colors[theme].primary}
                    />
                  )
                }
              />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
    },
    menuContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 10,
      columnGap: 10,
      marginVertical: 20,
    },
    bannerContainer: {
      marginTop: -1000,
      paddingTop: 1000,
      alignItems: 'center',
      overflow: 'visible',
    },
    paintingTitle: {
      textAlign: 'center',
      fontSize: 25,
      color: Colors[theme]?.text,
    },
    musicContainer: {
      padding: 20,
      borderColor: Colors[theme]?.primary,
      borderWidth: 1,
      borderRadius: 30,
    },
    trackContainer: {
      paddingHorizontal: '10%',
      width: '100%',
      height: 60,
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
