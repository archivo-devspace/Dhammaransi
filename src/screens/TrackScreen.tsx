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
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import {BottomSheetMethods} from '../components/commons/bottomSheet';
import RenderItem from '../components/commons/RenderItem';
import BottomSheet from '../components/commons/bottomSheet';
import {CustomButton} from '../components/utils';
import {Entypo, FontAwesome, MaterialIcon} from '../utils/common';
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
    playingIcon,
    changeRepeatMode,
    togglePlayingMode,
    handleNextTrack,
    handlePrevTrack,
    currentTrack,
  } = useTrackContext();

  const [currentActiveTrack, setCurrentActiveTrack] = useState<Track | null>(
    null,
  );

  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);

  const [icon, setIcon] = useState();

  useEffect(() => {
    MaterialIcon.getImageSource('circle', 20, Colors[theme].primary).then(
      setIcon,
    );
  }, []);

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
    <ScrollView style={styles.mainContainer}>
      <StatusBar backgroundColor={Colors[theme].secondary} />

      <View style={{flex: 1.5, paddingTop: top}}>
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

              height: 120,
            }}>
            {!currentTrack ? (
              <CustomButton
                title={t('UTILS.CHOOSEALBLUM')}
                customButtonStyle={styles.chooseFromBtn}
                customButtonTextStyle={styles.chooseFrom}
                onPress={() => navigation.navigate('Audios')}
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
        <RenderItem
          currentQueue={currentQueue}
          currentActiveTrack={currentActiveTrack}
          setCurrentActiveTrack={setCurrentActiveTrack}
          getCurrentActiveTrack={getCurrentActiveTrack}
        />
      </BottomSheet>
      <View style={styles.contentContainer}>
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
              <Entypo
                name={`${playingIcon()}`}
                size={65}
                style={{elevation: 2}}
                color={Colors[theme].primary}
              />
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
            customButtonStyle={styles.btn}
            onPress={expandHandler}
            icon={
              <MaterialIcon
                name={`playlist-music`}
                size={30}
                color={Colors[theme].primary}
              />
            }
          />
        </View>
      </View>
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
      paddingVertical: 30,
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
      flex: 1,
      alignItems: 'center',
      width: '100%',
      paddingBottom: 135,
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
  });
