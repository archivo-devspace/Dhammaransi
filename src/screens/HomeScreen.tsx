/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';

import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
import {FontAwesome} from '../utils/common';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {images, menus, movies} from '../utils/constants';
import {Movies} from '../components/commons/Movies';
import ImageSlider from '../components/commons/ImageSlider';
import Audios from '../components/commons/Audio';
import TopNavigation from '../components/commons/TopNavigation';

import {useTranslation} from 'react-i18next';
import {useGetPaintings} from '../api_services/lib/queryhooks/usePainting';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import {useGetAlbums} from '../api_services/lib/queryhooks/useAudio';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const HomeScreen = ({navigation}: Props) => {
  // const navigation = useNavigation();
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const {t} = useTranslation();
  const scrollA = useRef(new Animated.Value(0)).current;

  const customHeight = height * 0.3;

  const BANNER_H = height * 0.4;

  const styles = styling(theme);

  //api call with react query
  const {
    data: paintings,

    isLoading: isPaintingLoading,
  } = useGetPaintings();

  const {data: albums, isLoading: isAlbumsLoading} = useGetAlbums();

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        barStyle={'default'}
        backgroundColor={'transparent'}
      />

      <TopNavigation title={t('TITLES.HOME')} scrollA={scrollA} />

      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {
            useNativeDriver: true,
          },
        )}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}>
        <View style={styles.bannerContainer}>
          <Animated.View
            style={[
              {
                width: '100%',
                transform: [
                  {
                    translateY: scrollA.interpolate({
                      inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
                      outputRange: [
                        -BANNER_H / 2,
                        0,
                        BANNER_H * 0.75,
                        BANNER_H * 0.75,
                      ],
                    }),
                  },
                  {scale: 1},
                ],
              },
              {height: customHeight - 16},
            ]}>
            <ImageSlider images={images} />
          </Animated.View>
        </View>
        <View
          style={{
            backgroundColor: Colors[theme]?.secondary,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            paddingBottom: 75,
            borderColor: Colors[theme]?.secondary_dark,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            gap: 10,
          }}>
          <View style={styles.menuContainer}>
            {menus?.map(menu => (
              <TouchableOpacity
                style={[
                  styles.menu,
                  {height: width < 500 ? height * 0.1 : height * 0.11},
                ]}
                key={menu.id}
                onPress={() => navigation.navigate(menu.link as any)}>
                <FontAwesome
                  name={menu.icon}
                  size={height * 0.03}
                  color={Colors[theme].primary}
                />
                <Text
                  style={{
                    color: Colors[theme].text,
                    fontSize: height * 0.018,
                    opacity: 0.8,
                  }}>
                  {t(menu.name)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {isPaintingLoading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner
                durationMs={1500}
                loaderSize={50}
                bgColor={Colors[theme].secondary_dark}
                color={Colors[theme].primary_light}
                loadingText={t('UTILS.LOADING')}
                loadingTextColor={Colors[theme].primary}
                loadingTextSize={4}
              />
            </View>
          ) : (
            <Movies
              data={paintings?.data.results.data}
              navigation={navigation}
            />
          )}
          {isAlbumsLoading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner
                durationMs={1500}
                loaderSize={50}
                bgColor={Colors[theme].secondary_dark}
                color={Colors[theme].primary_light}
                loadingText={t('UTILS.LOADING')}
                loadingTextColor={Colors[theme].primary}
                loadingTextSize={4}
              />
            </View>
          ) : (
            <Audios
              data={albums?.data?.results?.data}
              navigation={navigation}
            />
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      gap: 20,
    },
    menuContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 14,
      columnGap: 14,
      marginVertical: 20,
    },
    menu: {
      backgroundColor: Colors[theme].secondary_light,
      borderRadius: 10,
      width: '45%',
      shadowColor: Colors[theme].text,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.4,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
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
  });

export default HomeScreen;
