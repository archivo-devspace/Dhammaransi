import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useIsFocused} from '@react-navigation/core';
import RNFetchBlob from 'rn-fetch-blob';
import {
  deleteAllDownloadDataFromLocal,
  deleteContentFromLocalDir,
  fetchDownloadedDataFromLocalDir,
} from '../api_services/downloadService';

const OfflineDownloadGrid = ({navigation}: any) => {
  const [data, setData] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [isDeletionModalVisible, setDeletionModalVisible] = useState(false);
  const [isSelectedPress, setSelectedPress] = useState(false);

  const isFocused = useIsFocused();

  var TrackFolder =
    Platform.OS === 'android'
      ? RNFetchBlob.fs.dirs.CacheDir
      : RNFetchBlob.fs.dirs.DocumentDir;

  const fetchDownloadedData = () => {
    fetchDownloadedDataFromLocalDir(item => {
      const sortedData = item.sort((a: any, b: any) => {
        const dateA = new Date(a.downloadDate) as any;
        const dateB = new Date(b.downloadDate) as any;
        return dateB - dateA;
      });

      setData(sortedData);
    });
  };

  useEffect(() => {
    fetchDownloadedData();
  }, [reRender, isFocused]);

  useEffect(() => {
    setSelectedPress(true);
  }, [isFocused]);

  useEffect(() => {
    const downloadListenerStatus = DeviceEventEmitter.addListener(
      'downloadDone',
      e => {
        setReRender(true);
      },
    );
    return () => {
      downloadListenerStatus.remove();
    };
  }, []);

  const handlePlay = (url: any, thumbnail: any, item: any) => {
    const finalUrl = url.split('/').pop();
    const offlineUrl = TrackFolder + '/' + finalUrl;

    const thumbnailImage =
      Platform.OS === 'android' ? 'file://' + thumbnail : thumbnail;

    navigation.navigate('PlayerScreen', {
      source: offlineUrl,
      posterImage: thumbnailImage,
      data: item,
      offline: true,
    });
  };

  const onInsideMenuPress = () => {
    setDeletionModalVisible(true);
  };

  const onDeletionPress = (id: any) => {
    deleteContentFromLocalDir(id);
    setTimeout(() => {
      fetchDownloadedData();
    }, 500);
  };

  const onToggleSelectPress = () => {
    setSelectedPress(!isSelectedPress);
  };

  const onDeleteAllPress = () => {
    deleteAllDownloadDataFromLocal();
    fetchDownloadedData();
  };

  const renderSongItem = ({item, index}: any) => {
    const {source, posterImage, songName, artistName, id} = item;

    const offlinePosterImageUrl =
      Platform.OS === 'android' ? 'file://' + posterImage : posterImage;

    return (
      <>
        <TouchableOpacity
          key={index}
          style={styles.songItemContainer}
          onPress={() => handlePlay(source, posterImage, item)}>
          <ImageBackground
            resizeMode="cover"
            source={{uri: offlinePosterImageUrl}}
            style={styles.songItem}>
            <View
              style={isSelectedPress ? styles.overlay : styles.overlayAlt}
            />
            <Text style={styles.title}>{songName}</Text>
            <Text style={styles.artist}>{artistName}</Text>
            {isSelectedPress ? (
              <TouchableOpacity
                onPress={onInsideMenuPress}
                style={styles.insideMenuContainer}>
                <Image
                  style={styles.insideMenu}
                  source={require('../assets/menu.png')}
                />
              </TouchableOpacity>
            ) : (
              <Image
                style={styles.insideMenuContainerAlt}
                source={require('../assets/greenIcon.png')}
              />
            )}
          </ImageBackground>
        </TouchableOpacity>

        {/* <DeletionModal
          isModalVisible={isDeletionModalVisible}
          onClosePress={() => setDeletionModalVisible(false)}
          onDeletionPress={() => onDeletionPress(id)}
        /> */}
      </>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.heading}>Your Downloads</Text>

        {data?.length > 1 ? (
          <View style={{flexDirection: 'row'}}>
            {!isSelectedPress ? (
              <TouchableOpacity onPress={onDeleteAllPress}>
                <Image
                  style={{width: 25, height: 25, marginRight: 20}}
                  source={require('../assets/delete.png')}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={onToggleSelectPress}>
              <Image
                style={{width: 25, height: 25}}
                source={
                  isSelectedPress
                    ? require('../assets/unselected.png')
                    : require('../assets/aa.png')
                }
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {data?.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderSongItem}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatlistContent}
          bounces={false}
          numColumns={3}
        />
      ) : (
        <>
          <Image
            resizeMode="cover"
            style={styles.downloadContainer}
            source={require('../assets/404-removebg.png')}
          />
          <Text style={styles.downloadText}>No download found</Text>
        </>
      )}
    </View>
  );
};

export default OfflineDownloadGrid;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 10,
    color: '#fff',
  },
  flatlistContent: {
    paddingBottom: 60,
    alignItems: 'flex-start',
  },
  songItemContainer: {
    marginHorizontal: 5,
    marginBottom: 10,
  },
  songItem: {
    width: 120,
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    width: '150%',
  },
  artist: {
    fontSize: 13,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    width: '150%',
    marginBottom: -17,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  overlayAlt: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  playIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  numberStyle: {
    fontSize: 70,
    color: '#fff',
    fontWeight: 'bold',
  },
  insideMenu: {
    width: 20,
    height: 20,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  insideMenuContainer: {
    position: 'absolute',
    top: 8,
    right: 2,
  },
  insideMenuContainerAlt: {
    position: 'absolute',
    top: 8,
    right: 2,
    width: 20,
    height: 20,
  },
  downloadContainer: {
    width: '80%',
    height: 200,
    marginTop: -40,
    alignSelf: 'center',
  },
  downloadText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 20,
    fontWeight: '400',
  },
});
