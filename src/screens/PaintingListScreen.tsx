import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import Container from '../components/commons/Container';
import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
import {useGetPaintingInfinite} from '../api_services/lib/queryhooks/usePainting';
import NetworkError from '../components/commons/LottieAnimationView';
import {networkError} from '../utils/constants';
import SkeletonView from '../components/commons/Skeleton';
import {getFontFamily} from '../utils/common';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const PaintingsScreen = ({navigation}: Props) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = styling(theme);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isLoading,
    isError,
  } = useGetPaintingInfinite();

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const paintingLists =
    data?.pages.flatMap(page => page.data.results.data) ?? [];

  const handleImageByTheme = () => {
    return theme === 'dark'
      ? require('../assets/parate_dark.jpg')
      : require('../assets/parate_light.jpg');
  };

  const renderItem = ({item}: any) => {
    const imageSource = item.details[0]?.file
      ? {uri: item.details[0]?.file}
      : handleImageByTheme();
    return (
      <View style={styles.contentContainer}>
        <Pressable
          style={styles.contentContainer}
          onPress={() => navigation.navigate('PaintingScreen', {id: item.id})}>
          <View
            style={[
              styles.img,
              {
                width: width * 0.92,
                height: height * 0.35,
              },
            ]}>
            <Image
              style={{width: '100%', height: '100%', borderRadius: 10}}
              source={imageSource}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.text, {fontSize: height * 0.023}]}>
            {item.title}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <Container title="MENUS.PICTURES">
      {isLoading || (isRefetching && !paintingLists.length) ? (
        Array.from({length: 10}, (_, index: number) => (
          <View key={index} style={styles.container}>
            <View style={styles.contentContainer}>
              <View style={{gap: 12, width: '100%'}}>
                <SkeletonView
                  height={height * 0.25}
                  width={'auto'}
                  borderRadius={12}
                />
                <SkeletonView height={12} width="auto" borderRadius={10} />
                <SkeletonView height={12} width={200} borderRadius={10} />
              </View>
            </View>
          </View>
        ))
      ) : isError ? (
        <NetworkError
          handlePress={refetch}
          btnType="refresh"
          lottieFiePath={networkError}
        />
      ) : (
        <FlatList
          data={paintingLists}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          onEndReached={loadMore}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors[theme].primary}
              progressViewOffset={-1}
              colors={[Colors[theme].primary]}
              progressBackgroundColor={Colors[theme].secondary}
            />
          }
        />
      )}
    </Container>
  );
};

export default PaintingsScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    contentContainer: {
      alignItems: 'center',
      gap: 20,
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    text: {
      fontFamily: getFontFamily('regular'),
      color: Colors[theme].text,
      textAlign: 'center',
    },
    img: {
      borderRadius: 100,
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
          elevation: 0,
        },
      }),
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].text,
      marginVertical: 20,
    },
    btn: {},
  });
