import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors} from '../theme';
import {ebooks, youtubeVideos} from '../utils/constants';
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
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {youtubeVideos?.map(video => (
          <React.Fragment key={video.id}>
            <View
              style={[
                styles.contentContainer,
                {
                  width: width * 0.9, // Adjust player width
                  height: 190, // Adjust player height
                },
              ]}>
              <YoutubePlayer
                height={190}
                width={width * 0.9}
                play={playing}
                videoId={video.videoId}
                onChangeState={onStateChange}
                onFullScreenChange={handleFullscreenChange} // Handle orientation change when fullscreen
              />
            </View>
            <Text style={styles.text}>{video.title}</Text>
            <Text style={styles.text}>
              {truncateText(video.description, 40)}
            </Text>

            {ebooks.length !== video?.id && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </ScrollView>
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
      alignItems: 'center',
      gap: 20,
      justifyContent: 'space-between',
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
