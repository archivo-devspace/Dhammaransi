import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { AntDesign, Ionicons, truncateText } from '../utils/common';
import { CustomButton } from '../components/utils';
import Container from '../components/commons/Container';
import { Theme, useThemeContext } from '../contexts/ThemeContext';
import { Colors } from '../theme';
import { NavigationMainStackScreenProps } from '../navigations/StackNavigation';
import { useGetAlbums, useGetAlbumsInfinite } from '../api_services/lib/queryhooks/useAudio';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';
import SkeletonView from '../components/commons/Skeleton';
import NetworkError from '../components/commons/NetworkError';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const AudioCategoryListScreen = ({ navigation }: Props) => {
  const { theme } = useThemeContext();
  const styles = styling(theme);
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isLoading:albumLoading,
    isError,
    
  } = useGetAlbumsInfinite();

  // Combine pages to create a flat array of album data
  const albumList = data?.pages.flatMap(page => page.data.results.data) ?? [];

  const finalAlbumList = isError ? [] : albumList;

  const handleNavigate = (id: number) => {
    navigation.navigate('Audios', { id });
  };

  console.log("albumLoading", albumLoading)

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

 
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing
    refetch().finally(() => setRefreshing(false)); // Refetch the data and stop refreshing once done
  }, [refetch]);

  return (
    <Container title="TITLES.AUDIOCATEGORIES">
      {(albumLoading || (isRefetching && finalAlbumList.length === 0))? (
      Array.from({length:10},(_,index:number)=> (
        <View key={index} style={styles.container}>
      <View style={styles.trackContainer}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <SkeletonView height={70} width={70} borderRadius={12} />
          <View style={{ width: '70%', gap: 10 }}>
            <SkeletonView height={12} width="auto" borderRadius={10} />
            <SkeletonView height={8} width={100} borderRadius={10} />
          </View>
        </View>
        <SkeletonView width={35} height={35} borderRadius={5} />
      </View>
    </View>
      ))
      ) :
        isError ? (
          <NetworkError onRefresh={refetch}/>
        ) : (
          <FlatList
            data={finalAlbumList}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.container}>
                <CustomButton
                  onPress={() => handleNavigate(item.id)}
                  customButtonStyle={styles.btn}>
                  <View style={styles.trackContainer}>
                    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                      <Image
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Paticcasamuppada_Burmese.jpg' }}
                        resizeMode="cover"
                        style={styles.img}
                      />
                      <View style={{ width: '70%', gap: 10 }}>
                        <Text style={[styles.title, { fontSize: height * 0.02 }]}>
                          {truncateText(item.title, 45)}
                        </Text>
                        <Text style={[styles.desc, { fontSize: height * 0.017 }]}>
                          {truncateText(item.status, 30)}
                        </Text>
                      </View>
                    </View>
                    <AntDesign
                      name={'arrowright'}
                      size={30}
                      color={Colors[theme].primary}
                    />
                  </View>
                </CustomButton>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            onEndReached={loadMore}  // Trigger when the user reaches the end of the list
            onEndReachedThreshold={0.5}  // Trigger when 50% from the bottom
            ListFooterComponent={() => isFetchingNextPage ? <ActivityIndicator size="small" color={Colors[theme].primary} /> : null}  // Spinner at the bottom
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

export default AudioCategoryListScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    trackContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingRight: 20,
    },
    img: {
      width: 60,
      height: 60,
      borderRadius: 12,
    },
    btn: {
      backgroundColor: Colors[theme].secondary,
    },
    title: {
      color: Colors[theme].text,
      fontWeight: '600',
    },
    desc: {
      color: Colors[theme].text,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
    },
   
  });

