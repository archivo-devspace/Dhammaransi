import {
  DeviceEventEmitter,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {showToast} from '../../../screens/TrackScreen';
import CircularProgressBar from '../CircularProgressBar';
import {CustomButton} from '../../utils';
import {AntDesign} from '../../../utils/common';
import {Colors} from '../../../theme';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {useTranslation} from 'react-i18next';

interface Props {
  isModalVisible: boolean;
  onClosePress: () => void;
  onAndroidBackPress?: () => void;
  onDownloadFinished: any;
  contentId: string;
  downloadProgress: number;
}

const DownloadModal = ({
  isModalVisible = false,
  onClosePress = () => {},
  onAndroidBackPress = () => {},
  onDownloadFinished = false,
  contentId,
  downloadProgress,
}: Props) => {
  const [isDownloading, setDownloading] = useState(false);
  const [downloadPercentage, setDownloadPercentage] = useState(0);

  const {theme} = useThemeContext();
  const {t} = useTranslation();

  const styles = styling(theme);

  useLayoutEffect(() => {
    const downloadListener = DeviceEventEmitter.addListener(
      'downloadProgress',
      e => {
        if (e.contentId === contentId) {
          setDownloading(true);
          setDownloadPercentage(e?.progressValue);
        } else {
          setDownloading(false);
        }
      },
    );
    return () => {
      downloadListener.remove();
      setDownloadPercentage(0);
    };
  }, [contentId]);

  useEffect(() => {
    const downloadListenerStatus = DeviceEventEmitter.addListener(
      'downloadDone',
      e => {
        if (e?.contentId === contentId) {
          showToast(
            'success',
            `${t('UTILS.SUCCESS')}`,
            `${t('UTILS.SUCCESS_TEXT')}`,
          );
          onDownloadFinished(true);
          onClosePress();
        }
      },
    );
    return () => {
      downloadListenerStatus.remove();
    };
  }, [contentId]);

  useEffect(() => {
    setDownloadPercentage(downloadProgress);
  }, [downloadProgress]);

  return (
    <>
      {isModalVisible && (
        <StatusBar translucent backgroundColor={'#00000099'} />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          onAndroidBackPress();
          onClosePress();
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalViewAlt}>
            <CustomButton
              customButtonStyle={styles.btn}
              onPress={onClosePress}
              icon={
                <AntDesign
                  name={`closesquare`}
                  size={26}
                  color={Colors[theme].secondary}
                />
              }
            />
            <CircularProgressBar
              percentage={JSON.parse(String(downloadPercentage))}
              centerText={JSON.parse(String(downloadPercentage))}
              progressColor={Colors[theme].primary_light}
              strokeColor={Colors[theme].secondary_light}
            />
            <Text style={styles.subHeading}>Downloading...</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DownloadModal;

const styling = (theme: Theme) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: '#00000080',
    },
    modalViewAlt: {
      backgroundColor: Colors[theme].primary_dark,
      borderRadius: 10,
      alignItems: 'center',
      width: '40%',
      height: '15%',
      paddingTop: 10,
    },
    heading: {
      textAlign: 'center',
      marginTop: 8,
      fontSize: 14,
      color: '#000',
      lineHeight: 18,
      fontWeight: '700',
    },
    subHeading: {
      textAlign: 'center',
      marginBottom: 21,
      fontSize: 15,
      width: '150%',
      color: '#fff',
    },
    keepAccount: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingVertical: 14,
      alignItems: 'center',
      width: '100%',
      borderTopColor: '#606060',
    },

    btn: {
      position: 'absolute',
      borderRadius: 5,
      alignSelf: 'flex-end',
      padding: 4,
    },
  });
