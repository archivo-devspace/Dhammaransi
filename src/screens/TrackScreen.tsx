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
  truncateText,
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
import FolderListsBottomSheet, {
  FolderListsBottomSheetMethods,
} from '../components/commons/FolderListsBottomSheet';

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

  // console.log('orientation', orientation);

  const [currentActiveTrack, setCurrentActiveTrack] = useState<Track | null>(
    null,
  );

  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);


  const [icon, setIcon] = useState();

 

  useEffect(() => {
    MaterialIcon.getImageSource('circle', 20, Colors[theme].primary).then(
      source => {
        setIcon(source);
      },
    );
  }, []);

  const styles = styling(theme);
  const {top} = insets;

  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const folderListsbottomSheetRef = useRef<FolderListsBottomSheetMethods>(null);

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

  const expandFolderListsHandler = () => {
    folderListsbottomSheetRef.current?.expand();
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
    <View style={[styles.mainContainer]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />

      <View style={{flex: 4}}>
        <View style={styles.imgContainer}>
          <View
            style={[
              styles.imageShadow,
              {flex: 4, width: width, height: '100%'},
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
              flex: 2,
              width: width,
            }}>
            {!currentTrack ? (
             <View style={{justifyContent: 'center', alignItems:'center', height: '100%'}}>
               <CustomButton
                title={t('UTILS.CHOOSEALBLUM')}
                customButtonStyle={[styles.chooseFromBtn, {width: width * 0.7}]}
                customButtonTextStyle={[
                  styles.chooseFrom,
                  {fontSize: height * 0.018},
                ]}
                gap={10}
                onPress={() => navigation.navigate('AudioCategories')}
                icon={
                  <FontAwesome
                    name="music"
                    size={height * 0.02}
                    color={Colors[theme].primary}
                  />
                }
              />
              </View>
            ) : (
              <>
               <View style={{flex: 2.5 , justifyContent: 'flex-end' , paddingHorizontal: 5}}>
                <Text
                  style={[
                    styles.titleText,
                    {fontSize: height * 0.03},
                  ]}>
                     {truncateText(currentTrack?.title, 50)}
                 
                </Text>
                </View>
               <View style={{flex: 3.5, justifyContent: 'center', paddingHorizontal: 5}}>
               <Text
                  style={[
                    styles.artistText,
                    {fontSize: height * 0.025, },
                  ]}>
                     {truncateText(currentTrack?.artist, 90)}
                </Text>
               </View>
              </>
            )}
          </View>
        </View>
      </View>

      <View
        style={[
          styles.contentContainer,
          // {paddingBottom: height > 800 ? height * 0.2 : height * 0.1},
          {
            height: height * 0.2,
            width: width,
            paddingVertical: 10,
            paddingBottom: 20,
          },
        ]}>
        <View style={styles.trackContainer}>
          <Slider
            style={{
              height: height * 0.03,
              width: width * 0.8,
            }}
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
            <Text style={[styles.durationText, {fontSize: height * 0.02}]}>
              {new Date(progress.position * 1000).toISOString().substr(14, 5)}
            </Text>
            <Text style={[styles.durationText, {fontSize: height * 0.02}]}>
              {getTrackDuration(progress)}
            </Text>
          </View>
        </View>
        {currentTrack ? (
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
                    size={height * 0.04}
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
                <Text
                  style={{color: Colors[theme].primary, paddingVertical: 5}}>
                  {downloadProgress < 100
                    ? `${t('UTILS.DOWNLOADING')}`
                    : `${t('UTILS.DOWNLOADED')}`}
                </Text>
              </View>
            ) : (
              <CustomButton
                customButtonStyle={styles.btn}
                onPress={expandFolderListsHandler}
                icon={
                  <MaterialIcon
                    name={`cloud-download`}
                    size={height * 0.04}
                    color={Colors[theme].primary}
                  />
                }
              />
            )}
          </View>
        ) : (
          <View style={{height: height * 0.04}}></View>
        )}
        <View
          style={[
            styles.buttonContainer,
            {height: height * 0.08, width: width * 0.9, gap: height * 0.03},
          ]}>
          <CustomButton
            customButtonStyle={styles.btn}
            icon={
              <MaterialIcon
                name={`${repeatIcon()}`}
                size={height * 0.04}
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
                size={height * 0.04}
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
                  size={height * 0.08}
                  style={{elevation: 2}}
                  color={Colors[theme].primary}
                />
              ) : playbackState.state === State.Paused ? (
                <MaterialIcons
                  name={`play-circle`}
                  size={height * 0.08}
                  style={{elevation: 2}}
                  color={Colors[theme].primary}
                />
              ) : playbackState.state === State.Ready ||
                playbackState.state === State.Buffering ? (
                <LoadingSpinner
                  durationMs={1500}
                  bgColor={Colors[theme].secondary_dark}
                  color={Colors[theme].primary}
                  loaderSize={height * 0.08}
                  loadingText="connecting"
                  loadingTextColor={Colors[theme].primary}
                  loadingTextSize={6}
                />
              ) : (
                <Entypo
                  name={`controller-stop`}
                  size={height * 0.08}
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
                size={height * 0.04}
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
                size={height * 0.04}
                color={Colors[theme].primary}
              />
            }
          />
        </View>
        {/* <View style={{height: 90}} /> */}
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
      <BottomSheet
        snapTo="70"
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
      <FolderListsBottomSheet
        snapTo="70"
        ref={folderListsbottomSheetRef}
        backGroundColor={Colors[theme].secondary}
      />
    </View>
  );
};

export default TrackScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme].secondary,
      paddingBottom: 65,
    },
    imgContainer: {
      alignItems: 'center',
      flex: 1,
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
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
    },
    titleText: {
      // width: '80%',

      // height: 50,
      fontWeight: 'bold',
      textAlign: 'center',
      color: Colors[theme].primary,
    },
    artistText: {
      // fontSize: 16,
      // width: '80%',

      // height: 70,
      color: Colors[theme].primary,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'space-around',
      bottom: 0,
      flex: 2,

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

      fontWeight: 'bold',
    },
    btn: {
      backgroundColor: 'transparent',
      alignSelf: 'center',
    },
    buttonContainer: {
      justifyContent: 'center',
      alignContent: 'center',

      flexDirection: 'row',
      alignItems: 'center',
    },
    chooseFrom: {
      color: Colors[theme].primary_light,
      
      // fontSize: 14,
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
