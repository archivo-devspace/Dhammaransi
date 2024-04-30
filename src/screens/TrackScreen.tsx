import {
  Image,
  Platform,
  SafeAreaView,
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
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {trackLists} from '../utils/constants';

const TrackScreen = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const [repeatMode, setRepeatMode] = useState('off');
  const [isPlay, setIsPlayed] = useState('controller-play');
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const [trackIndex, setTrackIndex] = useState(0);

  const styles = styling(theme);
  const {top, bottom, left, right} = insets;

  const handleAddTrack = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add(trackLists);
  };

  const togglePlayback = async (playbackState: any) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    console.log('hello', playbackState);
    console.log('currentTrack', currentTrack);
    if (currentTrack !== null) {
      if (playbackState.state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    }
  };

  useEffect(() => {
    handleAddTrack();
  }, []);

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

  const handleNextTrack = async () => {
    await TrackPlayer.skipToNext();
  };

  const handlePrevTrack = async () => {
    const position = await TrackPlayer.getPosition();
    console.log('position', position);
    if (position < 3) {
      await TrackPlayer.skipToPrevious();
    } else {
      await TrackPlayer.seekTo(0);
    }
  };
  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={Colors[theme].secondary} />
      <SafeAreaView style={{flex: 1.3, paddingTop: top}}>
        <View style={styles.imgContainer}>
          <View style={styles.imageShadow}>
            <Image
              source={require('../assets/marguerite.jpg')}
              resizeMode="cover"
              style={styles.img}
            />
          </View>
          <Text style={styles.titleText}>{trackLists[trackIndex].title}</Text>
          <Text style={styles.artistText}>{trackLists[trackIndex].artist}</Text>
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
    </View>
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
      gap: 10,
      paddingVertical: 20,
    },
    imageShadow: {
      width: '80%',
      height: '80%',
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
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors[theme].text,
    },
    artistText: {
      fontSize: 18,
      color: Colors[theme].text,
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      width: '100%',
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
