import {StyleSheet, Text, View, StatusBar, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {AntDesign, truncateText} from '../utils/common';
import {CustomButton} from '../components/utils';
import {
  MainStackParamList,
  NavigationMainStackScreenProps,
} from '../navigations/StackNavigation';
import {useTrackContext} from '../contexts/TrackContext';
import {FlatList} from 'react-native';
import {State, usePlaybackState} from 'react-native-track-player';
import {useTranslation} from 'react-i18next';

import Container from '../components/commons/Container';
import {tracks} from '../utils/constants';
import {RouteProp} from '@react-navigation/native';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
  route: RouteProp<MainStackParamList, 'Audios'>;
};

const Audios = ({navigation, route}: Props) => {
  console.log('route', route.params);
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const {trackLists, handlePlay, currentTrack, setTrackLists, setRepeatMode} =
    useTrackContext();
  const playbackState = usePlaybackState();
  const styles = styling(theme);

  useEffect(() => {
    const fetchAudioList = async () => {
      setTrackLists(tracks);
    };
    fetchAudioList();
  }, []);

  const handlePlayAudio = async (item: any) => {
    // togglePlayingMode();
    if (currentTrack === null || currentTrack.id !== item.id) {
      handlePlay(item.id);
    }
    setRepeatMode('shuffle-disabled');

    navigation.navigate('Track');
  };

  return (
    <Container title="MENUS.AUDIOS">
      <FlatList
        data={trackLists}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <React.Fragment key={item.id}>
            <View style={styles.container}>
              <CustomButton
                onPress={() => handlePlayAudio(item)}
                customButtonStyle={styles.btn}>
                <View style={styles.trackContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 16,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{uri: item.artwork}}
                      resizeMode="cover"
                      style={styles.img}
                    />
                    <View style={{width: '70%', gap: 10}}>
                      <Text style={styles.title}>
                        {truncateText(item.title, 45)}
                      </Text>
                      <Text style={styles.desc}>
                        {truncateText(item.artist, 30)}
                      </Text>
                    </View>
                  </View>
                  <AntDesign
                    name={
                      currentTrack?.id === item.id &&
                      playbackState.state === State.Playing
                        ? 'pause'
                        : 'caretright'
                    }
                    size={30}
                    color={Colors[theme].primary}
                  />
                </View>
              </CustomButton>
            </View>
            {trackLists.length !== item?.id && <View style={styles.divider} />}
          </React.Fragment>
        )}
        keyExtractor={item => item.id.toString()}
        // Optional: Add extra FlatList props like `ItemSeparatorComponent`, etc.
      />
    </Container>
  );
};

export default Audios;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    trackContainer: {
      gap: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingRight: 20,
      height: 60,
    },
    img: {
      width: 60,
      height: 60,
      borderRadius: 12,
    },
    btn: {
      backgroundColor: Colors[theme].secondary,
    },
    title: {
      fontSize: 16,
      color: Colors[theme].text,
    },
    desc: {
      fontSize: 12,
      color: Colors[theme].text,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
    },
  });
