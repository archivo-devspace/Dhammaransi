import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { BottomSheetMethods } from '../components/commons/BottomSheet';
import RenderItem from '../components/commons/RenderItem';
import BottomSheet from '../components/commons/BottomSheet';
import { CustomButton } from '../components/utils';
import {
  AntDesign,
  Entypo,
  FontAwesome,
  getFontFamily,
  Ionicons,
  MaterialIcon,
  MaterialIcons,
  truncateText,
} from '../utils/common';
import { Colors } from '../theme';
import TrackPlayer, {
  State,
  Track,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigations/StackNavigation';
import { NavigationMainBottomTabScreenProps } from '../navigations/BottomNavigation';
import { useTrackContext } from '../contexts/TrackContext';
import { Theme, useThemeContext } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import * as Progress from 'react-native-progress'; // Import Progress
import FolderListsBottomSheet, {
  FolderListsBottomSheetMethods,
} from '../components/commons/FolderListsBottomSheet';

type Props = {
  route: RouteProp<MainStackParamList, 'Track'>;
  navigation: NavigationMainBottomTabScreenProps['navigation'];
};

const TrackPopupScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const [currentQueue, setCurrentQueue] = useState<Track[]>([]);
  const { getCurrentQueue } = useTrackContext();
  const { width, height } = useWindowDimensions();
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const {
    repeatIcon,
    changeRepeatMode,
    togglePlayingMode,
    handleNextTrack,
    handlePrevTrack,
    currentTrack,
    onAlreadyDownloadPress,
    isAlreadyDownload,
    isDownloading,
    loading,
    downloadProgress,
  } = useTrackContext();

  const [currentActiveTrack, setCurrentActiveTrack] = useState<Track | null>(
    null,
  );

  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);

  const [icon, setIcon] = useState();

  const [alreadyDownloadDisable, setAlreadyDownloadDisable] =
    useState<boolean>(false);

  useEffect(() => {
    MaterialIcon.getImageSource('circle', 20, Colors[theme].primary).then(
      source => {
        setIcon(source);
      },
    );
  }, []);

  const styles = styling(theme);
  const { top } = insets;

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

  const handleAlreadyDownloaded = async () => {
    try {
      setAlreadyDownloadDisable(true);
      onAlreadyDownloadPress();
      setTimeout(() => {
        setAlreadyDownloadDisable(false);
      }, 10000);
    } catch (error) {
      console.error('Error displaying notification:', error);
      setAlreadyDownloadDisable(false);
    }
  };

  const customHeight = height * (2 / 6) - 50;


  return (
    <View style={[styles.mainContainer]}>
      <StatusBar

        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />

      <SafeAreaView style={[styles.safeAreaView]}>
        <CustomButton
          onPress={() => navigation.goBack()}
          icon={
            <AntDesign
              name={'arrowleft'}
              size={height * 0.04}
              color={Colors[theme].primary}
            />
          }
          customButtonStyle={styles.backBtn}
        />
      </SafeAreaView>

      <View style={{ flex: 1, paddingTop: top }}>
        {
          !currentTrack ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}>
              <CustomButton
                title={t('UTILS.CHOOSEALBLUM')}
                customButtonStyle={[
                  styles.chooseFromBtn,
                  { width: width * 0.7 },
                ]}
                customButtonTextStyle={[
                  styles.chooseFrom,
                  { fontSize: height * 0.018 },
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
              <View
                style={{
                  flex: 3.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 5,

                }}>
                <Text style={[styles.titleText, { fontSize: height * 0.027 }]}>
                  {truncateText(currentTrack?.title, 50)}
                </Text>
              </View>
              <View
                style={{
                  flex: 2.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 5,

                }}>
                <Text style={[styles.artistText, { fontSize: height * 0.025 }]}>
                  {truncateText(currentTrack?.artist, 80)}</Text>
              </View>
            </>
          )
        }
      </View>

      <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          borderRadius: 20,
          overflow: 'hidden',
          width: customHeight,
          height: customHeight,
          shadowColor: Colors[theme].text,
          ...Platform.select({
            ios: {
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            },
            android: {
              elevation: 3,
            },
          }),
        }}>
          <Image
            source={
              currentTrack
                ? { uri: currentTrack?.artwork ? currentTrack.artwork : theme === 'dark' ? require('../assets/parate_dark.jpg') : require('../assets/parate_light.jpg') } :
                theme === 'dark' ? require('../assets/parate_dark.jpg') : require('../assets/parate_light.jpg')
            }
            resizeMode="contain"
            style={{
              width: "100%",      // Image takes up the full width of the container
              height: "100%"      // Image takes up the full height of the container
            }}
          />
        </View>

      </View>

      <View style={{ flex: 3 }}>
        <View
          style={[
            styles.contentContainer,
          ]}>

          {currentTrack ? (
            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
              {isAlreadyDownload ? (
                <CustomButton
                  customButtonStyle={styles.btn}
                  disabled={alreadyDownloadDisable}
                  onPress={handleAlreadyDownloaded}
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
                    borderWidth={1}
                  />
                  <Text
                    style={{ color: Colors[theme].primary, paddingVertical: 1, fontSize: height * 0.015, fontFamily: getFontFamily('regular') }}>
                    {downloadProgress < 100
                      ? `${t('UTILS.DOWNLOADING')}`
                      : `${t('UTILS.DOWNLOADED')}`}
                  </Text>
                </View>
              ) : (
                <CustomButton
                  customButtonStyle={styles.btn}
                  onPress={expandFolderListsHandler}
                  disabled={isAlreadyDownload}
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
            <View style={{ flex: 1.5 }}></View>
          )}
          <View
            style={[
              styles.buttonContainer,
              { flex: 2, width: width * 0.9, gap: height * 0.03 },
            ]}>
            <CustomButton
              customButtonStyle={styles.btn}
              icon={
                <MaterialIcon
                  name={`${repeatIcon()}`}
                  size={height * 0.035}
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
                  size={height * 0.035}
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
                    size={height * 0.06}
                    style={{ elevation: 2 }}
                    color={Colors[theme].primary}
                  />
                ) : playbackState.state === State.Paused ? (
                  <MaterialIcons
                    name={`play-circle`}
                    size={height * 0.06}
                    style={{ elevation: 2 }}
                    color={Colors[theme].primary}
                  />
                ) : playbackState.state === State.Ready ||
                  playbackState.state === State.Buffering ? (
                  <LoadingSpinner
                    durationMs={1500}
                    bgColor={Colors[theme].secondary_dark}
                    color={Colors[theme].primary}
                    loaderSize={height * 0.06}
                    loadingText="connecting"
                    loadingTextColor={Colors[theme].primary}
                    loadingTextSize={6}
                  />
                ) : (
                  <Entypo
                    name={`controller-stop`}
                    size={height * 0.06}
                    style={{ elevation: 2 }}
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
                  size={height * 0.035}
                  color={Colors[theme].primary}
                />
              }
            />
            <CustomButton
              customButtonStyle={[
                styles.btn,
                currentQueue.length === 0 && { opacity: 0.5 },
              ]}
              onPress={expandHandler}
              disabled={currentQueue.length === 0}
              icon={
                <MaterialIcon
                  name={`playlist-music`}
                  size={height * 0.035}
                  color={Colors[theme].primary}
                />
              }
            />
          </View>
          <View style={[styles.trackContainer, { flex: 2.5 }]}>
            <Slider
              style={{
                height: height * 0.028,
                width: width * 0.8,
                marginTop: 5
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
              <Text style={[styles.durationText, { fontSize: height * 0.02 }]}>
                {new Date(progress.position * 1000).toISOString().substr(14, 5)}
              </Text>
              <Text style={[styles.durationText, { fontSize: height * 0.02 }]}>
                {getTrackDuration(progress)}
              </Text>
            </View>
          </View>
          {/* <View style={{height: 90}} /> */}
        </View>
        <View style={{ flex: 2.8, paddingBottom: 14, padding: 6 }}>
          <View style={{ flex: 1, borderWidth: 1, borderColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: getFontFamily('regular') }}>
              advertisement</Text>
          </View>
        </View>
      </View>

      <BottomSheet
        snapTo="70"
        ref={bottomSheetRef}
        backGroundColor={Colors[theme].secondary}>
        <View
          style={{ paddingBottom: height > 800 ? height * 0.1 : height * 0.17 }}>
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

export default TrackPopupScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme].secondary,

    },
    imgContainer: {
      alignItems: 'center',
      flex: 1,
    },
    backBtn: {
      ...Platform.select({
        ios: {
          marginLeft: 20
        },
        android: {
          marginLeft: 20,
          marginTop: 42,
        }
      })
    },
    imageShadow: {
      borderRadius: 20,
      shadowColor: Colors[theme].text,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.35,
          shadowRadius: 4,
        },
        android: {
          elevation: 7,
        },
      }),
    },
    img: {

      height: "100%",
      alignSelf: 'center',
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
    },
    titleText: {
      // width: '80%',

      // height: 50,
      fontFamily: getFontFamily('bold'),
      textAlign: 'center',
      color: Colors[theme].text,
    },
    artistText: {
      // fontSize: 16,
      // width: '80%',

      // height: 70,
      fontFamily: getFontFamily('regular'),
      color: Colors[theme].text,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    contentContainer: {
      alignItems: 'center',
      bottom: 0,
      flex: 3.2,
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

      fontFamily: getFontFamily('regular'),
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
      color: Colors[theme].text,
      fontFamily: getFontFamily('regular'),
      // fontSize: 14,
    },
    chooseFromBtn: {
      backgroundColor: Colors[theme].secondary,

      justifyContent: 'center',


    },
    suffelIcon: {
      width: 30,
      height: 30,
    },
    progressBarContainer: {
      alignItems: 'center',

    },

    safeAreaView: {
      position: 'absolute',
      zIndex: 10,
      width: '100%',
      flexDirection: 'row',

      alignItems: 'center',

    },

  });
