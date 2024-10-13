import React from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import Container from '../components/commons/Container';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../theme';
import Clipboard from '@react-native-clipboard/clipboard';
import {Feather, MaterialIcon} from '../utils/common';

const ContactScreen = () => {
  const {theme} = useThemeContext();
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

  return (
    <Container title="MENUS.CONTACT">
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.title]}>
            Dhammaramsi Mogok Vipasana Meditation Center
          </Text>
          <View>
            <Text style={styles.dataTitle}>Phone</Text>
            {/* First Phone  */}
            <View style={styles.contentContainer}>
              <TouchableOpacity onPress={() => dialPhoneNumber('09681060555')}>
                <MaterialIcon name="phone" color={Colors[theme].text} />
              </TouchableOpacity>
              <Text style={styles.subtitle}>09681060555</Text>
              <TouchableOpacity onPress={() => copyToClipboard('09681060555')}>
                <Feather name="copy" color={Colors[theme].text} />
              </TouchableOpacity>
            </View>
            {/* Second Phone  */}
            <View style={styles.contentContainer}>
              <TouchableOpacity onPress={() => dialPhoneNumber('09681061555')}>
                <MaterialIcon name="phone" color={Colors[theme].text} />
              </TouchableOpacity>
              <Text style={styles.subtitle}>09681061555</Text>
              <TouchableOpacity onPress={() => copyToClipboard('09681061555')}>
                <Feather name="copy" color={Colors[theme].text} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Email  */}
          <View>
            <Text style={styles.dataTitle}>Email</Text>
            <View style={styles.contentContainer}>
              <TouchableOpacity
                onPress={() => sendEmail('dhammaramsimedia@gmail.com')}>
                <MaterialIcon name="email" color={Colors[theme].text} />
              </TouchableOpacity>
              <Text style={styles.subtitle}>dhammaramsimedia@gmail.com</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard('dhammaramsimedia@gmail.com')}>
                <Feather name="copy" color={Colors[theme].text} />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.dataTitle}>Address</Text>
            <Text style={[styles.subtitle]}>
              Yangon - Mandalay Highway, Mile 1/1, Hlegu, Yangon, Myanmar{' '}
            </Text>
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
      paddingHorizontal: 10,
      // justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: Colors[theme].secondary_light,
      padding: 20,
      borderRadius: 10,
      gap: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors[theme].text,
    },
    subtitle: {
      fontSize: 16,
      color: Colors[theme].text,
      paddingLeft: 10,
    },
    dataTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 2,
      color: Colors[theme].text,
    },
    contentContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    customButton: {
      alignItems: 'flex-start',
      marginLeft: 20,
    },
    customText: {
      color: Colors[theme].text,
    },
  });
