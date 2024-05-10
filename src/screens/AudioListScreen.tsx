import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  StatusBar,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {AntDesign} from '../utils/common';
import {CustomButton} from '../components/utils';
import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
import {useTrackContext} from '../contexts/TrackContext';
import {FlatList} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const Audios = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const {
    trackLists,
    setRepeatMode,
    handlePlay,
    currentTrack,
    togglePlayingMode,
  } = useTrackContext();
  const {width, height} = useWindowDimensions();
  const playbackState = usePlaybackState();
  const styles = styling(theme);
  const {top, bottom, left, right} = insets;

  const handlePlayAudio = async (item: any) => {
    // togglePlayingMode();
    if (currentTrack === null || currentTrack.id !== item.id) {
      handlePlay(item.id);
    }
    navigation.navigate('Track');
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <FlatList
        style={{marginTop: top}}
        data={trackLists}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <React.Fragment key={item.id}>
            <View style={styles.container}>
              <View style={styles.trackContainer}>
                <Image
                  source={{uri: item.artwork}}
                  resizeMode="cover"
                  style={styles.img}
                />
                <View style={{width: '75%', gap: 10}}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.desc}>{item.artist}</Text>
                </View>
              </View>
              <CustomButton
                onPress={() => handlePlayAudio(item)}
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
            {trackLists.length !== item?.id && <View style={styles.divider} />}
          </React.Fragment>
        )}
        keyExtractor={item => item.id.toString()}
        // Optional: Add extra FlatList props like `ItemSeparatorComponent`, etc.
      />
    </View>
  );
};

export default Audios;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme].secondary,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 40,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    trackContainer: {
      gap: 10,
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
    },
    img: {
      width: 70,
      height: 70,
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
      marginVertical: 20,
    },
  });
