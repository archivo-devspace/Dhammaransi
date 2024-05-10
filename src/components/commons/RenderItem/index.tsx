import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';
import {CustomButton} from '../../utils';
import {AntDesign} from '../../../utils/common';
import {useTrackContext} from '../../../contexts/TrackContext';
import TrackPlayer, {
  State,
  Track,
  usePlaybackState,
} from 'react-native-track-player';

type Props = {
  currentQueue: Track[];
  currentTrack: Track | null;
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>;
};

const RenderItem = ({currentQueue, currentTrack, setCurrentTrack}: Props) => {
  const {theme} = useThemeContext();
  const {getCurrentQueue, togglePlayingMode} = useTrackContext();
  const playbackState = usePlaybackState();
  const styles = styling(theme);

  const [loadingTrackId, setLoadingTrackId] = useState<number | null>(null);

  const handlePlaylistPlay = async (i: number, id: number) => {
    const presentTrack: any = currentQueue.find(track => track.id === id);
    if (loadingTrackId !== id) {
      setLoadingTrackId(id);
      setCurrentTrack(null);
      TrackPlayer.skip(i);
      const isCurrentTrackPlaying =
        currentTrack?.id === id && playbackState.state === State.Playing;
      if (isCurrentTrackPlaying) {
        await TrackPlayer.pause();
        setLoadingTrackId(null);
      } else {
        await TrackPlayer.play();
      }
    } else {
      await TrackPlayer.pause();
      setLoadingTrackId(null);
    }
  };

  const getButtonIcon = (item: any) => {
    if (loadingTrackId === item.id && playbackState.state !== State.Playing) {
      return 'loading1';
    } else if (
      currentTrack?.id === item.id &&
      playbackState.state === State.Playing
    ) {
      return 'pause';
    } else if (
      (currentTrack?.id !== item.id && loadingTrackId !== item.id) ||
      (currentTrack?.id === item.id && playbackState.state === State.Paused)
    ) {
      return 'caretright';
    } else {
      return 'loading1';
    }
  };

  const renderButtonIcon = (item: any) => {
    const iconName = getButtonIcon(item);
    return (
      <AntDesign name={iconName} size={25} color={Colors[theme].primary} />
    );
  };

  return (
    <>
      {currentQueue.map((item: any, i: number) => {
        return (
          <View style={[styles.container]} key={i}>
            <CustomButton
              onPress={() => handlePlaylistPlay(i, item.id)}
              customButtonStyle={styles.btn}
              icon={renderButtonIcon(item)}
            />
            <View style={styles.textContainer}>
              {currentTrack?.id === item.id &&
              playbackState.state === State.Playing ? (
                <Text style={[styles.text, {fontSize: 18}]}>
                  {item.title.length > 40
                    ? item.title.slice(0, 40) + '...'
                    : item.title}
                </Text>
              ) : (
                <Text
                  style={[styles.inactiveText, {fontSize: 18, opacity: 0.8}]}>
                  {item.title}
                </Text>
              )}
              {currentTrack?.id === item.id &&
              playbackState.state === State.Playing ? (
                <Text style={[styles.text, {fontSize: 14}]}>
                  {item.artist.length > 45
                    ? item.artist.slice(0, 45) + '...'
                    : item.artist}
                </Text>
              ) : (
                <Text
                  style={[styles.inactiveText, {fontSize: 12, opacity: 0.5}]}>
                  {item.artist}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </>
  );
};

export default RenderItem;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 14,
      marginHorizontal: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    imageContainer: {
      backgroundColor: 'transparent',
      padding: 10,
      borderRadius: 8,
    },
    btn: {
      backgroundColor: Colors[theme].text,
      padding: 5,
      borderRadius: 10,
    },
    image: {
      width: 30,
      height: 30,
    },
    textContainer: {},
    text: {
      color: Colors[theme].primary_dark,
      fontWeight: 'bold',
    },
    inactiveText: {
      color: Colors[theme].text,
      fontWeight: 'bold',
    },
  });
