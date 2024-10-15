import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Theme, useThemeContext } from '../../../contexts/ThemeContext';
import { Colors } from '../../../theme';
import { CustomButton } from '../../utils';
import { AntDesign, getFontFamily, truncateText } from '../../../utils/common';
import TrackPlayer, {
  State,
  Track,
  usePlaybackState,
} from 'react-native-track-player';
import { useTranslation } from 'react-i18next';

type Props = {
  currentQueue: Track[];
  currentActiveTrack: Track | null;
  setCurrentActiveTrack: React.Dispatch<React.SetStateAction<Track | null>>;
  getCurrentActiveTrack: any;
};

const RenderItem = ({
  currentQueue,
  currentActiveTrack,

  getCurrentActiveTrack,
}: Props) => {
  const { theme } = useThemeContext();
  const { t } = useTranslation();

  const playbackState = usePlaybackState();
  const styles = styling(theme);

  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);

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

  return (
    <View>
      {currentQueue.length > 0 ? (
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
                            opacity:
                              currentActiveTrack?.id === item.id ? 1 : 0.8,
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
                            fontSize:
                              currentActiveTrack?.id === item.id ? 14 : 12,
                            opacity:
                              currentActiveTrack?.id === item.id ? 1 : 0.5,
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
      ) : (
        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: '50%',
          }}>
          <Text style={{ color: Colors[theme].text }}>{t('UTILS.EMPTY')}</Text>
        </View>
      )}
    </View>
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
      backgroundColor: Colors[theme].secondary_dark,
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
      color: Colors[theme].primary,
      fontFamily: getFontFamily('bold'),
    },
    inactiveText: {
      color: Colors[theme].text,
      fontFamily: getFontFamily('regular'),
    },
  });
