import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Switch from '../components/utils/Switch/Switch';
import {get, save} from '../utils/storage';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {CustomButton} from '../components/utils';
import {Ionicons} from '../utils/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import Header from '../components/commons/Header';

const SettingScreen = () => {
  const {theme, setTheme, languages, setLanguages} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [burmeseLanguages, setBurmeseLanguages] = useState<boolean>(false);

  const styles = styling(theme);
  const {top} = insets;

  useEffect(() => {
    const updateEnabledState = () => {
      setIsEnabled(theme === 'dark');
      setBurmeseLanguages(languages === 'en');
    };

    updateEnabledState();
  }, [theme, languages]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    save('Theme', newTheme);
    setTheme(newTheme);
  }, [theme, setTheme]);

  const toggleLanguages = async () => {
    const newLanguage = languages === 'en' ? 'mm' : 'en';

    setLanguages(newLanguage);
  };

  const toggleSwitch = () => {
    setIsEnabled(prevEnabled => !prevEnabled);
    toggleTheme();
  };

  const toggleSwitchLang = () => {
    setBurmeseLanguages(prev => !prev);
    toggleLanguages();
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      <Header title="MENUS.SETTING" />
      <ScrollView style={styles.optionContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>{t('UTILS.DARK_MODE_ON')}</Text>
          <Switch
            value={isEnabled}
            handleSwitch={toggleSwitch}
            bgWidth={65}
            bgHeight={40}
            bgRadious={70}
            headWidth={30}
            headHeight={30}
            fromOutputRange={5}
            toOutputRange={30}
            defaultBgColorCodes={[
              Colors[theme]?.primary,
              Colors[theme]?.secondary_dark,
            ]}
            defaultHeadColorCodes={[
              Colors[theme]?.primary,
              Colors[theme]?.secondary_light,
            ]}
            activeBgColorCodes={[
              Colors[theme]?.primary,
              Colors[theme]?.secondary_dark,
            ]}
            activeHeadColorCodes={[
              Colors[theme]?.secondary_dark,
              Colors[theme]?.secondary_light,
            ]}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.contentContainer}>
          <Text style={styles.text}>{t('UTILS.LANGUAGES')}</Text>
          <Switch
            value={burmeseLanguages}
            handleSwitch={toggleSwitchLang}
            bgWidth={65}
            bgHeight={40}
            bgRadious={70}
            headWidth={30}
            headHeight={30}
            fromOutputRange={5}
            toOutputRange={30}
            defaultBgColorCodes={[
              Colors[theme]?.primary,
              Colors[theme]?.secondary_dark,
            ]}
            defaultHeadColorCodes={[
              Colors[theme]?.primary,
              Colors[theme]?.secondary_light,
            ]}
            activeBgColorCodes={[
              Colors[theme]?.primary,
              Colors[theme]?.secondary_dark,
            ]}
            activeHeadColorCodes={[
              Colors[theme]?.secondary_dark,
              Colors[theme]?.secondary_light,
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
    },
    contentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      gap: 30,
    },
    text: {
      color: Colors[theme].text,
      fontSize: 14,
    },
    optionContainer: {
      marginTop: 30,
      paddingHorizontal: 20,
    },
    menu: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    menuText: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 30,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
      marginVertical: 10,
    },
  });

export default SettingScreen;
