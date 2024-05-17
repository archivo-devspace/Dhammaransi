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

const MovieListScreen = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = styling(theme);
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);
  return (
    <Container title="MENUS.PICTURES">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {youtubeVideos?.map(video => (
          <React.Fragment key={video.id}>
            <View
              style={styles.contentContainer}
              // onPress={() => console.log('hello')}
            >
              {/* <View
                style={[
                  styles.img,
                  {
                    width: width * 0.9,
                    height: height * 0.18,
                  },
                ]}>
                <Image
                  style={{width: '100%', height: '100%', borderRadius: 10}}
                  source={{uri: video.image}}
                  resizeMode="cover"
                />
              </View> */}
              <YoutubePlayer
                height={height * 0.3}
                width={width * 0.9}
                play={playing}
                videoId={video.videoId}
                onChangeState={onStateChange}
              />
            </View>
            <Text style={styles.text}>{video.title}</Text>
            <Text style={styles.text}>{video.description}</Text>

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
    },
    text: {
      fontWeight: 'bold',
      color: Colors[theme].text,
      fontSize: 18,
      textAlign: 'center',
    },
    img: {
      borderRadius: 100,
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
          elevation: 4,
        },
      }),
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
      marginVertical: 20,
    },
    btn: {},
  });
