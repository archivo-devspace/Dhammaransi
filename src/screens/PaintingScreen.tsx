import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {useTranslation} from 'react-i18next';
import StackNavigation, {
  MainStackParamList,
  NavigationMainStackScreenProps,
} from '../navigations/StackNavigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  RouteProp,
  StackActions,
  StackRouter,
  useNavigation,
} from '@react-navigation/native';
import {Colors} from '../theme';
import TopNavigation from '../components/commons/TopNavigation';
import Slider from '@react-native-community/slider';
import {AntDesign, Entypo, MaterialIcons} from '../utils/common';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import {CustomButton} from '../components/utils';
import {useTrackContext} from '../contexts/TrackContext';
import {useGetSinglePainting} from '../api_services/lib/queryhooks/usePainting';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import {
  ScreenStack,
  ScreenStackHeaderBackButtonImage,
} from 'react-native-screens';

export interface PaintingScreenProps {
  route: RouteProp<MainStackParamList, 'PaintingScreen'>;
  navigation: NavigationMainStackScreenProps['navigation'];
}

const PaintingScreen = ({route}: PaintingScreenProps) => {
  const {theme} = useThemeContext();
  const playbackState = usePlaybackState();
  const styles = styling(theme);
  const {t} = useTranslation();
  const {width, height} = useWindowDimensions();
  const progress = useProgress();
  const navigation = useNavigation();

  const {
    handlePlay,
    trackLists,
    setTrackLists,
    togglePlayingMode,
    getTrackDuration,
  } = useTrackContext();
  // const scrollA = useRef(new Animated.Value(0)).current;

  const customHeight = height * 0.39;

  const {data, isLoading, isFetched, isError} = useGetSinglePainting(
    route.params.id,
  );

  const paintingDetails = data?.data?.results[0];

  const sameTrackExit = () => {
    const sameTrack = trackLists.find(
      track => track.id === paintingDetails?.id,
    );
    return sameTrack ? true : false;
  };

  const initializeTrack = () => {
    const track = {
      id: paintingDetails?.id as number,
      url: paintingDetails?.details[1]?.file as string,
      title: paintingDetails?.title as string,
      artwork: paintingDetails?.details[0].file,
      artist: 'Ashin Joti Sara',
      date: paintingDetails?.created_at.split(' ')[0] as string,
    };
    setTrackLists([track]);
  };

  useEffect(() => {
    if (!isLoading && isFetched && !isError && data) {
      const sameTrack = sameTrackExit();
      if (!sameTrack) {
        TrackPlayer.reset();
        initializeTrack();
      }
    }
  }, [isFetched, data, isLoading, isError]);

  const handlePlayTrack = () => {
    const sameTrack = sameTrackExit();
    if (sameTrack && progress.position === 0) {
      handlePlay(paintingDetails?.id as number);
    }
    togglePlayingMode();
  };

  const Stack = createNativeStackNavigator();
  const IMG_HEIGHT = height * 0.39;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOfset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOfset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOfset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOfset.value, [0, IMG_HEIGHT / 2], [0, 1]),
    };
  });
  return (
    // <ScrollView style={styles.mainContainer}>
    //   <StatusBar barStyle={'default'} />
    //   {/* <TopNavigation
    //     statusBar={true}
    //     title={t('TITLES.HOME')}
    //     scrollA={scrollA}
    //     backBtn={true}
    //   /> */}
    //   <CustomButton
    //     onPress={() => navigation.goBack()}
    //     icon={
    //       <AntDesign
    //         name={'arrowleft'}
    //         size={height * 0.04}
    //         color={Colors[theme].primary}
    //       />
    //     }
    //     gap={5}
    //     customButtonStyle={styles.btnArrow}
    //   />
    //   {isLoading ? (
    //     <View style={styles.skeletonContainer}>
    //       <View style={styles.skeletonImage} />
    //       <View style={styles.skeletonText} />
    //       <View style={styles.skeletonTextSmall} />
    //     </View>
    //   ) : (
    //     <View>
    //       <View style={[styles.bannerContainer, {height: customHeight}]}>
    //         <Image
    //           source={{uri: paintingDetails?.details[0].file}}
    //           style={{width: '100%', height: customHeight}}
    //         />
    //       </View>

    //       <View
    //         style={{
    //           backgroundColor: Colors[theme]?.secondary,
    //           borderTopRightRadius: 16,
    //           borderTopLeftRadius: 16,
    //           paddingBottom: 10,
    //           borderColor: Colors[theme]?.secondary_dark,
    //           borderTopWidth: 1,
    //           borderLeftWidth: 1,
    //           borderRightWidth: 1,
    //           gap: 10,
    //         }}>
    //         <View style={{alignItems: 'center', gap: 10}}>
    //           <Text style={styles.paintingTitle}>{paintingDetails?.title}</Text>

    //           <View
    //             style={{
    //               width: width * 0.96,
    //               borderColor: Colors[theme]?.text,
    //               borderBottomWidth: 1,
    //             }}
    //           />

    //           {/* Music  */}
    //           <View style={[{width: width * 0.98}, styles.musicContainer]}>
    //             <Slider
    //               value={progress.position}
    //               minimumValue={0}
    //               maximumValue={progress.duration}
    //               thumbTintColor={Colors[theme].primary}
    //               onSlidingComplete={async value => {
    //                 await TrackPlayer.seekTo(value);
    //                 await TrackPlayer.play();
    //               }}
    //               minimumTrackTintColor={Colors[theme].primary}
    //               maximumTrackTintColor={Colors[theme].text}
    //             />
    //             <View style={styles.trackDuration}>
    //               <Text style={styles.durationText}>
    //                 {new Date(progress.position * 1000)
    //                   .toISOString()
    //                   .substr(14, 5)}
    //               </Text>
    //               <Text style={styles.durationText}>
    //                 {getTrackDuration(progress)}
    //               </Text>
    //             </View>
    //             <CustomButton
    //               customButtonStyle={styles.btn}
    //               onPress={handlePlayTrack}
    //               icon={
    //                 playbackState.state === State.Playing ? (
    //                   <MaterialIcons
    //                     name={'pause-circle'}
    //                     size={height * 0.06}
    //                     style={{elevation: 2}}
    //                     color={Colors[theme].primary}
    //                   />
    //                 ) : playbackState.state === State.Paused ? (
    //                   <MaterialIcons
    //                     name={'play-circle'}
    //                     size={height * 0.06}
    //                     style={{elevation: 2}}
    //                     color={Colors[theme].primary}
    //                   />
    //                 ) : playbackState.state === State.Ready ||
    //                   playbackState.state === State.Buffering ? (
    //                   <LoadingSpinner
    //                     durationMs={1500}
    //                     bgColor={Colors[theme].secondary_dark}
    //                     color={Colors[theme].primary}
    //                     loaderSize={height * 0.06}
    //                     loadingText="connecting"
    //                     loadingTextColor={Colors[theme].primary}
    //                     loadingTextSize={6}
    //                   />
    //                 ) : (
    //                   <Entypo
    //                     name={'controller-stop'}
    //                     size={height * 0.06}
    //                     style={{elevation: 2}}
    //                     color={Colors[theme].primary}
    //                   />
    //                 )
    //               }
    //             />
    //           </View>

    //           {/* Description */}
    //           <View
    //             style={{
    //               width,
    //               padding: 10,
    //               paddingBottom: 20,
    //             }}>
    //             <Text
    //               style={{
    //                 textAlign: 'center',
    //                 letterSpacing: 3,
    //                 color: Colors[theme]?.text,
    //               }}>
    //               {paintingDetails?.description}
    //             </Text>
    //           </View>
    //         </View>
    //       </View>
    //     </View>
    //   )}
    // </ScrollView>
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={[styles.header]} />
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.Image
          source={{uri: paintingDetails?.details[0].file}}
          style={[
            {
              width: width,
              height: height * 0.4,
              resizeMode: 'stretch',
            },
            imageAnimatedStyle,
          ]}
        />
        <View
          style={{
            height: 2000,
            backgroundColor: Colors[theme].secondary,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 10,
              color: Colors[theme].text,
            }}>
            Lorem
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: 'white', //for the top border radius of the content under image
    },
    skeletonContainer: {
      padding: 20,
      alignItems: 'center',
    },
    skeletonImage: {
      width: '100%',
      height: 200,
      backgroundColor: Colors[theme]?.secondary_dark,
      borderRadius: 10,
      marginBottom: 20,
    },
    skeletonText: {
      width: '80%',
      height: 20,
      backgroundColor: Colors[theme]?.secondary_dark,
      borderRadius: 5,
      marginBottom: 10,
    },
    skeletonTextSmall: {
      width: '50%',
      height: 15,
      backgroundColor: Colors[theme]?.secondary_dark,
      borderRadius: 5,
    },
    bannerContainer: {
      alignItems: 'center',
      overflow: 'visible',
    },
    paintingTitle: {
      marginTop: 5,
      textAlign: 'center',
      fontSize: 20,
      color: Colors[theme]?.text,
    },
    musicContainer: {
      padding: 20,
      borderColor: Colors[theme]?.primary,
      borderWidth: 1,
      borderRadius: 30,
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
    btnArrow: {
      left: 16,
      position: 'absolute',
      paddingTop: 50,
      zIndex: 1,
    },

    container: {
      flex: 1,
      backgroundColor: Colors[theme].secondary,
    },
    header: {
      position: 'absolute',

      backgroundColor: 'red',
      height: 100,
      zIndex: 100,
    },
  });

export default PaintingScreen;
