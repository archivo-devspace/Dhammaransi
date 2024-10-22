/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {youtubeVideos} from '../utils/constants';
import Container from '../components/commons/Container';
import YoutubePlayer from 'react-native-youtube-iframe';
import {truncateText} from '../utils/common';
import Orientation from 'react-native-orientation-locker';

const MovieListScreen = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = styling(theme);
  const [playing, setPlaying] = useState(false);

  // Unlock orientation for fullscreen and return to portrait on exit
  const handleFullscreenChange = useCallback((isFullscreen: boolean) => {
    if (isFullscreen) {
      Orientation.unlockAllOrientations(); // Allow landscape for fullscreen
    } else {
      Orientation.lockToPortrait(); // Lock back to portrait when not fullscreen
    }
  }, []);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('Video has finished playing!');
      // Lock orientation back to portrait when the video ends
      Orientation.lockToPortrait();
    }
  }, []);

  return (
    <Container title="MENUS.MOVIES">
      <FlatList
        data={youtubeVideos}
        keyExtractor={video => video.id.toString()}
        renderItem={({item: video}) => {
          return (
            <View style={{alignItems: 'center'}}>
              <View
                style={[
                  styles.contentContainer,
                  {
                    width: width * 0.9,
                    height: width < 500 ? 200 : height * 0.3,
                  },
                ]}>
                <YoutubePlayer
                  height={width < 500 ? 200 : height * 0.3}
                  width={width * 0.9}
                  play={playing}
                  videoId={video.videoId}
                  onChangeState={onStateChange}
                  onFullScreenChange={handleFullscreenChange} // Handle orientation change when fullscreen
                />
              </View>
              <Text style={styles.text}>{video.title}</Text>
              {video.description && (
                <Text style={styles.text}>
                  {truncateText(video.description, 40)}
                </Text>
              )}
            </View>
          );
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      />
    </Container>
  );
};

export default MovieListScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    contentContainer: {
      alignSelf: 'center',
      marginBottom: 10,
      borderRadius: 20, // Set border radius here
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: Colors[theme].text,
    },
    text: {
      fontWeight: 'bold',
      color: Colors[theme].text,
      fontSize: 18,
      textAlign: 'center',
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
      marginVertical: 30,
    },
  });
