import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import Slider from '@react-native-community/slider';
import {CustomButton} from '../components/utils';
import {Entypo, MaterialIcon} from '../utils/common';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {trackLists} from '../utils/constants';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../navigations/StackNavigation';
import {NavigationMainBottomTabScreenProps} from '../navigations/BottomNavigation';

type Props = {
  route: RouteProp<MainStackParamList, 'Track'>;
  navigation: NavigationMainBottomTabScreenProps['navigation'];
};

TrackPlayer.setupPlayer();

const TrackScreen = ({route, navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const [repeatMode, setRepeatMode] = useState('off');
  const progress = useProgress();
  const playbackState = usePlaybackState();

  const [currentTack, setCurrentTrack] = useState<any>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isItem, setIsItem] = useState(null);

  const item = route.params?.item;

  const styles = styling(theme);
  const {top} = insets;

  useLayoutEffect(() => {
    setIsItem(item);
  }, [item]);

  useEffect(() => {
    const initializePlayer = async (item: any) => {
      setCurrentTrack(item);

      await TrackPlayer.reset();
      await TrackPlayer.add({
        url: item?.url,
        title: item?.name,
        artist: item?.artist,
        artwork: item?.artwork,
      });
      await TrackPlayer.play();
    };

    initializePlayer(isItem);
  }, [isItem]);

  // useEffect(() => {
  //   const updateTrackInfo = async () => {
  //     const currentTrackId = await TrackPlayer.getActiveTrack();
  //     setCurrentTrackTitle(currentTrackId?.title);
  //   };

  //   updateTrackInfo();
  // }, [playbackState.state]);

  TrackPlayer.updateOptions({
    // Media controls capabilities
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],

    // Capabilities that will show up when the notification is in the compact form on Android
    compactCapabilities: [Capability.Play, Capability.Pause],
  });

  const handleNextTrack = async () => {
    await TrackPlayer.skipToNext();
  };

  const handlePrevTrack = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const togglePlayback = async (playbackState: any) => {
    if (playbackState.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  const repeatIcon = () => {
    if (repeatMode === 'off') {
      return 'repeat-off';
    }
    if (repeatMode === 'track') {
      return 'repeat-once';
    }
    if (repeatMode === 'repeat') {
      return 'repeat';
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode === 'off') {
      setRepeatMode('track');
    }
    if (repeatMode === 'track') {
      setRepeatMode('repeat');
    }
    if (repeatMode === 'repeat') {
      setRepeatMode('off');
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <StatusBar backgroundColor={Colors[theme].secondary} />
      <SafeAreaView style={{flex: 1.5, paddingTop: top}}>
        <View style={styles.imgContainer}>
          <View
            style={[
              styles.imageShadow,
              {width: width / 1.3, height: height / 2.5},
            ]}>
            <Image
              source={
                currentTack
                  ? currentTack?.artwork
                  : require('../assets/marguerite.jpg')
              }
              resizeMode="cover"
              style={styles.img}
            />
          </View>
          <Text style={styles.titleText}>{currentTack?.title}</Text>
          <Text style={styles.artistText}>{currentTack?.artist}</Text>
        </View>
      </SafeAreaView>
      <View style={styles.contentContainer}>
        {/* scroll bar  */}
        <View style={styles.trackContainer}>
          <Slider
            style={{width: '100%', height: 40}}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
            minimumTrackTintColor={Colors[theme].primary_dark}
            maximumTrackTintColor={Colors[theme].text}
          />
          <View style={styles.trackDuration}>
            <Text style={styles.durationText}>
              {new Date(progress.duration * 1000).toISOString().substr(14, 5)}
            </Text>
            <Text style={styles.durationText}>
              {new Date((progress.duration - progress.position) * 1000)
                .toISOString()
                .substr(14, 5)}
            </Text>
          </View>
        </View>
        {/* play button  */}
        <View style={styles.buttonContainer}>
          <CustomButton
            customButtonStyle={styles.btn}
            icon={
              <MaterialIcon
                name={`${repeatIcon()}`}
                size={30}
                color={Colors[theme].text}
              />
            }
            onPress={changeRepeatMode}
          />
          <CustomButton
            onPress={handlePrevTrack}
            customButtonStyle={styles.btn}
            icon={
              <Entypo
                name={`controller-jump-to-start`}
                size={45}
                color={Colors[theme].text}
              />
            }
          />
          <CustomButton
            customButtonStyle={styles.btn}
            onPress={() => togglePlayback(playbackState)}
            icon={
              <Entypo
                name={
                  playbackState.state === State.Playing
                    ? 'controller-paus'
                    : 'controller-play'
                }
                size={70}
                color={Colors[theme].text}
              />
            }
          />
          <CustomButton
            onPress={handleNextTrack}
            customButtonStyle={styles.btn}
            icon={
              <Entypo
                name={`controller-next`}
                size={45}
                color={Colors[theme].text}
              />
            }
          />
          <CustomButton
            customButtonStyle={styles.btn}
            icon={
              <MaterialIcon
                name={`playlist-music`}
                size={30}
                color={Colors[theme].text}
              />
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default TrackScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme].secondary,
    },
    imgContainer: {
      alignItems: 'center',
      gap: 14,
      paddingVertical: 30,
    },
    imageShadow: {
      borderRadius: 20,
      shadowColor: Colors[theme].text,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        android: {
          elevation: 7,
        },
      }),
    },
    img: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
    titleText: {
      fontSize: 20,
      width: '80%',
      height: 50,
      fontWeight: 'bold',

      textAlign: 'center',
      marginTop: 16,
      color: Colors[theme].text,
    },
    artistText: {
      fontSize: 16,
      width: '80%',
      height: 50,

      color: Colors[theme].text,
      textAlign: 'center',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      width: '100%',
      paddingBottom: 80,
    },
    trackContainer: {
      paddingHorizontal: '10%',
      width: '100%',
      height: 100,
    },
    trackDuration: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: '4%',
    },
    durationText: {
      color: Colors[theme].text,
      fontSize: 14,
      fontWeight: 'bold',
    },
    btn: {
      backgroundColor: Colors[theme].secondary,
    },
    buttonContainer: {
      justifyContent: 'center',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
  });
