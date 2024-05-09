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
  const {trackLists, setRepeatMode, handlePlay, currentTrack, getCurrentQueue} =
    useTrackContext();
  const playbackState = usePlaybackState();
  const styles = styling(theme);

  useEffect(() => {
    const getQueue = async () => {
      const queue = await getCurrentQueue();

      setCurrentQueue(queue);
    };

    getQueue();
  }, [currentQueue]);

  const handlePlaylistPlay = (i: number) => {
    TrackPlayer.skip(i);
  };

  return (
    <>
      {currentQueue.map((item: any, i: number) => {
        return (
          <View style={[styles.container]}>
            <View style={styles.imageContainer}>
              <Image source={{uri: item.artwork.uri}} style={styles.image} />
            </View>
            <Text style={styles.text}>{item.title}</Text>
            <Text style={styles.text}>{item.id}</Text>
            <CustomButton
              onPress={() => handlePlaylistPlay(i)}
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
                  color={Colors[theme].text}
                />
              }
            />
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
      backgroundColor: Colors[theme].secondary,
    },
    image: {
      width: 30,
      height: 30,
    },
    text: {
      color: Colors[theme].text,
      fontSize: 16,
    },
  });
