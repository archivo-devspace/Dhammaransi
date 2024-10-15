/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import Container from '../components/commons/Container';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../theme';
import Clipboard from '@react-native-clipboard/clipboard';
import {Feather, MaterialIcons, Zocial, getFontFamily} from '../utils/common';
import {useTranslation} from 'react-i18next';

const ContactScreen = () => {
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const styles = styling(theme);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };

  const sendEmail = (email: string) => {
    const gmailURL = `mailto:${email}`;
    Linking.openURL(gmailURL);
  };

  const dialPhoneNumber = (phone: string) => {
    const phoneURL = `tel:${phone}`;
    Linking.openURL(phoneURL);
  };

  const openGoogleMaps = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <Container title="MENUS.CONTACT">
      <View style={styles.container}>
        <View style={[styles.card]}>
          {/* Content  */}
          <View style={{gap: 30}}>
            <Text style={[styles.title, {textAlign: 'center'}]}>
              Dhammaramsi Mogok Vipasana Meditation Center
            </Text>
            {/* Phone  */}
            <View style={{gap: 5}}>
              {/* <Text style={styles.dataTitle}>{t('UTILS.PHONE_NO')}</Text> */}
              {/* First Phone  */}
              <View style={[styles.contentContainer, {marginBottom: 10}]}>
                <TouchableOpacity
                  onPress={() => dialPhoneNumber('09681060555')}>
                  <MaterialIcons
                    name="local-phone"
                    size={20}
                    color={Colors[theme].primary_light}
                  />
                </TouchableOpacity>
                <Text style={styles.subtitle}>09681060555</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard('09681060555')}>
                  <Feather name="copy" size={20} color={Colors[theme].text} />
                </TouchableOpacity>
              </View>
              {/* Second Phone  */}
              <View style={styles.contentContainer}>
                <TouchableOpacity
                  onPress={() => dialPhoneNumber('09681061555')}>
                  <MaterialIcons
                    name="local-phone"
                    size={20}
                    color={Colors[theme].primary_light}
                  />
                </TouchableOpacity>
                <Text style={styles.subtitle}>09681061555</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard('09681061555')}>
                  <Feather name="copy" size={20} color={Colors[theme].text} />
                </TouchableOpacity>
              </View>
            </View>
            {/* Email  */}
            <View>
              {/* <Text style={styles.dataTitle}>{t('UTILS.EMAIL')}</Text> */}
              <View style={styles.contentContainer}>
                <TouchableOpacity
                  onPress={() => sendEmail('dhammaramsimedia@gmail.com')}>
                  <Zocial
                    name="email"
                    size={20}
                    color={Colors[theme].primary_light}
                  />
                </TouchableOpacity>
                <Text style={styles.subtitle}>dhammaramsimedia@gmail.com</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard('dhammaramsimedia@gmail.com')}>
                  <Feather name="copy" size={20} color={Colors[theme].text} />
                </TouchableOpacity>
              </View>
            </View>
            {/* Address  */}
            <View style={{paddingRight: 15}}>
              {/* <Text style={styles.dataTitle}>{t('UTILS.ADDRESS')}</Text> */}
              <View style={[styles.contentContainer]}>
                <TouchableOpacity
                  onPress={() => openGoogleMaps('346M+9RR, Yangon')}>
                  <Feather
                    name="map-pin"
                    size={20}
                    color={Colors[theme].primary_light}
                  />
                </TouchableOpacity>
                <Text style={[styles.subtitle]}>{t('UTILS.ADDRESS_DATA')}</Text>
              </View>
            </View>
          </View>
          <View style={styles.warningContainer}>
            <Text style={styles.dataTitle}>{t('UTILS.WARNING_TEXT')}</Text>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default ContactScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 15,
    },
    card: {
      backgroundColor: Colors[theme].secondary_light,
      justifyContent: 'space-between',
      height: '97%',
      padding: 20,
      borderRadius: 10,
      gap: 30,
    },
    title: {
      fontFamily: getFontFamily('bold'),
      fontSize: 24,
      color: Colors[theme].text,
    },
    subtitle: {
      fontFamily: getFontFamily('thin'),
      fontSize: 18,
      color: Colors[theme].text,
    },
    dataTitle: {
      fontFamily: getFontFamily('thin'),
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
      color: Colors[theme].text,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    warningContainer: {
      backgroundColor: Colors[theme].primary_light,
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
