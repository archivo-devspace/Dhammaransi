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
  items: any;
};

const RenderItem = ({items}: Props) => {
  const {theme} = useThemeContext();
  const [currentQueue, setCurrentQueue] = useState<Track[]>([]);
  const {currentTrack, getCurrentQueue, togglePlayingMode} = useTrackContext();
  const playbackState = usePlaybackState();
  const styles = styling(theme);

  useEffect(() => {
    const getQueue = async () => {
      const queue = await getCurrentQueue();
      setCurrentQueue(queue);
    };

    getQueue();
  }, [currentQueue]);

  const handlePlaylistPlay = async (i: number, id: number) => {
    await TrackPlayer.skip(i);
    currentTrack?.id === id && playbackState.state === State.Playing
      ? TrackPlayer.pause()
      : TrackPlayer.play();
  };

  return (
    <>
      {currentQueue.map((item: any, i: number) => {
        return (
          <View style={[styles.container]}>
            <CustomButton
              onPress={() => handlePlaylistPlay(i, item.id)}
              customButtonStyle={styles.btn}
              icon={
                <AntDesign
                  name={
                    currentTrack?.id === item.id &&
                    playbackState.state === State.Playing
                      ? 'pause'
                      : 'caretright'
                  }
                  size={25}
                  color={Colors[theme].primary_dark}
                />
              }
            />
            <View style={styles.textContainer}>
              <Text style={[styles.text, {fontSize: 18}]}>
                {item.title.length > 30
                  ? item.title.slice(0, 30) + '...'
                  : item.title}
              </Text>
              {currentTrack?.id === item.id &&
                playbackState.state === State.Playing && (
                  <Text style={[styles.text, {fontSize: 14}]}>Active</Text>
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
      backgroundColor: Colors[theme].secondary_dark,
      padding: 5,
      borderRadius: 10,
    },
    image: {
      width: 30,
      height: 30,
    },
    textContainer: {},
    text: {
      color: Colors[theme].text,
      fontWeight: 'bold',
    },
  });
