import React, {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Switch from '../components/utils/Switch/Switch';
import {get, save} from '../utils/storage';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {AntDesign} from '../utils/common';
import {NavigationDrawerScreenProps} from '../navigations/DrawerNavigation';

type Props = {
  navigation: NavigationDrawerScreenProps['navigation'] & {
    openDrawer?: () => void; // Add openDrawer function to the navigation prop type
  };
};

const SettingScreen = ({navigation}: Props) => {
  const {theme, setTheme} = useThemeContext();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const styles = styling(theme);

  useEffect(() => {
    const updateEnabledState = () => {
      setIsEnabled(theme === 'dark');
    };

    updateEnabledState();
  }, [theme]);

  const getAppTheme = useCallback(async () => {
    const savedTheme = await get('Theme');
    if (savedTheme !== null) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    getAppTheme();
  }, [getAppTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    save('Theme', newTheme);
    setTheme(newTheme);
  }, [theme, setTheme]);

  const toggleSwitch = () => {
    setIsEnabled(prevEnabled => !prevEnabled);
    toggleTheme();
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" translucent />

      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.topView}>
          <AntDesign
            size={30}
            name="menu-fold"
            color={Colors[theme]?.primary}
            onPress={navigation.openDrawer}
          />
        </View>
      </SafeAreaView>

      <View style={styles.toggle}>
        <Text style={styles.text}>Use dark theme</Text>
        <Switch value={isEnabled} handleSwitch={toggleSwitch} />
      </View>
    </View>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary_light,
    },
    safeAreaView: {
      marginBottom: Platform.OS === 'ios' ? 8 : 12,
      marginTop: Platform.OS === 'ios' ? 8 : 52,
    },
    topView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    toggle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    text: {
      color: Colors[theme]?.text,
    },
  });

export default SettingScreen;
