/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Platform,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';

import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
import {FontAwesome, getFontFamily} from '../utils/common';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {menus} from '../utils/constants';
import {Movies} from '../components/commons/Movies';
import ImageSlider from '../components/commons/ImageSlider';
import Audios from '../components/commons/Audio';
import TopNavigation from '../components/commons/TopNavigation';

import {useTranslation} from 'react-i18next';
import {useGetPaintings} from '../api_services/lib/queryhooks/usePainting';
import {useGetAlbums} from '../api_services/lib/queryhooks/useAudio';
import {useGetHomeData} from '../api_services/lib/queryhooks/useHome';
import CustomAlert from '../components/commons/CustomAlert';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const HomeScreen = ({navigation}: Props) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const {top} = useSafeAreaInsets();
  const {t} = useTranslation();
  const scrollA = useRef(new Animated.Value(0)).current;
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const customHeight = height * 0.35;

  const BANNER_H = height * 0.4;

  const styles = styling(theme);

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
    // isError: isHomeDataError,
  } = useGetHomeData();

  const bannerImages = homeData?.data?.results?.banners?.map(img => img.file);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true); // Start refreshing
    try {
      // Refresh both paintings and albums
      await Promise.all([albumsRefresh(), paintingRefresh()]);
    } catch (error) {
      console.error('Refresh error:', error);
      // Optionally handle error
    } finally {
      setRefreshing(false); // Stop refreshing regardless of success or failure
    }
  }, [albumsRefresh, paintingRefresh]);

  const handleNavigation = (link: any) => {
    link ? navigation.navigate(link) : setIsAlertVisible(true);
  };

  return (
    <View style={[styles.mainContainer]}>
 {/* <StatusBar
          barStyle='default'
          backgroundColor={Colors[theme].secondary}
          
        /> */}
      <TopNavigation
        title={t('TITLES.HOME')}
        scrollA={scrollA}
        statusBar={true}
      />

      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {
            useNativeDriver: true,
          },
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={60}
            tintColor={Colors[theme].primary}
            colors={[Colors[theme].primary]}
            style={{zIndex: 10}}
            progressBackgroundColor={Colors[theme].secondary}
          />
        } // Add RefreshControl here
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
            {isHomeDataLoading ? (
              <View style={styles.loadingContainer}>
                <Text>{t('LOADING')}</Text>
              </View>
            ) : (
              <ImageSlider images={bannerImages} />
            )}
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
            gap: 16,
          }}>
          <View style={styles.menuContainer}>
            {menus?.map(menu => (
              <TouchableOpacity
                style={[
                  styles.menu,
                  {height: width < 500 ? height * 0.12 : height * 0.13},
                ]}
                key={menu.id}
                onPress={() => handleNavigation(menu.link)}>
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
  });

export default HomeScreen;
