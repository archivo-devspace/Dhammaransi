/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {AntDesign, getFontFamily, truncateText} from '../utils/common';
import {CustomButton} from '../components/utils';
import {
  MainStackParamList,
  NavigationMainStackScreenProps,
} from '../navigations/StackNavigation';
import {useTrackContext} from '../contexts/TrackContext';
import {FlatList} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import Container from '../components/commons/Container';
import {RouteProp} from '@react-navigation/native';
import {useGetSingleAlbum} from '../api_services/lib/queryhooks/useAudio';
import SkeletonView from '../components/commons/Skeleton';
import NetworkError from '../components/commons/LottieAnimationView';
import {emptyData, networkError} from '../utils/constants';
import DataNotFound from '../components/commons/LottieAnimationView';
import {t} from 'i18next';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
  route: RouteProp<MainStackParamList, 'Audios'>;
};

const Audios = ({navigation, route}: Props) => {
  const {theme} = useThemeContext();
  const {trackLists, handlePlay, currentTrack, setTrackLists, setRepeatMode} =
    useTrackContext();
  const playbackState = usePlaybackState();
  const styles = styling(theme);
  const {height} = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: album,
    isLoading: isAlbumLoading,
    refetch,
    isError,
  } = useGetSingleAlbum(route.params.id);

  useEffect(() => {
    if (album) {
      setTrackLists(album.data.results);
    }
  }, [album]);

  const handlePlayAudio = async (item: any) => {
    await TrackPlayer.reset();
    handlePlay(item.id);
    setRepeatMode('shuffle-disabled');
    navigation.navigate('Track');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing
    refetch().finally(() => setRefreshing(false)); // Refetch the data and stop refreshing once done
  }, [refetch]);

  // Loader for the initial loading of data
  if (isAlbumLoading) {
    return (
      <Container title="MENUS.AUDIOS">
        <>
          {Array.from({length: 10}, (_, index: number) => (
            <View key={index} style={styles.container}>
              <View style={styles.trackContainer}>
                <View
                  style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
                  <SkeletonView height={70} width={70} borderRadius={12} />
                  <View style={{width: '70%', gap: 10}}>
                    <SkeletonView height={12} width="auto" borderRadius={10} />
                    <SkeletonView height={8} width={100} borderRadius={10} />
                  </View>
                </View>
                <SkeletonView width={35} height={35} borderRadius={5} />
              </View>
            </View>
          ))}
        </>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container title="MENUS.AUDIOS">
        <NetworkError
          handlePress={refetch}
          btnType="refresh"
          lottieFiePath={networkError}
        />
      </Container>
    );
  }

  if (album?.data.results.length === 0) {
    return (
      <Container title="MENUS.AUDIOS">
        <View style={styles.noDataContainer}>
          <DataNotFound
            btnType="back"
            lottieFiePath={emptyData}
            handlePress={() => navigation.goBack()}
          />
          <Text style={styles.noDataText}>{t('UTILS.NODATA')}</Text>
        </View>
      </Container>
    );
  }

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
                      <Text style={[styles.title, {fontSize: height * 0.022}]}>
                        {truncateText(item.title, 45)}
                      </Text>
                      <Text style={[styles.desc, {fontSize: height * 0.015}]}>
                        {truncateText(item.artist, 25)}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Only use 'refreshing' state here
            onRefresh={onRefresh}
            progressViewOffset={-1}
            tintColor={Colors[theme].primary}
            colors={[Colors[theme].primary]}
            progressBackgroundColor={Colors[theme].secondary}
          />
        }
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
      color: Colors[theme].text,
      fontFamily: getFontFamily('regular'),
    },
    desc: {
      color: Colors[theme].text,
      fontFamily: getFontFamily('regular'),
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noDataContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      gap: 20,
    },
    noDataText: {
      color: Colors[theme].text,
      fontSize: 20,
      fontFamily: getFontFamily('bold'),
    },
  });
