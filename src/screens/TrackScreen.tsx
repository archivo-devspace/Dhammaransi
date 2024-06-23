import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  DeviceEventEmitter,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import {BottomSheetMethods} from '../components/commons/BottomSheet';
import RenderItem from '../components/commons/RenderItem';
import BottomSheet from '../components/commons/BottomSheet';
import {CustomButton} from '../components/utils';
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcon,
  MaterialIcons,
} from '../utils/common';
import {Colors} from '../theme';
import TrackPlayer, {
  Capability,
  State,
  Track,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../navigations/StackNavigation';
import {NavigationMainBottomTabScreenProps} from '../navigations/BottomNavigation';
import {useTrackContext} from '../contexts/TrackContext';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {useTranslation} from 'react-i18next';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import Toast from 'react-native-toast-message';
import DownloadModal from '../components/commons/DownloadModal';
import {
  fetchDownloadedDataFromLocalDir,
  sendDownloadedDataToLocalDir,
} from '../api_services/downloadService';
import * as Progress from 'react-native-progress'; // Import Progress

type Props = {
  route: RouteProp<MainStackParamList, 'Track'>;
  navigation: NavigationMainBottomTabScreenProps['navigation'];
};

const TrackScreen = ({route, navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const [currentQueue, setCurrentQueue] = useState<Track[]>([]);
  const {getCurrentQueue} = useTrackContext();
  const {width, height} = useWindowDimensions();
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const {
    repeatIcon,
    changeRepeatMode,
    togglePlayingMode,
    handleNextTrack,
    handlePrevTrack,
    currentTrack,
    onDownloadPress,
    onAlreadyDownloadPress,
    setDownloadingTrackIds,
    isAlreadyDownload,
    setAlreadyDownload,
    isDownloading,
    setDownloading,
    loading,
    setLoading,
    isModalVisible,
    setModalVisible,
    downloadProgress,
  } = useTrackContext();

  const [currentActiveTrack, setCurrentActiveTrack] = useState<Track | null>(
    null,
  );

  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);

  // const [isModalVisible, setModalVisible] = useState(false);
  // const [isAlreadyDownload, setAlreadyDownload] = useState(false);
  // const [isDownloading, setDownloading] = useState(false);
  const [icon, setIcon] = useState();
  // const [downloadProgress, setDownloadProgress] = useState(0);
  // const [downloadingTrackIds, setDownloadingTrackIds] = useState<any>([]);
  // const [loading, setLoading] = useState(false);

  // useLayoutEffect(() => {
  //   fetchDownloadedDataFromLocalDir(item => {
  //     if (item?.length > 0) {
  //       const track = item.find(
  //         (obj: any) => obj?.contentId === currentTrack.id,
  //       );
  //       setAlreadyDownload(!!track);
  //     } else {
  //       setAlreadyDownload(false);
  //     }
  //   });

  //   const find = downloadingTrackIds.find(
  //     (element: any) => element === currentTrack.id,
  //   );

  //   console.log('find', find);
  //   if (find !== undefined) {
  //     setLoading(true);
  //   } else {
  //     setLoading(false);
  //   }
  //   // Reset the downloading state if the current track changes
  //   if (!find) {
  //     setDownloading(false);
  //   }
  // }, [currentTrack, downloadingTrackIds]);

  // const onDownloadPress = () => {
  //   const find = downloadingTrackIds.find(
  //     (element: any) => element === currentTrack.id,
  //   );
  //   if (!find) {
  //     setModalVisible(true);
  //     setDownloading(true);
  //     setDownloadingTrackIds((prevIds: any) => [...prevIds, currentTrack.id]);

  //     sendDownloadedDataToLocalDir(
  //       err => {
  //         if (err) {
  //           setDownloading(false);
  //           setDownloadingTrackIds((prevIds: any) =>
  //             prevIds.filter((id: any) => id !== currentTrack.id),
  //           );
  //         }
  //       },
  //       currentTrack.id,
  //       currentTrack.url,
  //       currentTrack.artist,
  //       currentTrack.title,
  //       currentTrack.artwork,
  //       true,
  //     );
  //   } else {
  //     setModalVisible(true); // Show the modal with current progress if already downloading
  //   }
  // };
  // const onAlreadyDownloadPress = () => {
  //   showToast(
  //     'success',
  //     'Already downloaded',
  //     'This content is already downloaded 👋',
  //   );
  // };

  // console.log('downloading content', isDownloading);

  useEffect(() => {
    MaterialIcon.getImageSource('circle', 20, Colors[theme].primary).then(
      setIcon,
    );
  }, []);

  // useEffect(() => {
  //   const listener = DeviceEventEmitter.addListener(
  //     'downloadProgress',
  //     data => {
  //       if (data.contentId === currentTrack?.id) {
  //         setDownloadProgress(parseInt(data.progressValue));
  //       }
  //     },
  //   );

  //   return () => {
  //     listener.remove();
  //   };
  // }, [currentTrack]);

  const styles = styling(theme);
  const {top} = insets;

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  useLayoutEffect(() => {
    const getCurrentTrack = async () => {
      const current = await TrackPlayer.getActiveTrack();

      current && setCurrentActiveTrack(current);
    };
    getCurrentTrack();
  }, [currentTrackId, currentTrack]);

  useEffect(() => {
    const getQueue = async () => {
      const queue = await getCurrentQueue();
      setCurrentQueue(queue);
    };

    getQueue();
  }, [currentQueue]);

  const getCurrentActiveTrack = useCallback(
    async (id: number) => {
      setCurrentTrackId(id);
    },
    [currentTrackId],
  );

  const expandHandler = () => {
    bottomSheetRef.current?.expand();
  };

  const getTrackDuration = (progress: any) => {
    const durationInSeconds = progress.duration - progress.position;

    if (durationInSeconds <= 0) {
      return '00:00';
    } else {
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);

      return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
  };

  return (
    <ScrollView
      style={[styles.mainContainer]}
      showsVerticalScrollIndicator={false}>
      <StatusBar translucent />

      <View style={{flex: 1, paddingTop: top}}>
        <View style={styles.imgContainer}>
          <View
            style={[
              styles.imageShadow,
              {width: width / 1.2, height: height / 2.75},
            ]}>
            <Image
              source={
                currentTrack
                  ? {uri: currentTrack?.artwork}
                  : require('../assets/marguerite.jpg')
              }
              resizeMode="cover"
              style={styles.img}
            />
          </View>
          <View
            style={{
              marginTop: 30,

              justifyContent: 'center',
              paddingHorizontal: 20,
              gap: 5,
              height: 135,
            }}>
            {!currentTrack ? (
              <CustomButton
                title={t('UTILS.CHOOSEALBLUM')}
                customButtonStyle={styles.chooseFromBtn}
                customButtonTextStyle={styles.chooseFrom}
                gap={10}
                onPress={() => navigation.navigate('AudioCategories')}
                icon={
                  <FontAwesome
                    name="music"
                    size={15}
                    color={Colors[theme].primary}
                  />
                }
              />
            ) : (
              <>
                <Text style={styles.titleText}>{currentTrack?.title}</Text>
                <Text style={styles.artistText}>{currentTrack?.artist}</Text>
              </>
            )}
          </View>
        </View>
      </View>
      <BottomSheet
        snapTo="65"
        ref={bottomSheetRef}
        backGroundColor={Colors[theme].secondary}>
        <View
          style={{paddingBottom: height > 800 ? height * 0.1 : height * 0.17}}>
          <RenderItem
            currentQueue={currentQueue}
            currentActiveTrack={currentActiveTrack}
            setCurrentActiveTrack={setCurrentActiveTrack}
            getCurrentActiveTrack={getCurrentActiveTrack}
          />
        </View>
      </BottomSheet>
      <View
        style={[
          styles.contentContainer,
          // {paddingBottom: height > 800 ? height * 0.2 : height * 0.1},
          {bottom: 0},
        ]}>
        <View style={styles.trackContainer}>
          <Slider
            style={{
              width: '100%',

              height: 30,
            }}
            trackImage={icon}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor={Colors[theme].primary}
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
              await TrackPlayer.play();
            }}
            thumbImage={icon}
            minimumTrackTintColor={Colors[theme].primary}
            maximumTrackTintColor={Colors[theme].text}
          />
          <View style={styles.trackDuration}>
            <Text style={styles.durationText}>
              {new Date(progress.position * 1000).toISOString().substr(14, 5)}
            </Text>
            <Text style={styles.durationText}>
              {getTrackDuration(progress)}
            </Text>
          </View>
        </View>
        {currentTrack && (
          <View
            style={{
              marginBottom: 16,
            }}>
            {isAlreadyDownload ? (
              <CustomButton
                customButtonStyle={styles.btn}
                onPress={onAlreadyDownloadPress}
                icon={
                  <Ionicons
                    name={`cloud-done-sharp`}
                    size={40}
                    color={Colors[theme].primary}
                  />
                }
              />
            ) : isDownloading || loading ? (
              <View style={styles.progressBarContainer}>
                <Progress.Bar
                  progress={downloadProgress / 100}
                  color={Colors[theme].primary}
                  borderWidth={2}
                />
                <Text style={{color: Colors[theme].primary}}>
                  {downloadProgress < 100 ? 'Dwonloading...' : 'Downloaded'}
                  {downloadProgress}
                </Text>
              </View>
            ) : (
              <CustomButton
                customButtonStyle={styles.btn}
                onPress={onDownloadPress}
                icon={
                  <MaterialIcon
                    name={`cloud-download`}
                    size={40}
                    color={Colors[theme].primary}
                  />
                }
              />
            )}
          </View>
        )}
        <View style={styles.buttonContainer}>
          <CustomButton
            customButtonStyle={styles.btn}
            icon={
              <MaterialIcon
                name={`${repeatIcon()}`}
                size={30}
                color={Colors[theme].primary}
              />
            }
            onPress={changeRepeatMode}
          />
          <CustomButton
            onPress={handlePrevTrack}
            customButtonStyle={[styles.btn]}
            icon={
              <Entypo
                name={`controller-jump-to-start`}
                size={35}
                color={Colors[theme].primary}
              />
            }
          />
          <CustomButton
            customButtonStyle={styles.btn}
            onPress={togglePlayingMode}
            icon={
              playbackState.state === State.Playing ? (
                <MaterialIcons
                  name={`pause-circle`}
                  size={65}
                  style={{elevation: 2}}
                  color={Colors[theme].primary}
                />
              ) : playbackState.state === State.Paused ? (
                <MaterialIcons
                  name={`play-circle`}
                  size={65}
                  style={{elevation: 2}}
                  color={Colors[theme].primary}
                />
              ) : playbackState.state === State.Ready ||
                playbackState.state === State.Buffering ? (
                <LoadingSpinner
                  durationMs={1500}
                  bgColor={Colors[theme].secondary_dark}
                  color={Colors[theme].primary}
                  loaderSize={65}
                  loadingText="connecting"
                  loadingTextColor={Colors[theme].primary}
                  loadingTextSize={6}
                />
              ) : (
                <Entypo
                  name={`controller-stop`}
                  size={65}
                  style={{elevation: 2}}
                  color={Colors[theme].primary}
                />
              )
            }
          />
          <CustomButton
            onPress={handleNextTrack}
            customButtonStyle={styles.btn}
            icon={
              <Entypo
                name={`controller-next`}
                size={35}
                color={Colors[theme].primary}
              />
            }
          />
          <CustomButton
            customButtonStyle={[
              styles.btn,
              currentQueue.length === 0 && {opacity: 0.5},
            ]}
            onPress={expandHandler}
            disabled={currentQueue.length === 0}
            icon={
              <MaterialIcon
                name={`playlist-music`}
                size={30}
                color={Colors[theme].primary}
              />
            }
          />
        </View>
        <View style={{height: 90}} />
      </View>

      {/* <DownloadModal
        isModalVisible={isModalVisible}
        onClosePress={() => setModalVisible(false)}
        contentId={currentTrack?.id}
        downloadProgress={downloadProgress}
        onDownloadFinished={(track: any) => {
          if (track) {
            setAlreadyDownload(true);
            setDownloading(false);
            setDownloadingTrackIds((prevIds: any) =>
              prevIds.filter((id: any) => id !== track.id),
            );
          }
        }}
      /> */}
      <Toast />
    </ScrollView>
  );
};

export default TrackScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme].secondary,
    },
    imgContainer: {
      alignItems: 'center',
      gap: 1,
      paddingBottom: 30,
      paddingTop: 15,
    },
    imageShadow: {
      borderRadius: 20,
      shadowColor: Colors[theme].primary_dark,
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
          elevation: 7,
        },
      }),
    },
    img: {
      width: '98%',
      height: '100%',
      alignSelf: 'center',
      borderRadius: 20,
    },
    titleText: {
      fontSize: 20,

      // width: '80%',

      height: 50,
      fontWeight: 'bold',
      textAlign: 'center',
      color: Colors[theme].primary,
    },
    artistText: {
      fontSize: 16,
      // width: '80%',

      height: 70,
      color: Colors[theme].primary,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    contentContainer: {
      alignItems: 'center',
      width: '100%',
      flex: 1,
      // paddingBottom: '25%',
    },
    trackContainer: {
      paddingHorizontal: '10%',
      width: '100%',
      height: 60,
    },
    trackDuration: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: '4%',
    },
    durationText: {
      color: Colors[theme].primary,
      fontSize: 14,
      fontWeight: 'bold',
    },
    btn: {
      backgroundColor: 'transparent',
      alignSelf: 'center',
    },
    buttonContainer: {
      justifyContent: 'center',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
    chooseFrom: {
      color: Colors[theme].primary_light,
      fontSize: 14,
    },
    chooseFromBtn: {
      backgroundColor: Colors[theme].text,
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    suffelIcon: {
      width: 30,
      height: 30,
    },
    progressBarContainer: {
      alignItems: 'center',
      height: 40,
    },
  });

export const showToast = (type: any, text1: string, text2: string) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,

    position: 'top',
    topOffset: 50,
    visibilityTime: 4000,
    autoHide: true,
  });
};
