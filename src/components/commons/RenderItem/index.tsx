import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';
import {CustomButton} from '../../utils';
import {AntDesign, truncateText} from '../../../utils/common';
import {useTrackContext} from '../../../contexts/TrackContext';
import TrackPlayer, {
  State,
  Track,
  usePlaybackState,
} from 'react-native-track-player';

type Props = {
  currentQueue: Track[];
  currentActiveTrack: Track | null;
  setCurrentActiveTrack: React.Dispatch<React.SetStateAction<Track | null>>;
  getCurrentActiveTrack: any;
};

const RenderItem = ({
  currentQueue,
  currentActiveTrack,
  setCurrentActiveTrack,
  getCurrentActiveTrack,
}: Props) => {
  const {theme} = useThemeContext();
  const {getCurrentQueue, togglePlayingMode} = useTrackContext();
  const playbackState = usePlaybackState();
  const styles = styling(theme);

  const [loadingTrackId, setLoadingTrackId] = useState<number | null>(null);

  // const [currentActiveTrack, setCurrentActiveTrack] = useState<Track | null>(
  //   null,
  // );

  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);

  // useEffect(() => {
  //   const getCurrentTrack = async () => {
  //     const current = await TrackPlayer.getActiveTrack();

  //     current && setCurrentActiveTrack(current);
  //   };
  //   getCurrentTrack();
  // }, [currentTrackId]);

  const handlePlaylistPlay = useCallback(
    async (index: number, id: number) => {
      if (currentActiveTrack?.id === id) {
        if (playbackState.state === State.Playing) {
          await TrackPlayer.pause();
        } else if (playbackState.state === State.Paused) {
          await TrackPlayer.play();
        }
      } else {
        await TrackPlayer.skip(index);
        await TrackPlayer.play();
      }
    },
    [currentTrackId, currentActiveTrack, playbackState.state],
  );

  //const getButtonIcon = (item: any) => {
  //   if (loadingTrackId === item.id && playbackState.state !== State.Playing) {
  //     return 'loading1';
  //   } else if (
  //     currentTrack?.id === item.id &&
  //     playbackState.state === State.Playing
  //   ) {
  //     return 'pause';
  //   } else if (
  //     (currentTrack?.id !== item.id && loadingTrackId !== item.id) ||
  //     (currentTrack?.id === item.id && playbackState.state === State.Paused)
  //   ) {
  //     return 'caretright';
  //   } else {
  //     return 'loading1';
  //   }
  // };

  // const renderButtonIcon = (item: any) => {
  //   const iconName = getButtonIcon(item);
  //   return (
  //     <AntDesign name={iconName} size={25} color={Colors[theme].primary} />
  //   );
  // };

  return (
    <>
      {currentQueue.map((item: any, index: number) => {
        return (
          <View
            style={[
              styles.container,
              {
                borderColor:
                  currentActiveTrack?.id === item.id
                    ? Colors[theme].primary
                    : Colors[theme].secondary_light,
              },
            ]}
            key={index}>
            <CustomButton
              onPress={async () => {
                setCurrentTrackId(item.id);
                getCurrentActiveTrack(item.id);
                await handlePlaylistPlay(index, item.id);
              }}
              customButtonStyle={styles.btn}>
              <View style={styles.btnContainer}>
                <View style={styles.icon}>
                  {currentActiveTrack?.id === item.id ? (
                    playbackState.state === State.Paused ? (
                      <AntDesign
                        name="caretright"
                        size={25}
                        color={Colors[theme].primary}
                      />
                    ) : (
                      <AntDesign
                        name="pause"
                        size={25}
                        color={Colors[theme].primary}
                      />
                    )
                  ) : (
                    <AntDesign
                      name="caretright"
                      size={25}
                      color={Colors[theme].primary}
                    />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      currentActiveTrack?.id === item.id
                        ? styles.text
                        : styles.inactiveText,
                      {
                        fontSize: 18,
                        opacity: currentActiveTrack?.id === item.id ? 1 : 0.8,
                      },
                    ]}>
                    {truncateText(item.title, 23)}
                  </Text>
                  <Text
                    style={[
                      currentActiveTrack?.id === item.id
                        ? styles.text
                        : styles.inactiveText,
                      {
                        fontSize: currentActiveTrack?.id === item.id ? 14 : 12,
                        opacity: currentActiveTrack?.id === item.id ? 1 : 0.5,
                      },
                    ]}>
                    {truncateText(item.artist, 33)}
                  </Text>
                </View>
              </View>
            </CustomButton>
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
      marginHorizontal: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,

      borderRightWidth: 1,
      borderLeftWidth: 1,

      borderRadius: 20,
      marginVertical: 5,
    },
    imageContainer: {
      backgroundColor: 'transparent',
      padding: 10,
      borderRadius: 8,
    },

    btnContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 20,
      padding: 10,
    },
    icon: {
      backgroundColor: Colors[theme].text,
      borderRadius: 15,
      padding: 10,
    },
    btn: {
      padding: 5,
      borderRadius: 10,
      width: '100%',
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
