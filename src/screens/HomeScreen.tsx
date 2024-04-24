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
import {images, menus, movies} from '../utils/constants';
import {Movies} from '../components/commons/Movies';
import ImageSlider from '../components/commons/ImageSlider';
import Animated from 'react-native-reanimated';
import {CustomButton} from '../components/utils';
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
  const styles = styling(theme);

  const handleNavigate = (link: string) => {
    if (link === 'Home' || link === 'Audios' || link === 'Pdf') {
      navigation.navigate(link);
    } else {
      // Assuming the link is not predefined in the native stack typescript interface
      console.log('The link is not provided in the stack navigation');
    }
  };

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <StatusBar translucent backgroundColor={'transparent'} />

        {/**header bar */}
        {/* <SafeAreaView style={styles.topView}>
          <CustomButton
            icon={
              <AntDesign
                name="menu-fold"
                size={30}
                color={Colors[theme].text}
              />
            }
            onPress={navigation.openDrawer}
            customButtonStyle={styles.btn}
          />
        </SafeAreaView> */}
        <View>
          <ImageSlider images={images} />
        </View>
        {/* Menu Components  */}
        <View style={styles.menuContainer}>
          {menus?.map(menu => (
            <TouchableOpacity
              style={styles.menu}
              key={menu.id}
              onPress={() => handleNavigate(menu.link)}>
              {/* use only fontawesome icon */}
              <FontAwesome
                name={menu.icon}
                size={30}
                color={Colors[theme].text}
              />
              <Text style={{color: Colors[theme].text}}>{menu.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* audios  */}
        <Audios />
        {/* Dhamma movies  */}
        <Movies data={movies} navigation={navigation} />
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
      marginTop: Platform.OS === 'ios' ? 8 : 42,
    },
    topView: {
      position: 'absolute',
      left: 10,
      zIndex: 10,
    },
    menuContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 10,
      columnGap: 10,
      marginVertical: 20,
    },
    menu: {
      backgroundColor: Colors[theme].secondary_dark,
      borderRadius: 10,
      width: '45%',
      height: 70,
      padding: 5,
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    audiosContainer: {
      marginVertical: 20,
    },
    moviesContainer: {
      width: '100%',
    },
    movie: {
      width: '30%',
      backgroundColor: 'gray',
      height: '100%',
    },
    btn: {
      width: 45,
      height: 45,
      borderRadius: 10,
      backgroundColor: Colors[theme]?.secondary,
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default HomeScreen;
