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
import notifee, {AndroidImportance} from '@notifee/react-native';
import CustomAlert from '../components/commons/CustomAlert';
import ConfirmModal from '../components/commons/ConfirmModal';
import {useTranslation} from 'react-i18next';

const PdfListScreen = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState<{
    fileUrl: string;
    fileName: string;
  }>({fileUrl: '', fileName: ''});
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alerType, setAlertType] = useState<
    'success' | 'warning' | 'error' | null
  >(null);
  const {t} = useTranslation();

  const styles = styling(theme);

  // State for handling refresh control
  const [refreshing, setRefreshing] = useState(false);

  const {data: bookLists, isLoading: isBookLoading, refetch} = useGetBookList();

  const confirmDownload = (fileUrl: string, fileName: string) => {
    setSelectedPdfFile({fileUrl, fileName});
    setModalVisible(true);
  };

  const handleDownload = async () => {
    if (selectedPdfFile) {
      downloadPDF(selectedPdfFile.fileUrl, selectedPdfFile.fileName);
    }

    setModalVisible(false);
  };

  const handleCancelDownload = () => {
    setModalVisible(false);
  };

  // Function to handle the pull-to-refresh action
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing
    refetch().finally(() => setRefreshing(false)); // Refetch the data and stop refreshing once done
  }, [refetch]);

  // Function to display or update the progress notification
  const displayOrUpdateNotification = async (
    notificationId: string,
    fileName: string,
    progress: number | null,
  ) => {
    const options = {
      id: notificationId,
      title:
        progress !== null
          ? `Downloading ${fileName}`
          : `${fileName} Downloaded`,
      body:
        progress !== null
          ? `Download in progress... ${progress}%`
          : 'Download complete!',
      android: {
        channelId: 'download-channel',
        importance: AndroidImportance.HIGH,
        progress: {
          max: 100,
          current: progress ?? 100,
          indeterminate: false,
        },
      },
    };

    return await notifee.displayNotification(options);
  };

  const downloadPDF = async (
    fileUrl: string,
    fileName: string,
  ): Promise<void> => {
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    });

    if (!permission) {
      setAlertTitle('Error');
      setAlertMessage('Platform not supported for file download.');
      setAlertType('error');
      setIsAlertVisible(true);
      return;
    }

    await notifee.createChannel({
      id: 'download-channel',
      name: 'Download Channel',
      importance: AndroidImportance.HIGH,
    });

    const result = await request(permission);
    if (result === RESULTS.GRANTED) {
      const path = Platform.select({
        ios: `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}.pdf`,
        android: `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}.pdf`,
      });

      try {
        const notificationId = Date.now().toString(); // Unique notification ID

        let currentNotificationId = await displayOrUpdateNotification(
          notificationId,
          fileName,
          0,
        );

        await RNFetchBlob.config({
          path: path,
          fileCache: true,
          appendExt: 'pdf',
        })
          .fetch('GET', fileUrl)
          .progress({interval: 100}, async (received, total) => {
            const progress = Math.round((received / total) * 100);
            currentNotificationId = await displayOrUpdateNotification(
              currentNotificationId,
              fileName,
              progress,
            );
          })
          .then(res => {
            if (res && res.path()) {
              displayOrUpdateNotification(
                currentNotificationId,
                fileName,
                null,
              );
              setAlertTitle('Download Complete');
              setAlertMessage(`File saved to ${path}`);
              setAlertType('success');
              setIsAlertVisible(true);
            } else {
              setAlertTitle('Download Failed');
              setAlertMessage('There was an issue downloading the file.');
              setAlertType('error');
              setIsAlertVisible(true);
            }
          });
      } catch (error) {
        console.log('Download error', error);
        setAlertTitle('Error');
        setAlertMessage('Failed to download the PDF file.');
        setAlertType('error');
        setIsAlertVisible(true);
      }
    } else if (result === RESULTS.DENIED) {
      setAlertTitle('Permission Denied');
      setAlertMessage('You need to allow permissions to download files.');
      setAlertType('warning');
      setIsAlertVisible(true);
    } else if (result === RESULTS.BLOCKED) {
      setAlertTitle('Permission Blocked');
      setAlertMessage('Please enable permissions in your app settings.');
      setAlertType('warning');
      setIsAlertVisible(true);
    }
  };

  return (
    <>
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
                    <SkeletonView
                      height={20}
                      width={'auto'}
                      borderRadius={10}
                    />
                    <SkeletonView
                      height={20}
                      width={'auto'}
                      borderRadius={10}
                    />
                    <SkeletonView
                      height={20}
                      width={'auto'}
                      borderRadius={10}
                    />
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
                            height: width * 0.4,
                          },
                        ]}>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 10,
                          }}
                          source={
                            ebook.cover_photo
                              ? {uri: ebook.cover_photo}
                              : require('../assets/marguerite.jpg')
                          }
                          resizeMode="cover"
                        />
                      </View>
                      <View style={{width: width * 0.6, gap: 20}}>
                        <Text style={[styles.text, {fontSize: height * 0.025}]}>
                          {ebook.name}
                        </Text>
                        <Text
                          style={[styles.author, {fontSize: height * 0.022}]}>
                          {ebook.author}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[styles.description, {fontSize: height * 0.021}]}>
                      {ebook.description}
                    </Text>
                    <CustomButton
                      onPress={() => confirmDownload(ebook.file, ebook.name)}
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
      <ConfirmModal
        title={t('UTILS.DOWNLOAD_PDF')}
        confirmText={t('UTILS.YES_DOWNLOAD')}
        cancelText={t('UTILS.NO_DOWNLOAD')}
        animationType="fade"
        confirmType="confirm"
        handleConfirm={handleDownload}
        handleCancel={handleCancelDownload}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />
      <CustomAlert
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
        btnText="Ok"
        type={alerType}
      />
    </>
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
