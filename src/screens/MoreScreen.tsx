import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import {StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../theme';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {FontAwesome} from '../utils/common';
import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
import {CustomButton} from '../components/utils';
import {useTranslation} from 'react-i18next';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const MoreScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const {height} = useWindowDimensions();
  const {t} = useTranslation();
  const styles = styling(theme);
  const {top} = insets;

  const menuOptions = [
    {
      id: 1,
      name: 'MENUS.BIOGRAPHY',
      icon: 'user-circle',
      link: 'Biography',
    },
    {
      id: 2,
      name: 'MENUS.MEDITATION_TIMETABLE',
      icon: 'calendar-alt',
      link: 'Timetable',
    },
    {
      id: 3,
      name: 'MENUS.JOURNEY',
      icon: 'place-of-worship',
      link: 'Missionary',
    },
    {
      id: 4,
      name: 'MENUS.CONTACT',
      icon: 'portrait',
      link: 'Contact',
    },
    {
      id: 5,
      name: 'MENUS.SETTING',
      icon: 'cog',
      link: 'Setting',
    },
  ];
  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      {/* <SafeAreaView /> */}
      <View style={{marginTop: top}}>
        <Text style={[styles.headerText, {fontSize: height * 0.025}]}>{t('TITLES.MORE')}</Text>
      </View>
      <ScrollView style={styles.optionContainer}>
        {menuOptions.map(menu => (
          <React.Fragment key={menu.id}>
            <CustomButton
              customButtonStyle={styles.menu}
              onPress={() => navigation.navigate(menu.link as any)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: 20,
                  gap: 30,
                }}>
                <View style={styles.menuText}>
                  <FontAwesome
                    name={menu.icon}
                    size={25}
                    color={Colors[theme].primary}
                  />

                  <Text style={{color: Colors[theme].text, fontSize: 14}}>
                    {t(menu.name)}
                  </Text>
                </View>
                <FontAwesome
                  name={'angle-right'}
                  size={20}
                  color={Colors[theme].text}
                />
              </View>
            </CustomButton>
            {menuOptions.length !== menu.id && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

export default MoreScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
    },
    headerText: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: Colors[theme].text,
    },
    optionContainer: {
      paddingHorizontal: 10,
      marginTop: 30,
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
