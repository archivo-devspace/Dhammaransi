import React, {useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from 'react-native';

import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
import {FontAwesome} from '../utils/common';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {BANNER_H, images, menus, movies} from '../utils/constants';
import {Movies} from '../components/commons/Movies';
import ImageSlider from '../components/commons/ImageSlider';
import Audios from '../components/commons/Audio';
import TopNavigation from '../components/commons/TopNavigation';
import {useNavigation} from '@react-navigation/native';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const HomeScreen: React.FC<Props> = ({navigation}: Props) => {
  // const navigation = useNavigation()
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const scrollA = useRef(new Animated.Value(0)).current;

  const customHeight = height * 0.35;

  console.log('theme', theme);

  const handleNavigate = (link: string) => {
    if (link === 'Home' || link === 'Audios' || link === 'Pdf') {
      navigation.navigate(link);
    } else {
      console.log('The link is not provided in the stack navigation');
    }
  };

  const styles = styling(theme);

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        barStyle={'default'}
        backgroundColor={'transparent'}
      />
      <TopNavigation title="Home" scrollA={scrollA} />
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {
            useNativeDriver: true,
          },
        )}
        scrollEventThrottle={16}>
        <View style={styles.bannerContainer}>
          <Animated.View
            style={[styles.banner(scrollA), {height: customHeight - 16}]}>
            <ImageSlider images={images} />
          </Animated.View>
        </View>
        <View
          style={{
            backgroundColor: Colors[theme]?.secondary,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
          }}>
          <View style={styles.menuContainer}>
            {menus?.map(menu => (
              <TouchableOpacity
                style={[
                  styles.menu,
                  {height: width < 500 ? height * 0.1 : height * 0.11},
                ]}
                key={menu.id}
                onPress={() => handleNavigate(menu.link)}>
                <FontAwesome
                  name={menu.icon}
                  size={30}
                  color={Colors[theme].text}
                />
                <Text style={{color: Colors[theme].text}}>{menu.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Audios />
          <Movies data={movies} navigation={navigation} />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec
            dui libero. Vivamus vehicula faucibus ipsum, eget semper est
            fermentum sit amet. Donec non mauris a arcu tempor finibus. Sed nec
            tellus ultrices, fringilla purus eget, dictum leo. Cras non est
            nulla. Duis nec purus eget ex cursus fringilla. Fusce auctor
            suscipit diam id fermentum. Nullam et orci sed urna convallis
            tristique. Donec nec ipsum sed libero pulvinar lacinia. Mauris nec
            odio eget nisi rutrum ultricies. Fusce lobortis fermentum diam, eu
            luctus elit tristique vel. Nullam nec vehicula purus. Donec nec
            ullamcorper magna. Vivamus ut urna feugiat, interdum dui in,
            volutpat magna. Nulla facilisi. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Nulla nec dui libero. Vivamus vehicula
            faucibus ipsum, eget semper est fermentum sit amet. Donec non mauris
            a arcu tempor finibus. Sed nec tellus ultrices, fringilla purus
            eget, dictum leo. Cras non est nulla. Duis nec purus eget ex cursus
            fringilla. Fusce auctor suscipit diam id fermentum. Nullam et orci
            sed urna convallis tristique. Donec nec ipsum sed libero pulvinar
            lacinia. Mauris nec odio eget nisi rutrum ultricies. Fusce lobortis
            fermentum diam, eu luctus elit tristique vel. Nullam nec vehicula
            purus. Donec nec ullamcorper magna. Vivamus ut urna feugiat,
            interdum dui in, volutpat magna. Nulla facilisi.
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
      backgroundColor: Colors[theme]?.primary,
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

      padding: 5,
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bannerContainer: {
      marginTop: -1000,
      paddingTop: 1000,
      alignItems: 'center',
      overflow: 'visible',
    },
    banner: (scrollA: Animated.Value) => ({
      width: '100%',
      transform: [
        {
          translateY: scrollA.interpolate({
            inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
            outputRange: [-BANNER_H / 2, 0, BANNER_H * 0.75, BANNER_H * 0.75],
          }),
        },
        {scale: 1},
      ],
    }),
  });

export default HomeScreen;
