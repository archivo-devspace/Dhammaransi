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
import React, {useCallback, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {ThemeProvider} from './src/contexts/ThemeContext';
import AppNavigation from './src/navigations/AppNavigation';
import {get, save} from './src/utils/storage';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
