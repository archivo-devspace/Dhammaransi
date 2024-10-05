import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Switch from '../components/utils/Switch/Switch';
import { save } from '../utils/storage';
import { Theme, useThemeContext } from '../contexts/ThemeContext';
import { Colors } from '../theme';
import { useTranslation } from 'react-i18next';
import Container from '../components/commons/Container';

const SettingScreen = () => {
  const { theme, setTheme, languages, setLanguages } = useThemeContext();
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [burmeseLanguages, setBurmeseLanguages] = useState<boolean>(false);
  const { height } = useWindowDimensions();

  const styles = styling(theme);

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
    <Container title="MENUS.SETTING">
      <ScrollView style={styles.optionContainer}>
        <View style={styles.contentContainer}>
          <Text
            style={{
              color: Colors[theme].text,
              fontSize: height * 0.02,
              fontWeight: '500',
            }}>
            {t('UTILS.DARK_MODE_ON')}
          </Text>
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
          <Text style={[styles.text, {
            fontSize: height * 0.02,
            fontWeight: '500',
          }]}>{t('UTILS.LANGUAGES')}</Text>
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
    </Container>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
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
