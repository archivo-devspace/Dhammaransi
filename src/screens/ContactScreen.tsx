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
              customButtonStyle={styles.customButton}
              customButtonTextStyle={styles.subtitle}
              endIcon={<Feather name="copy" />}
              title="09681060555"
              onPress={() => Clipboard.setString('09681060555')}
            />
            <CustomButton
              customButtonStyle={styles.customButton}
              customButtonTextStyle={styles.subtitle}
              endIcon={<Feather name="copy" />}
              title="09681061555"
              onPress={() => Clipboard.setString('09681061555')}
            />
          </View>
          <View>
            <Text style={styles.dataTitle}>Email</Text>
            <CustomButton
              customButtonStyle={styles.customButton}
              customButtonTextStyle={styles.subtitle}
              endIcon={<Feather name="copy" />}
              title="dhammaramsimedia@gmail.com"
              onPress={() => Clipboard.setString('dhammaramsimedia@gmail.com')}
            />
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
    customButton: {
      alignItems: 'flex-start',
      marginLeft: 20,
    },
    customText: {
      color: Colors[theme].text,
    },
  });
