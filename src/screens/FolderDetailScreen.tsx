import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  DeviceEventEmitter,
  useWindowDimensions,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util'
import {
  deleteContentFromLocalDir,
  fetchDownloadedDataFromLocalDir,
} from '../api_services/downloadService';
import { CustomButton } from '../components/utils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getFontFamily, truncateText } from '../utils/common';
import { useTrackContext } from '../contexts/TrackContext';
import { NavigationMainBottomTabScreenProps } from '../navigations/BottomNavigation';
import { Colors } from '../theme';
import { Theme, useThemeContext } from '../contexts/ThemeContext';
import Container from '../components/commons/Container';
import { Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import ConfirmModal from '../components/commons/ConfirmModal';
import TrackPlayer from 'react-native-track-player';
import DataNotFound from '../components/commons/LottieAnimationView';
import { emptyData } from '../utils/constants';
import SkeletonView from '../components/commons/Skeleton';


type Props = {
  route: any;
  navigation: NavigationMainBottomTabScreenProps['navigation'];
};

type TrackItem = {
  id: number;
  title: string;
  artist: string;
  artwork: string;
  downloadDate: string;
  isAudio: boolean;
  selectedFolder: string;
  url: string;
};

const FolderDetailScreen = ({ route, navigation }: Props) => {
  const { folderName } = route.params;

  const {
    deleteTrackById,
    currentTrack,
    handlePlay,
    setTrackLists,
    selectedFolder,
  } = useTrackContext();
  const { t } = useTranslation();

  const [tracks, setTracks] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const swipeableRefs = useRef<Swipeable[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const isFocused = useIsFocused();
  const { theme } = useThemeContext();
  const { height, width } = useWindowDimensions();
  const styles = createStyles(theme);

  const fetchDownloadedData = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetchDownloadedDataFromLocalDir(
        async items => {
          const sortedItems = items.sort(
            (a: any, b: any) =>
              new Date(b.downloadDate).getTime() -
              new Date(a.downloadDate).getTime(),
          );
          const updatedItems = await Promise.all(
            sortedItems.map(async (item: any) => {
              const fileExists = await ReactNativeBlobUtil.fs.exists(item.artwork);
              return {
                ...item,
                artwork: fileExists
                  ? Platform.OS === 'android'
                    ? `file://${item.artwork}`
                    : item.artwork
                  : '',
              };
            }),
          );
          console.log("updatedItems", updatedItems)
          if (updatedItems.length === 0) {
            setIsEmpty(true);
          }
          setTracks(updatedItems);
          setTrackLists(updatedItems);
        },
        folderName, // Pass the folderName to fetch data from the specific folder
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [folderName]);

  console.log('track', tracks);

  const handlePlayAudio = async (item: any) => {
    // if (!currentTrack) {
    await TrackPlayer.reset();
    console.log('puse');
    handlePlay(item.id);
    // }
    navigation.navigate('TrackBottom');
  };

  const confirmDeletion = (id: any) => {
    setSelectedTrackId(id);
    setModalVisible(true);
  };
  console.log('setDeletion', folderName);
  const handleDeletion = async () => {
    if (selectedTrackId) {
      await deleteContentFromLocalDir(selectedTrackId, folderName);
      deleteTrackById(selectedTrackId);
      fetchDownloadedData();
      setModalVisible(false);
      setSelectedTrackId(null);
    }
  };

  const handleCancelDeletion = () => {
    setModalVisible(false);
    swipeableRefs.current.forEach(ref => ref?.close());
  };

  useEffect(() => {
    if (isFocused) {
      fetchDownloadedData();
    }
  }, [isFocused, fetchDownloadedData]);

  useEffect(() => {
    const downloadListenerStatus = DeviceEventEmitter.addListener(
      'downloadDone',
      () => {
        fetchDownloadedData();
      },
    );
    return () => {
      downloadListenerStatus.remove();
    };
  }, [fetchDownloadedData]);

  const renderTrackItem = ({ item, index }: { item: any; index: number }) => (
    <Swipeable
      ref={ref => {
        swipeableRefs.current[index] = ref as any;
      }}
      onSwipeableWillOpen={() => confirmDeletion(item.id)}
      renderLeftActions={() => (
        <View style={styles.leftDeleteContainer}>
          <View style={styles.deleteButton}>
            <AntDesign name="delete" size={30} color="white" />
          </View>
        </View>
      )}
      renderRightActions={() => (
        <View style={styles.deleteContainer}>
          <View style={styles.deleteButton}>
            <AntDesign name="delete" size={30} color="white" />
          </View>
        </View>
      )}>
      <View style={styles.trackItem}>
        <View style={styles.trackDetails}>
          <Image
            source={{ uri: item.artwork }}
            resizeMode="cover"
            style={styles.trackImage}
          />
          <View style={styles.trackTextContainer}>
            <Text style={[styles.trackTitle, { fontSize: height * 0.022 }]}>
              {truncateText(item.title, 45)}
            </Text>
            <Text style={[styles.trackArtist, { fontSize: height * 0.015 }]}>
              {truncateText(item.artist, 30)}
            </Text>
          </View>
        </View>
        <CustomButton
          onPress={() => handlePlayAudio(item)}
          customButtonStyle={styles.playButton}>
          <AntDesign
            name="caretright"
            size={30}
            color={Colors[theme].primary}
          />
        </CustomButton>
      </View>
    </Swipeable>
  );

  return (
    <>
      <Container title={folderName}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner
              durationMs={1500}
              loaderSize={70}
              bgColor={Colors[theme].secondary_dark}
              color={Colors[theme].primary_light}
              loadingText={t('UTILS.LOADING')}
              loadingTextColor={Colors[theme].primary}
              loadingTextSize={8}
            />
          </View>

        ) : isEmpty ? (
          <View style={styles.noDataContainer}>
            <DataNotFound btnType='back' lottieFiePath={emptyData} handlePress={() => navigation.goBack()} />
            <Text style={styles.noDataText}>{t('UTILS.NODOWNLOADDATA')}</Text>
          </View>

        ) : (

          <FlatList
            data={tracks}
            showsVerticalScrollIndicator={false}
            renderItem={renderTrackItem}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            keyExtractor={item => item.id.toString()}
          />

        )}
      </Container>
      <ConfirmModal
        title={t('UTILS.DELETE_TITLE')}
        confirmText={t('UTILS.YES_DELETE')}
        cancelText={t('UTILS.NO_DELETE')}
        animationType="fade"
        handleConfirm={handleDeletion}
        handleCancel={handleCancelDeletion}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      gap: 20,
    },
    noDataContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      gap: 20,
    },
    noDataText: {
      color: Colors[theme].text,
      fontFamily: getFontFamily('regular'),
      fontSize: 20,
    },
    trackItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 20,
      backgroundColor: Colors[theme].secondary,
    },
    trackDetails: {
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
    },
    trackImage: {
      width: 60,
      height: 60,
      borderRadius: 12,
    },
    trackTextContainer: {
      width: '70%',
      gap: 10,
    },
    trackTitle: {
      fontFamily: getFontFamily('regular'),
      color: Colors[theme].text,
    },
    trackArtist: {
      fontFamily: getFontFamily('regular'),
      color: Colors[theme].text,
    },
    playButton: {
      backgroundColor: 'transparent',
    },
    deleteContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: Colors[theme].danger,
    },
    leftDeleteContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: Colors[theme].danger,
    },
    deleteButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 70,
      height: '100%',
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: Colors[theme].secondary_dark,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      textAlign: 'center',
      lineHeight: 35,
      color: Colors[theme].text,
      marginBottom: 20,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    confirmButton: {
      backgroundColor: Colors[theme].danger,
      padding: 10,
      borderRadius: 5,
      flex: 1,
      alignItems: 'center',
      marginRight: 10,
    },
    cancelButton: {
      backgroundColor: Colors[theme].primary,
      padding: 10,
      borderRadius: 5,
      flex: 1,
      alignItems: 'center',
      marginLeft: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });

export default FolderDetailScreen;
