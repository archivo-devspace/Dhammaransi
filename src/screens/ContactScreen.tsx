import React from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import Container from '../components/commons/Container';
import {StyleSheet, Text, View} from 'react-native';

import {Colors} from '../theme';
import Clipboard from '@react-native-clipboard/clipboard';
import {CustomButton} from '../components/utils';
import {Feather} from '../utils/common';

const ContactScreen = () => {
  const {theme} = useThemeContext();
  const styles = styling(theme);
  const copyToClipboard = () => {
    Clipboard.setString('hello');
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
            <CustomButton
              endIcon={<Feather name="copy" />}
              title="09681060555"
              onPress={copyToClipboard}
            />
            <Text style={styles.subtitle}>09681060555</Text>
            <Text style={styles.subtitle}>09681061555</Text>
          </View>
          <View>
            <Text style={styles.dataTitle}>Email</Text>
            <Text style={styles.email}>dhammaramsimedia@gmail.com</Text>
          </View>
          <View>
            <Text style={styles.dataTitle}>Address</Text>
            <Text style={styles.subtitle}>
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
    email: {
      fontSize: 14,
      color: Colors[theme].text,
      borderBottomColor: Colors[theme].primary,
      paddingLeft: 10,
    },
  });
