import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import Slider from '@react-native-community/slider';
import {CustomButton} from '../components/utils';
import {Entypo, MaterialIcon} from '../utils/common';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../navigations/StackNavigation';
import {NavigationMainBottomTabScreenProps} from '../navigations/BottomNavigation';
import BottomSheet, {
  BottomSheetMethods,
} from '../components/commons/bottomSheet';
import {useTrackContext} from '../contexts/TrackContext';

type Props = {
  route: RouteProp<MainStackParamList, 'Track'>;
  navigation: NavigationMainBottomTabScreenProps['navigation'];
};

const TrackScreen = ({route, navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const {playingTrackLists} = useTrackContext();
  const {width, height} = useWindowDimensions();
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const {trackLists, repeatIcon, changeRepeatMode} = useTrackContext();

  const [currentTack, setCurrentTrack] = useState<any>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isItem, setIsItem] = useState(null);

  // const item = route.params?.item;

  const styles = styling(theme);
  const {top} = insets;

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const expandHandler = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  // useLayoutEffect(() => {
  //   setIsItem(item);
  // }, [item]);

  // useEffect(() => {
  //   const initializePlayer = async (item: any) => {
  //     setCurrentTrack(item);

  //     await TrackPlayer.reset();
  //     await TrackPlayer.add({
  //       url: item?.url,
  //       title: item?.name,
  //       artist: item?.artist,
  //       artwork: item?.artwork,
  //     });
  //     await TrackPlayer.play();
  //   };

  //   initializePlayer(isItem);
  // }, [isItem]);

  // useEffect(() => {
  //   const updateTrackInfo = async () => {
  //     const currentTrackId = await TrackPlayer.getActiveTrack();
  //     setCurrentTrackTitle(currentTrackId?.title);
  //   };

  //   updateTrackInfo();
  // }, [playbackState.state]);

  TrackPlayer.updateOptions({
    // Media controls capabilities
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],

    // Capabilities that will show up when the notification is in the compact form on Android
    compactCapabilities: [Capability.Play, Capability.Pause],
  });

  const handleNextTrack = async () => {
    await TrackPlayer.skipToNext();
  };

  const handlePrevTrack = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const togglePlayback = async (playbackState: any) => {
    if (playbackState.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <StatusBar backgroundColor={Colors[theme].secondary} />

      <SafeAreaView style={{flex: 1.5, paddingTop: top}}>
        <View style={styles.imgContainer}>
          <View
            style={[
              styles.imageShadow,
              {width: width / 1.3, height: height / 2.5},
            ]}>
            <Image
              source={
                currentTack
                  ? currentTack?.artwork
                  : require('../assets/marguerite.jpg')
              }
              resizeMode="cover"
              style={styles.img}
            />
          </View>
          <Text style={styles.titleText}>{currentTack?.title}</Text>
          <Text style={styles.artistText}>{currentTack?.artist}</Text>
        </View>
      </SafeAreaView>
      <BottomSheet
        snapTo="70"
        ref={bottomSheetRef}
        backGroundColor={Colors[theme].secondary}>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur
          incidunt cumque ipsa blanditiis, dolorum magnam molestiae sint, libero
          ipsum suscipit saepe molestias voluptates nemo tenetur ullam provident
          asperiores dolore rerum! Rem nam laboriosam rerum in repellendus? Nam
          molestiae rem dignissimos officia. Quibusdam, illum facere eum ratione
          officia voluptatibus dignissimos perferendis quam. Odio fuga
          dignissimos, magnam repellendus beatae qui distinctio eaque facere
          iusto, a dolore fugit! Debitis quaerat nobis, inventore porro
          voluptatem at consequuntur nulla quae amet soluta accusantium eos eum
          nostrum, excepturi sequi. Perspiciatis saepe, necessitatibus sapiente
          corporis blanditiis dolores iste enim, officia ratione nemo quibusdam
          repellat nobis! Ea eos soluta sed fugiat placeat necessitatibus
          repellendus laboriosam amet, enim eum? Corporis excepturi eius illo
          amet commodi repudiandae, inventore in velit architecto dolorum quas
          animi. Doloribus debitis consequatur nisi laboriosam rerum in sunt
          incidunt quibusdam, doloremque alias omnis necessitatibus, magni amet
          repellat, id inventore. Quasi impedit nam quam, sed expedita velit,
          quo, quas sapiente aperiam alias dolorum? Quam commodi temporibus vel
          fugiat fugit molestiae dolor accusamus repellat voluptatibus
          voluptatem repudiandae debitis fuga et mollitia, quo, dicta laborum
          saepe sint necessitatibus natus! Odio labore, eius porro repudiandae
          eum ea fuga fugit ducimus et quisquam id cumque! Dignissimos
          laudantium commodi ex assumenda eos perferendis fuga repellendus,
          impedit nemo magni velit molestias, dicta similique harum ullam sed
          quos nesciunt quibusdam exercitationem tempore minima, aspernatur nisi
          veniam quaerat! Quisquam optio non earum hic reiciendis provident
          sapiente, quos eligendi ipsam? Fuga voluptatum laboriosam minus, eos,
          unde consectetur sunt voluptatem iusto consequuntur tempora et!
          Suscipit alias ullam doloremque a! Eaque cupiditate unde ad similique
          distinctio debitis quia? Reprehenderit dolorem, perspiciatis
          necessitatibus itaque id eveniet earum aliquam officia rem corporis
          facilis nesciunt voluptate molestiae, ipsum doloribus placeat
          incidunt? Illum voluptates recusandae, in, aliquid excepturi quae,
          aspernatur laboriosam obcaecati similique odit minima commodi a
          aliquam magnam nobis at quas? Error neque culpa, dolor at totam illo
          in quis ut. Placeat aliquam dolorem amet reprehenderit quo magnam
          omnis, repellendus natus id voluptas. Quod qui error quo cum obcaecati
          nam facere asperiores repudiandae? Officia ipsam fugit eos nobis,
          harum labore, adipisci reiciendis natus eum tenetur quam esse ut optio
          expedita dolorum libero obcaecati autem ea facilis cumque quos!
          Deleniti natus voluptas ipsa quis est hic officia, magnam voluptate
          autem dolorum provident praesentium, dolore dignissimos ut illum
          assumenda suscipit illo dicta sit. Suscipit quibusdam numquam
          asperiores quam vero consequuntur amet aliquid sunt ratione soluta cum
          voluptates, voluptatum dicta, ea rerum illo hic! Sapiente repudiandae
          harum odit natus consequatur pariatur aut explicabo doloremque
          cupiditate laborum in quis, laboriosam error, consequuntur, animi
          reiciendis sint placeat id obcaecati consectetur aperiam magni
          quisquam! Rerum mollitia ut aliquam quis. Nulla repellendus, labore
          nisi libero vero maxime quaerat consequuntur natus temporibus, officia
          ab? Molestias omnis distinctio nam error voluptatibus aspernatur
          repellat sit ad architecto hic! Maiores ex quasi nostrum perspiciatis
          quo, temporibus perferendis nihil tenetur officiis amet fugiat,
          suscipit quibusdam aut minima velit sed soluta, numquam officia fuga
          nam. Aliquid dolor debitis, eveniet nobis ad nostrum dolorum.
          Asperiores fugiat consequatur sequi cum obcaecati consectetur labore
          eaque voluptatum corrupti.
        </Text>
      </BottomSheet>
      <View style={styles.contentContainer}>
        {/* scroll bar  */}

        <View style={styles.trackContainer}>
          <Slider
            style={{width: '100%', height: 40}}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
            minimumTrackTintColor={Colors[theme].primary_dark}
            maximumTrackTintColor={Colors[theme].text}
          />
          <View style={styles.trackDuration}>
            <Text style={styles.durationText}>
              {new Date(progress.duration * 1000).toISOString().substr(14, 5)}
            </Text>
            <Text style={styles.durationText}>
              {new Date((progress.duration - progress.position) * 1000)
                .toISOString()
                .substr(14, 5)}
            </Text>
          </View>
        </View>
        {/* play button  */}
        <View style={styles.buttonContainer}>
          <CustomButton
            customButtonStyle={styles.btn}
            icon={
              <MaterialIcon
                name={`${repeatIcon()}`}
                size={30}
                color={Colors[theme].text}
              />
            }
            onPress={changeRepeatMode}
          />
          <CustomButton
            onPress={handlePrevTrack}
            customButtonStyle={styles.btn}
            icon={
              <Entypo
                name={`controller-jump-to-start`}
                size={45}
                color={Colors[theme].text}
              />
            }
          />
          <CustomButton
            customButtonStyle={styles.btn}
            onPress={() => togglePlayback(playbackState)}
            icon={
              <Entypo
                name={
                  playbackState.state === State.Playing
                    ? 'controller-paus'
                    : 'controller-play'
                }
                size={70}
                color={Colors[theme].text}
              />
            }
          />
          <CustomButton
            onPress={handleNextTrack}
            customButtonStyle={styles.btn}
            icon={
              <Entypo
                name={`controller-next`}
                size={45}
                color={Colors[theme].text}
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
                color={Colors[theme].text}
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
      gap: 14,
      paddingVertical: 30,
    },
    imageShadow: {
      borderRadius: 20,
      shadowColor: Colors[theme].text,
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
      borderRadius: 20,
    },
    titleText: {
      fontSize: 20,
      width: '80%',
      height: 50,
      fontWeight: 'bold',

      textAlign: 'center',
      marginTop: 16,
      color: Colors[theme].text,
    },
    artistText: {
      fontSize: 16,
      width: '80%',
      height: 50,

      color: Colors[theme].text,
      textAlign: 'center',
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
      height: 100,
    },
    trackDuration: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: '4%',
    },
    durationText: {
      color: Colors[theme].text,
      fontSize: 14,
      fontWeight: 'bold',
    },
    btn: {
      backgroundColor: Colors[theme].secondary,
    },
    buttonContainer: {
      justifyContent: 'center',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
  });
