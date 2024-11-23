/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StatusBar,
  RefreshControl,
  Alert,
  Vibration,
} from 'react-native';

import { NavigationMainStackScreenProps } from '../navigations/StackNavigation';
import { Feather, FontAwesome, getFontFamily } from '../utils/common';
import { Theme, useThemeContext } from '../contexts/ThemeContext';
import { Colors } from '../theme';
import { menus } from '../utils/constants';
import { Movies } from '../components/commons/Movies';
import ImageSlider from '../components/commons/ImageSlider';
import Audios from '../components/commons/Audio';
import TopNavigation from '../components/commons/TopNavigation';

import { useTranslation } from 'react-i18next';
import { useGetPaintings } from '../api_services/lib/queryhooks/usePainting';
import { useGetAlbums } from '../api_services/lib/queryhooks/useAudio';
import { useGetHomeData } from '../api_services/lib/queryhooks/useHome';
import CustomAlert from '../components/commons/CustomAlert';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import SkeletonView from '../components/commons/Skeleton';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const HomeScreen = ({ navigation }: Props) => {
  const { theme } = useThemeContext();
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const styles = styling(theme, top);

  //api call with react query
  const {
    data: paintings,
    isFetched: isPaintingFetch,
    isLoading: isPaintingLoading,
    isError: isPaintingError,
    error: paintingErrorMessage,
    refetch: paintingRefresh,
  } = useGetPaintings(1);

  const {
    data: albums,
    isFetched: isAlbumsFetched,
    isLoading: isAlbumsLoading,
    isError: isAlbumsError,
    error: albumsErrorMessage,
    refetch: albumsRefresh,
  } = useGetAlbums(1);

  const {
    data: homeData,
    isLoading: isHomeDataLoading,
    isError: isHomeDataError,
    refetch: homeRefresh
  } = useGetHomeData();

  const bannerImages = homeData?.data?.results?.banners?.map(img => img.file);

  const [refreshing, setRefreshing] = useState(false);
  const [viewHeight, setViewHeight] = useState(0);

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setViewHeight(height);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true); // Start refreshing
    try {
      // Refresh both paintings and albums
      await Promise.all([homeRefresh(), albumsRefresh(), paintingRefresh()]);
    } catch (error) {
      console.error('Refresh error:', error);
      // Optionally handle error
    } finally {
      setRefreshing(false); // Stop refreshing regardless of success or failure
    }
  }, [homeRefresh, albumsRefresh, paintingRefresh]);

  const handleNavigation = (link: any) => {
    link ? navigation.navigate(link) : setIsAlertVisible(true);
  };

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





  return (
    <View style={[styles.mainContainer]}>
      <StatusBar
        barStyle='default'
        backgroundColor="transparent"
        translucent
      />
      <Animated.View onLayout={handleLayout} style={[styles.header, { width: width }]}>
        <Text style={[{ alignSelf: 'center', textAlign: 'center', color: Colors[theme].text, fontSize: height * 0.025, paddingVertical: 10, paddingHorizontal: 10, fontFamily: getFontFamily('bold') }]}>{t('TITLES.HOME')}</Text>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef} scrollEventThrottle={16} showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={80}
            tintColor={Colors[theme].primary}
            colors={[Colors[theme].primary]}
            style={{ zIndex: 10 }}
            progressBackgroundColor={Colors[theme].secondary}
          />
        }
      >
        <View style={styles.bannerContainer}>
          <Animated.View
            style={[
              imageAnimatedStyle,
              {
                width: '100%',
                paddingTop: viewHeight - 6
              },

            ]}>
            {isHomeDataLoading ? (
              <View style={[styles.loadingContainer, { height: height * 0.36 }]}>
                <SkeletonView height={height * 0.36} width={width} />
                <Text style={{ color: Colors[theme].text, position: 'absolute' }}>{t('Loading...')}</Text>

              </View>
            ) : isHomeDataError ? (
              <View style={[styles.loadingContainer, { height: height * 0.36 }]}>
                <Feather
                  name="wifi-off"
                  size={height * 0.035}
                  color={Colors[theme].primary}
                />
                <Text style={{ color: Colors[theme].text }}>{t('UTILS.FETCH_FAILED')}</Text>
              </View>
            ) : (
              <ImageSlider images={bannerImages} />
            )}
          </Animated.View>
        </View>
        <View
          style={{
            backgroundColor: Colors[theme]?.secondary,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            paddingBottom: 75,
            gap: 16,
          }}>
          <View style={styles.menuContainer}>
            {menus?.map(menu => (
              <TouchableOpacity
                style={[
                  styles.menu,
                  { height: width < 500 ? height * 0.12 : height * 0.13 },
                ]}
                key={menu.id}
                onPress={() => { Vibration.vibrate(5); handleNavigation(menu.link) }}>
                <FontAwesome
                  name={menu.icon}
                  size={25}
                  color={Colors[theme].primary}
                />
                <Text
                  style={{
                    color: Colors[theme].text,
                    fontSize: height * 0.02,
                    // fontWeight: '700',
                    fontFamily: getFontFamily('regular'),
                    // opacity: 0.8,
                    textAlign: 'center',
                  }}>
                  {t(menu.name)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Movies
            data={paintings?.data.results.data}
            navigation={navigation}
            isLoading={isPaintingLoading}
            isFetched={isPaintingFetch}
            isError={isPaintingError}
            error={paintingErrorMessage}
          />

          <Audios
            isFetched={isAlbumsFetched}
            data={albums?.data?.results?.data}
            navigation={navigation}
            isLoading={isAlbumsLoading}
            isError={isAlbumsError}
            error={albumsErrorMessage}
          />
        </View>
      </Animated.ScrollView>

      <CustomAlert
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
        title={'Feature Coming Soon'}
        message={'Thanks for letting us know'}
        btnText="Ok"
        type={'warning'}
      />
    </View>
  );
};

const styling = (theme: Theme, top: number) =>
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
      marginVertical: 18,
    },
    menu: {
      backgroundColor: Colors[theme].secondary_light,
      borderRadius: 10,
      width: '45%',
      shadowColor: Colors[theme].secondary_dark,
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
          elevation: 2,
        },
      }),
      padding: 5,
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bannerContainer: {
      alignItems: 'center',
      overflow: 'visible',
    },
    header: {
      ...Platform.select({
        ios: {
          paddingTop: top,
        },
        android: {
          paddingTop: top
        }
      }),
      display: 'flex',
      position: 'absolute',
      backgroundColor: Colors[theme].secondary,
      zIndex: 1,
      top: 0,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      borderColor: Colors[theme].secondary_dark,
      borderWidth: 1,
      height: "auto"
    },
  });

export default HomeScreen;
