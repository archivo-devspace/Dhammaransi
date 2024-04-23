import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  ImageSourcePropType,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useNavigation, NavigationProp} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
// import {theme} from '../theme';
import {AntDesign, FontAwesome} from '../utils/common';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {images, movies} from '../utils/constants';
import {Movies} from '../components/commons/Movies';
import ImageSlider from '../components/commons/ImageSlider';
import Animated from 'react-native-reanimated';
import Audios from '../components/commons/Audio';

export type ApiResponse<T> = {
  page: number;
  results: Array<T>;
  total_pages: number;
  total_results: number;
};

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'] & {
    openDrawer?: () => void; // Add openDrawer function to the navigation prop type
  };
};

const HomeScreen = ({navigation}: Props) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();

  // console.log('theme', theme);
  const styles = styling(theme);
  // const scrollA = useRef(new Animated.Value(0)).current;
  return (
    <>
      <ScrollView
        style={styles.mainContainer}
        // onScroll={Animated.event([
        // {nativeEvent: {contentOffset:{y:scrollA}}}
        // ])}
      >
        <StatusBar translucent backgroundColor={'transparent'} />

        {/**header bar */}
        <SafeAreaView style={styles.topView}>
          <FontAwesome
            size={30}
            name="indent"
            color={Colors[theme].primary}
            onPress={navigation.openDrawer}
            style={styles.topView}
          />
        </SafeAreaView>
        <View>
          <ImageSlider images={images} />
        </View>
        {/* Dhamma movies  */}
        <Movies data={movies} navigation={navigation} />
        {/* Audios  */}
        <Audios />
      </ScrollView>
    </>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
    },
    safeAreaView: {
      marginBottom: Platform.OS === 'ios' ? 8 : 12,
    },
    topView: {
      position: 'absolute',
      top: 20,
      left: 2,
      zIndex: 10,
    },
    text: {},

    bannerContainer: {
      flex: 0,
    },
    moviesContainer: {
      width: '100%',
    },
    movie: {
      width: '30%',
      backgroundColor: 'gray',
      height: '100%',
    },
    image: {},
    audiosContainer: {},
  });

export default HomeScreen;
