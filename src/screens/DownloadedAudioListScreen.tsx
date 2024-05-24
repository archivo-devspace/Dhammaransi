import {
  StyleSheet,
  Text,
  View,
  Image,
  DeviceEventEmitter,
  Platform,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useIsFocused} from '@react-navigation/core';
import RNFetchBlob from 'rn-fetch-blob';
import {
  deleteAllDownloadDataFromLocal,
  deleteContentFromLocalDir,
  fetchDownloadedDataFromLocalDir,
} from '../api_services/downloadService';
import Container from '../components/commons/Container';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import {Colors} from '../theme';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import {CustomButton} from '../components/utils';
import {AntDesign, truncateText} from '../utils/common';

const OfflineDownloadGrid = ({navigation}: any) => {
  const [data, setData] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [isDeletionModalVisible, setDeletionModalVisible] = useState(false);
  const [isSelectedPress, setSelectedPress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();
  const {theme} = useThemeContext();
  const {height, width} = useWindowDimensions();
  const styles = styling(theme);

  let TrackFolder =
    Platform.OS === 'android'
      ? RNFetchBlob.fs.dirs.CacheDir
      : RNFetchBlob.fs.dirs.DocumentDir;

  const fetchDownloadedData = async () => {
    setIsLoading(true);
    try {
      await fetchDownloadedDataFromLocalDir(item => {
        const sortedData = item.sort((a: any, b: any) => {
          const dateA = new Date(a.downloadDate) as any;
          const dateB = new Date(b.downloadDate) as any;
          return dateB - dateA;
        });
        setData(sortedData);
      });
      setIsLoading(false); // Moved outside the try block
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  // console.log('object');
  // console.log('isLoading', isLoading);
  // console.log('data', data);
  // console.log('isLoading', isLoading);

  useEffect(() => {
    // Only fetch data if either reRender or isFocused changes
    if (reRender || isFocused) {
      fetchDownloadedData();
    }
  }, [reRender, isFocused]);

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

  let renderItem;
  if (isLoading) {
    renderItem = (
      <View style={styles.noDataConatiner}>
        <LoadingSpinner
          durationMs={1500}
          loaderSize={70}
          bgColor={Colors[theme].secondary_dark}
          color={Colors[theme].primary_light}
          loadingText="LOADING"
          loadingTextColor={Colors[theme].primary}
          loadingTextSize={8}
        />
      </View>
    );
  } else if (!isLoading && data.length === 0) {
    renderItem = (
      <View style={styles.noDataConatiner}>
        <Image
          source={require('../assets/nodata.png')}
          style={{
            width: width * 0.8,
            height: height * 0.5,
            borderRadius: 100,
          }}
          resizeMode="stretch"
        />
        <Text style={styles.noDataText}>No Downloaded data found!</Text>
      </View>
    );
  } else if (!isLoading && data.length >= 0) {
    renderItem = (
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <React.Fragment key={item.id}>
            <View style={styles.container}>
              <CustomButton
                // onPress={() => handlePlayAudio(item)}
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
                      // currentTrack?.id === item.id &&
                      // playbackState.state === State.Playing
                      // ? 'pause':
                      'caretright'
                    }
                    size={30}
                    color={Colors[theme].primary}
                  />
                </View>
              </CustomButton>
            </View>
            {data.length !== item?.id && <View style={styles.divider} />}
          </React.Fragment>
        )}
        keyExtractor={(item: any) => item.id.toString()}
        // Optional: Add extra FlatList props like `ItemSeparatorComponent`, etc.
      />
    );
  }
  return <Container title={'Your Downloaded Files'}>{renderItem}</Container>;
};

export default OfflineDownloadGrid;

const styling = (theme: Theme) =>
  StyleSheet.create({
    noDataConatiner: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      gap: 20,
    },
    noDataText: {
      color: Colors[theme].text,
      fontWeight: 'bold',
      fontSize: 25,
    },
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
