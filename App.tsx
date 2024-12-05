import React, {useEffect, useState} from 'react';
import {ThemeProvider} from './src/contexts/ThemeContext';
import AppNavigation from './src/navigations/AppNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {TrackProvider} from './src/contexts/TrackContext';
import TrackPlayer, {Capability} from 'react-native-track-player';
import SplashScreen from 'react-native-splash-screen';
import notifee from '@notifee/react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import DeviceInfo from 'react-native-device-info';
import {Alert, Linking, Platform} from 'react-native';
import {fetchAppVersion} from './src/api_services/lib/services/VersionService';
import ConfirmModal from './src/components/commons/ConfirmModal';
import {useTranslation} from 'react-i18next';

const NOTIFICATION = [
  Capability.Play,
  Capability.Pause,
  Capability.SkipToNext,
  Capability.SkipToPrevious,
];

const App = () => {
  // const getVersionMutation = useGetVersion();
  const queryClient = new QueryClient();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isShowCancelBtn, setIsShowCancelBtn] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string>('');
  const platform = Platform.OS;

  const {t} = useTranslation();

  useEffect(() => {
    const getVersion = async () => {
      try {
        const currentVersion = DeviceInfo.getVersion();
        const result = await fetchAppVersion({
          platform,
          current_version: currentVersion,
        });
        setStoreUrl(result.download_url);
        if (result.update_required) {
          if (result.force_update) {
            setIsShowCancelBtn(false);
            setModalVisible(true);
          } else {
            setIsShowCancelBtn(true);
            setModalVisible(true);
          }
        }
      } catch (error) {
        console.error('Error during get version:', error);
      } finally {
        SplashScreen.hide();
      }
    };

    const setUpPlayer = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: NOTIFICATION,

        compactCapabilities: NOTIFICATION,

        notificationCapabilities: NOTIFICATION,
      });
    };
    const notifeePermission = async () => {
      await notifee.requestPermission();
    };
    
    getVersion();
    notifeePermission();
    setUpPlayer();
  }, []);


  const handleCancelUpdate = () => {
    setModalVisible(false);
  };

  const handleDoUpdate = async () => {
    try {
      await Linking.openURL(storeUrl);
    } catch (error) {
      if (platform === 'android') {
        Alert.alert('Unable to open Play Store');
      } else {
        Alert.alert('Unable to open App Store');
      }
    }
  };

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TrackProvider>
            <AppNavigation />
            <ConfirmModal
              title={t('UTILS.VERSION_UPDATE_TITLE')}
              confirmText={t('UTILS.VERSION_UPDATE_NOW')}
              cancelText={t('UTILS.VERSION_UPDATE_LATER')}
              animationType="fade"
              confirmType="confirm"
              handleConfirm={handleDoUpdate}
              handleCancel={handleCancelUpdate}
              isModalVisible={isModalVisible}
              setModalVisible={setModalVisible}
              requiredCancelBtn={isShowCancelBtn}
            />
          </TrackProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
