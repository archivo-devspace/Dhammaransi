/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { Theme, useThemeContext } from '../contexts/ThemeContext';
import {
  AntDesign,
  FontAwesome,
  FontAwesomePro,
  getFontFamily,
  MaterialIcon,
  MaterialIcons,
  Zocial,
} from '../utils/common';
import { NavigationMainStackScreenProps } from '../navigations/StackNavigation';
import { CustomButton } from '../components/utils';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const MoreScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { theme } = useThemeContext();
  const { height } = useWindowDimensions();
  const { t } = useTranslation();
  const styles = styling(theme);
  const { top } = insets;

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
      await Linking.openURL(facebookAppUrl);
    } catch (error) {
      Alert.alert(
        'Facebook App Not Installed',
        'Opening Facebook in your browser instead.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open', onPress: () => Linking.openURL(facebookWebUrl) },
        ],
      );
    }
  };

  const makePhoneCall = async () => {
    const phoneNumber = 'tel:+959781448621';
    try {
      await Linking.openURL(phoneNumber);
    } catch (error) {
      Alert.alert('Unable to make a phone call');
    }
  };

  const sendEmail = async () => {
    const email = 'mailto:archivodevspace@gmail.com';
    try {
      await Linking.openURL(email);
    } catch (error) {
      Alert.alert('Unable to send an email');
    }
  };

  // const openWebsite = async () => {
  //   const websiteUrl = '';
  //   try {
  //     await Linking.openURL(websiteUrl);
  //   } catch (error) {
  //     Alert.alert('Unable to open website');
  //   }
  // };

  const menuOptions = [
    {
      id: 1,
      name: 'MENUS.BIOGRAPHY',
      icon: 'user-circle',
      link: 'Biography',
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
      <View style={{ marginTop: top + 10 }}>
        <Text style={[styles.headerText, { fontSize: height * 0.026 }]}>
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
                  <Text
                    style={{
                      color: Colors[theme].text,
                      fontSize: height * 0.022,
                      fontFamily: getFontFamily('regular'),
                    }}>
                    {t(menu.name)}
                  </Text>
                </View>
                <AntDesign
                    name={'right'}
                    size={26}
                    color={Colors[theme].primary}
                  />
              </View>
            </CustomButton>
            {menuOptions.length !== menu.id && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </ScrollView>
      <View style={styles.powerContainer}>
        <TouchableOpacity onPress={openFacebook}>
          <Image
            key={'logo'}
            source={require('../assets/power.png')}
            style={{
              width: 50,
              height: 50,
              resizeMode: 'contain',
              alignSelf: 'center',
            }}

          />
        </TouchableOpacity>

        <Text style={styles.power}>Powered by ARCHIVO</Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: getFontFamily('regular'),
            color: Colors[theme].text,
            opacity: 0.8,
            paddingTop: 10,
          }}>
          Connecting minds, creating features
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'flex-start',
            gap: 26,
            paddingTop: 20,
          }}>
          <TouchableOpacity onPress={makePhoneCall}>
            <MaterialIcons
              name="local-phone"
              size={20}
              style={styles.icon}
              color={Colors[theme].text}

            />
          </TouchableOpacity>

          <TouchableOpacity onPress={openFacebook}
          >
            <FontAwesomePro
              name="facebook"
              size={20}
              style={styles.icon}
              color={Colors[theme].text}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={sendEmail}
          >
            <Zocial
              name="email"
              size={20}
              style={styles.icon}
              color={Colors[theme].text}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={openWebsite}
          >
            <MaterialIcon
              name="web"
              size={20}
              style={styles.icon}
              color={Colors[theme].text}
            />
          </TouchableOpacity> */}
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
      bottom: '12%',
    },
    icon: {
      ...Platform.select({
        ios: {
          alignSelf: 'center',
          shadowColor: Colors[theme].text,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          alignSelf: 'center',
          elevation: 10,
        },
      }),
    },
    power: {
      color: Colors[theme].text,
      fontSize: 14,
      fontFamily: getFontFamily('regular'),
      textAlign: 'center',
    },
    headerText: {
      textAlign: 'center',
      fontFamily: getFontFamily('regular'),
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
