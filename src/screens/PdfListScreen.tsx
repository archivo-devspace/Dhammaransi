/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {CustomButton} from '../components/utils';
import {FontAwesome, getFontFamily, Ionicons} from '../utils/common';
import Container from '../components/commons/Container';
import {useGetBookList} from '../api_services/lib/queryhooks/useBook';
import SkeletonView from '../components/commons/Skeleton';
import notifee, {AndroidImportance} from '@notifee/react-native';
import CustomAlert from '../components/commons/CustomAlert';
import ConfirmModal from '../components/commons/ConfirmModal';
import {useTranslation} from 'react-i18next';
import NetworkError from '../components/commons/LottieAnimationView';
import {networkError} from '../utils/constants';
import ReactNativeBlobUtil from 'react-native-blob-util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTrackContext} from '../contexts/TrackContext';

const PdfListScreen = () => {
  const {theme} = useThemeContext();
  const {
    pdfDownloading,
    startPdfDownload,
    finishPdfDownload,
    pdfDownlaodProgress,
    setPdfDownloadForProgress,
  } = useTrackContext();
  const {width, height} = useWindowDimensions();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState<{
    id: number;
    fileUrl: string;
    fileName: string;
  }>({id: 0, fileUrl: '', fileName: ''});
  const [downloadedFiles, setDownloadedFiles] = useState([]);
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

  const {
    data: bookLists,
    isLoading: isBookLoading,
    refetch,
    isFetched,
    isError,
  } = useGetBookList();

  useEffect(() => {
    fetchDownloadedFiles();
  }, [finishPdfDownload]);


  const confirmDownload = (id: number, fileUrl: string, fileName: string) => {
    setSelectedPdfFile({id, fileUrl, fileName});
    setModalVisible(true);
  };

  const handleDownload = async () => {
    if (selectedPdfFile) {
      startPdfDownload(selectedPdfFile.id);
      downloadPDF(
        selectedPdfFile.id,
        selectedPdfFile.fileUrl,
        selectedPdfFile.fileName,
      );
    }
    setModalVisible(false);
  };

  const handleCancelDownload = () => {
    setSelectedPdfFile({id: 0, fileUrl: '', fileName: ''});
    setModalVisible(false);
  };

  // Function to handle the pull-to-refresh action
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing
    refetch().finally(() => setRefreshing(false)); // Refetch the data and stop refreshing once done
  }, [refetch]);

  // Function to display or update the progress notification
  const displayOrUpdateNotification = async (
    id: any,
    fileName: any,
    progress: number | null,
    failed?: boolean,
  ) => {
    const title = failed
      ? `Failed ${fileName}`
      : progress !== null
        ? `Downloading ${fileName}`
        : `Downloaded ${fileName}`;
    const body = failed
      ? 'Download Failed!'
      : progress !== null
        ? `Download in progress ...`
        : 'Download complete!';

    await notifee.displayNotification({
      id,
      title,
      body,
      android: {
        channelId: 'download-channel',
        smallIcon: 'ic_notification',
        sound: 'downloadedalert',
        importance: AndroidImportance.HIGH,
      },
      ios: {sound: 'downloadedalert.wav'},
    });
  };

  const downloadPDF = async (id: number, fileUrl: string, fileName: string) => {
    const folderPath =
      Platform.OS === 'android'
        ? ReactNativeBlobUtil.fs.dirs.DownloadDir + '/Dhammaransi'
        : ReactNativeBlobUtil.fs.dirs.DocumentDir + '/Dhammaransi';
    const filePath = `${folderPath}/${fileName}.pdf`;

    await notifee.createChannel({
      id: 'download-channel',
      name: 'Download Channel',
      importance: AndroidImportance.HIGH,
      sound: 'downloadedalert',
    });

    try {
      if (!(await ReactNativeBlobUtil.fs.isDir(folderPath)))
        await ReactNativeBlobUtil.fs.mkdir(folderPath);
      const notificationId = Date.now().toString();
      await displayOrUpdateNotification(notificationId, fileName, 0);

      ReactNativeBlobUtil.config({
        fileCache: true,
        path: filePath,
        appendExt: 'pdf',
      })
        .fetch('GET', fileUrl)
        .progress({interval: 100}, async (received, total) => {
          const progress = Math.round((received / total) * 100);
          setPdfDownloadForProgress(id, progress); // Update context/state progress
          // await displayOrUpdateNotification(notificationId, fileName, progress); // Update notification with progress
        })
        .then(async res => {
          const success = !!res.path();
          if (res && res.path()) {
            await displayOrUpdateNotification(
              notificationId,
              fileName,
              null,
              false,
            );
          }
          if (success) await saveDownloadedFile(id, fileName, res.path());
          finishPdfDownload(id);
          finishPdfDownload(id);
          setAlertTitle('Download Complete');
          setAlertMessage(`File saved to ${res.data}`);
          setAlertType('success');
          setIsAlertVisible(true);
        })
        .catch(async err => {
          finishPdfDownload(id);
          await displayOrUpdateNotification(
            notificationId,
            fileName,
            null,
            true,
          );
          setAlertTitle('Download Failed');
          setAlertMessage('There was an issue downloading the file.');
          setAlertType('error');
          setIsAlertVisible(true);
          console.error('Download failed:', err);
        });
    } catch (error) {
      finishPdfDownload(id);
      setAlertTitle('Error');
      setAlertMessage('Error creating folder or saving file:');
      setAlertType('error');
      setIsAlertVisible(true);
      console.error('Error creating folder or saving file:', error);
    }
  };

  const saveDownloadedFile = async (
    id: number | null,
    fileName: string,
    filePath: string,
  ) => {
    try {
      const newFile = {id: id, name: fileName, path: filePath};
      const storedFiles = await AsyncStorage.getItem('downloadedFiles');
      const fileList = storedFiles ? JSON.parse(storedFiles) : [];
      fileList.push(newFile);
      await AsyncStorage.setItem('downloadedFiles', JSON.stringify(fileList));
      fetchDownloadedFiles();
    } catch (error) {
      console.error('Error saving file', error);
    }
  };

  const fetchDownloadedFiles = async () => {
    try {
      const storedFiles = await AsyncStorage.getItem('downloadedFiles');
      setDownloadedFiles(storedFiles ? JSON.parse(storedFiles) : []);
    } catch (error) {
      console.error('Error fetching downloaded files', error);
    }
  };

  // const isFileDownloaded = (fileId:number) => {
  //   return downloadedFiles.some((file:any) => file.id === fileId);
  // };

  const getDownloadedFilePath = (fileId: number) => {
    const downloadedFile: any = downloadedFiles.find(
      (file: any) => file.id === fileId,
    );
    return downloadedFile ? downloadedFile?.path : null;
  };

  const openDocument = (filePath: string) => {
    if (Platform.OS === 'ios') {
      ReactNativeBlobUtil.ios.openDocument(filePath);
    } else {
      const mimeType = 'application/pdf'; // Assuming you're dealing with PDFs, set the correct MIME type
      ReactNativeBlobUtil.android.actionViewIntent(filePath, mimeType);
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
              progressViewOffset={-1}
              tintColor={Colors[theme].primary}
              colors={[Colors[theme].primary]}
              progressBackgroundColor={Colors[theme].secondary}
            />
          } // Add RefreshControl here
        >
          {isBookLoading ? (
            // Loading Skeletons
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
          ) : (isFetched && !bookLists?.data?.results?.length) || isError ? (
            <NetworkError
              handlePress={refetch}
              btnType="refresh"
              lottieFiePath={networkError}
            />
          ) : (
            bookLists?.data?.results?.map(ebook => {
              const downloadedFilePath = getDownloadedFilePath(ebook.id);
              return (
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
                        <Text style={[styles.text, {fontSize: height * 0.027}]}>
                          {ebook.name}
                        </Text>
                        <Text
                          style={[styles.author, {fontSize: height * 0.022}]}>
                          {ebook.author}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[styles.description, {fontSize: height * 0.023}]}>
                      {ebook.description}
                    </Text>

                    {downloadedFilePath ? (
                      <CustomButton
                        onPress={() => openDocument(downloadedFilePath)} // Adjust as per your platform
                        icon={
                          <FontAwesome
                            name={'book-reader'}
                            size={30}
                            color={Colors[theme].primary_light}
                          />
                        }
                        customButtonStyle={styles.btn}
                      />
                    ) : (
                      <CustomButton
                        onPress={() =>
                          confirmDownload(ebook.id, ebook.file, ebook.name)
                        }
                        icon={
                          !pdfDownloading[ebook.id] ? (
                            <Ionicons
                              name={'cloud-download-outline'}
                              size={30}
                              color={Colors[theme].primary_light}
                            />
                          ) : (
                            <></>
                          )
                        }
                        disabled={pdfDownloading[ebook.id]}
                        title={
                          pdfDownloading[ebook.id]
                            ? `${String(pdfDownlaodProgress[ebook.id])} %`
                            : undefined
                        }
                        customButtonStyle={styles.btn}
                        customButtonTextStyle={
                          pdfDownloading[ebook.id]
                            ? styles.downloadBtnText
                            : styles.text
                        }
                      />
                    )}
                  </View>
                  {/* {bookLists?.data?.results?.length !== ebook?.id && (
                    <View style={styles.divider} />
                  )} */}
                </React.Fragment>
              );
            })
          )}
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
      backgroundColor: Colors[theme].secondary_light,
      paddingHorizontal: 10,
      paddingVertical: 30,
      marginBottom: 20,
      borderRadius: 16,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    innerContentContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 10,
    },
    text: {
      fontFamily: getFontFamily('bold'),
      color: Colors[theme].text,
    },
    description: {
      fontFamily: getFontFamily('regular'),
      color: Colors[theme].text,
      paddingHorizontal: 5,
    },
    author: {
      fontFamily: getFontFamily('regular'),
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
    downloadBtnText: {
      fontSize: 12,
      fontWeight: '500',
      color: Colors[theme].text,
      alignSelf: 'center',
      paddingVertical: 7,
    },
    btn: {
      alignSelf: 'flex-end',
      width: 120,
      borderWidth: 1,
      borderColor: Colors[theme].text,
      backgroundColor: Colors[theme].secondary_light,
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: Colors[theme].secondary_dark,
      borderRadius: 20,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
  });
