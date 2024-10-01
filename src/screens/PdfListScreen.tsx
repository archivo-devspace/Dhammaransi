import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {CustomButton} from '../components/utils';
import {Ionicons} from '../utils/common';
import {fallBackImageUrl} from '../utils/constants';
import Container from '../components/commons/Container';
import {useGetBookList} from '../api_services/lib/queryhooks/useBook';
import SkeletonView from '../components/commons/Skeleton';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';

const PdfListScreen = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = styling(theme);

  // State for handling refresh control
  const [refreshing, setRefreshing] = useState(false);

  const {data: bookLists, isLoading: isBookLoading, refetch} = useGetBookList();

  // Function to handle the pull-to-refresh action
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing
    refetch().finally(() => setRefreshing(false)); // Refetch the data and stop refreshing once done
  }, [refetch]);

  const downloadPDF = async (
    fileUrl: string,
    fileName: string,
  ): Promise<void> => {
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY, // Use PHOTO_LIBRARY for iOS to save to Documents
    });

    if (!permission) {
      Alert.alert('Error', 'Platform not supported for file download.');
      return;
    }
    // Check if permission is granted
    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      // Define the path for the downloaded file
      const path = Platform.select({
        ios: `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}.pdf`, // Document Directory for iOS
        android: `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}.pdf`, // Downloads Directory for Android
      });

      try {
        // Start the download
        const res = await RNFetchBlob.config({
          path: path, // Specify the path to save the file
          fileCache: true,
          indicator: true,
          appendExt: 'pdf', // Ensure the file has a .pdf extension
        }).fetch('GET', fileUrl);

        if (res && res.path()) {
          Alert.alert('Download Complete', `File saved to ${path}`);
        } else {
          Alert.alert(
            'Download Failed',
            'There was an issue downloading the file.',
          );
        }
      } catch (error) {
        console.log('Download error', error);
        Alert.alert('Error', 'Failed to download the PDF file.');
      }
    } else if (result === RESULTS.DENIED) {
      Alert.alert(
        'Permission Denied',
        'You need to allow permissions to download files.',
      );
    } else if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Please enable permissions in your app settings.',
      );
    }
  };

  return (
    <Container title="TITLES.PDFSCREEN_TITLE">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors[theme].primary]}
          />
        } // Add RefreshControl here
      >
        {isBookLoading
          ? // Loading Skeletons
            [...Array(3)].map((_, index) => (
              <View
                key={index}
                style={[styles.contentContainer, {paddingBottom: 100}]}>
                <View style={styles.innerContentContainer}>
                  <SkeletonView
                    height={height * 0.2}
                    width={width * 0.3}
                    borderRadius={10}
                  />
                  <View style={{width: width * 0.6, marginTop: 20, gap: 20}}>
                    <SkeletonView height={20} width={150} borderRadius={10} />
                    <SkeletonView
                      height={18}
                      width={'auto'}
                      borderRadius={10}
                    />
                  </View>
                </View>
                <View style={{width: '100%', gap: 14}}>
                  <SkeletonView height={20} width={'auto'} borderRadius={10} />
                  <SkeletonView height={20} width={'auto'} borderRadius={10} />
                  <SkeletonView height={20} width={'auto'} borderRadius={10} />
                </View>
              </View>
            ))
          : bookLists?.data?.results?.map(ebook => (
              <React.Fragment key={ebook.id}>
                <View style={styles.contentContainer}>
                  <View style={styles.innerContentContainer}>
                    <View
                      style={[
                        styles.img,
                        {
                          width: width * 0.3,
                          height: width * 0.3,
                        },
                      ]}>
                      <Image
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 10,
                        }}
                        source={{uri: fallBackImageUrl}}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={{width: width * 0.6, gap: 20}}>
                      <Text style={[styles.text, {fontSize: height * 0.025}]}>
                        {ebook.name}
                      </Text>
                      <Text style={[styles.author, {fontSize: height * 0.022}]}>
                        {ebook.author}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[styles.description, {fontSize: height * 0.021}]}>
                    {ebook.description}
                  </Text>
                  <CustomButton
                    onPress={() => downloadPDF(ebook.file, ebook.name)}
                    icon={
                      <Ionicons
                        name={`cloud-download-outline`}
                        size={30}
                        color={Colors[theme].primary}
                      />
                    }
                    customButtonStyle={styles.btn}
                  />
                </View>
                {bookLists?.data?.results?.length !== ebook?.id && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
      </ScrollView>
    </Container>
  );
};

export default PdfListScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingHorizontal: 10,
    },
    contentContainer: {
      alignItems: 'center',
      gap: 20,
      justifyContent: 'space-between',
    },
    innerContentContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 5,
      marginBottom: 10,
    },
    text: {
      fontWeight: '700',
      color: Colors[theme].text,
    },
    description: {
      fontWeight: '500',
      color: Colors[theme].text,
      paddingHorizontal: 5,
    },
    author: {
      fontWeight: '600',
      color: Colors[theme].text,
    },
    img: {
      borderRadius: 10,
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
          elevation: 3,
        },
      }),
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
      marginVertical: 20,
    },
    btn: {
      alignSelf: 'flex-end',
      paddingHorizontal: 50,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: Colors[theme].primary,
      borderRadius: 20,
    },
  });
