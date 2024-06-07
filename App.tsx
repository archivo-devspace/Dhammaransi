// import {StyleSheet, Text, useColorScheme, View} from 'react-native';
// import React, {useCallback, useEffect} from 'react';
// import AppNavigation from './src/navigations/AppNavigation';
// import {get, save} from './src/utils/storage';
// import {ThemeProvider} from './src/contexts/ThemeContext';

// const App = () => {
//   const appearance = useColorScheme();
//   const setAppTheme = useCallback(async () => {
//     const IS_FIRST = await get('IS_FIRST');
//     if (IS_FIRST === null) {
//       save('Theme', appearance);
//       save('IsDefault', true);
//       save('IS_FIRST', true);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     setAppTheme();
//   }, [setAppTheme]);

//   return (
//     <ThemeProvider>
//       <AppNavigation />
//     </ThemeProvider>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});

// App.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {ThemeProvider} from './src/contexts/ThemeContext';
import AppNavigation from './src/navigations/AppNavigation';
import {get, save} from './src/utils/storage';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {TrackProvider} from './src/contexts/TrackContext';
import TrackPlayer, {Capability} from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  const [storeLanguages, setStoreLanguages] = useState<string | null>('');
  useEffect(() => {
    const setUpPlayer = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],

        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
    };
    setUpPlayer();
  }, []);

  useEffect(() => {
    const hideSplashScreen = setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
    return () => clearTimeout(hideSplashScreen);
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
