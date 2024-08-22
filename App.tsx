

import React, {useEffect, useState} from 'react';
import {ThemeProvider} from './src/contexts/ThemeContext';
import AppNavigation from './src/navigations/AppNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {TrackProvider} from './src/contexts/TrackContext';
import TrackPlayer, {Capability} from 'react-native-track-player';
import SplashScreen from 'react-native-splash-screen';
import notifee from '@notifee/react-native';

const NOTIFICATION = [
  Capability.Play,
  Capability.Pause,
  Capability.SkipToNext,
  Capability.SkipToPrevious,
]


const App = () => {
  const [storeLanguages, setStoreLanguages] = useState<string | null>('');

  useEffect(() => {
    const hideSplashScreen = setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
    
    return () => clearTimeout(hideSplashScreen);
  }, []);

  useEffect(() => {
    const setUpPlayer = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities:NOTIFICATION,

        compactCapabilities: NOTIFICATION,

        notificationCapabilities: NOTIFICATION
      });
    };
    const notifeePermission = async()=>{
      await notifee.requestPermission();
    }
    notifeePermission();
    setUpPlayer();
  }, []);



  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <TrackProvider>
          <AppNavigation />
        </TrackProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
