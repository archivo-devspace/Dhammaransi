import {
  Alert,
  Image,
  Linking,
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
import {Entypo, FontAwesome, FontAwesomePro} from '../utils/common';
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

  const openFacebook = async () => {
    const facebookAppUrl =
      Platform.select({
        ios: 'fb://profile/61563675035436', // iOS app deep link
        android:
          'fb://facewebmodal/f?href=https://www.facebook.com/61563675035436', // Android deep link
      }) || 'https://www.facebook.com/profile.php?id=61563675035436'; // Fallback to web URL

    const facebookWebUrl =
      'https://www.facebook.com/profile.php?id=61563675035436';

    try {
      // Open the Facebook app or fallback to the web URL
      await Linking.openURL(facebookAppUrl);
    } catch (error) {
      console.log('Error opening Facebook app:', error);

      // Fallback to the web URL if the app is not installed
      Alert.alert(
        'Facebook App Not Installed',
        'Opening Facebook in your browser instead.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open', onPress: () => Linking.openURL(facebookWebUrl)},
        ],
      );
    }
  };

  const menuOptions = [
    {
      id: 1,
      name: 'MENUS.BIOGRAPHY',
      icon: 'user-circle',
      link: 'Biography',
    },
    // {
    //   id: 2,
    //   name: 'MENUS.MEDITATION_TIMETABLE',
    //   icon: 'calendar-alt',
    //   link: 'Timetable',
    // },
    // {
    //   id: 3,
    //   name: 'MENUS.JOURNEY',
    //   icon: 'place-of-worship',
    //   link: 'Missionary',
    // },
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
        <Text style={[styles.headerText, {fontSize: height * 0.025}]}>
          {t('TITLES.MORE')}
        </Text>
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
      <View style={styles.powerContainer}>
        <FontAwesomePro
          name="facebook"
          size={20}
          style={styles.icon}
          color={Colors[theme].primary}
          onPress={openFacebook}
        />

        <Text style={styles.power}>POWER BY ARCHIVO</Text>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'flex-start',
            gap: 10,
            paddingTop: 5,
          }}>
          <Text style={styles.power}>archivodevspace@gmail.com</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'flex-start',
            gap: 10,
          }}>
          <Text style={styles.power}>+ 959781-448-621</Text>
        </View>
      </View>
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
    powerContainer: {
      marginTop: 100,
      justifyContent: 'center',
      alignSelf: 'center',

      bottom: 100,
    },
    img: {
      width: 50,
      height: 50,
      alignSelf: 'center',
    },
    icon: {
      ...Platform.select({
        ios: {
          alignSelf: 'center',
          shadowColor: Colors[theme].text,
          shadowOffset: {width: 0, height: 5},
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          shadowColor: 'red',
          alignSelf: 'center',
          elevation: 10,
        },
      }),

      // iOS shadow properties

      // Android shadow properties
    },
    power: {
      color: Colors[theme].text,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
      paddingTop: 10,
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
