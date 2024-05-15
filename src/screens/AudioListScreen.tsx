import {StyleSheet, Text, View, StatusBar, Image} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {AntDesign} from '../utils/common';
import {CustomButton} from '../components/utils';
import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
import {useTrackContext} from '../contexts/TrackContext';
import {FlatList} from 'react-native';
import {State, usePlaybackState} from 'react-native-track-player';
import {useTranslation} from 'react-i18next';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const Audios = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const {trackLists, handlePlay, currentTrack} = useTrackContext();
  const playbackState = usePlaybackState();
  const styles = styling(theme);
  const {top} = insets;

  const handlePlayAudio = async (item: any) => {
    // togglePlayingMode();
    if (currentTrack === null || currentTrack.id !== item.id) {
      handlePlay(item.id);
    }
    navigation.navigate('Track');
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      {/* <SafeAreaView /> */}
      <View style={{marginTop: top}}>
        <Text style={styles.headerText}>{t('MENUS.AUDIOS')}</Text>
      </View>
      <FlatList
        style={{marginTop: 30}}
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
                        {item.title.length > 45
                          ? item.title.slice(0, 45) + '...'
                          : item.title}
                      </Text>
                      <Text style={styles.desc}>
                        {item.artist.length > 30
                          ? item.artist.slice(0, 30) + '...'
                          : item.artist}
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
      // paddingVertical: 20,
      paddingBottom: 25,
      marginBottom: 40,
    },
    headerText: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 25,
      color: Colors[theme].text,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
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
