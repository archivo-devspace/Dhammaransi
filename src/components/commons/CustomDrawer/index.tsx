import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Colors} from '../../../theme';
import App from './../../../../App';
import {FontAwesome} from '../../../utils/common';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const {theme, setTheme} = useThemeContext();

  const styles = styling(theme);

  // const themeColors = Colors[theme];

  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <StatusBar translucent backgroundColor="transparent" />
      <SafeAreaView
        style={{
          backgroundColor: Colors[theme]?.primary,
          width: undefined,
          padding: 16,
          paddingTop: 52,
          borderTopRightRadius: 20,
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../../assets/lotus.png')}
            style={styles.profile}
          />

          <Text style={styles.name}>Myat Dhamma</Text>
        </View>
      </SafeAreaView>
      <View style={styles.mainContainer}>
        <View
          style={{
            backgroundColor: Colors[theme]?.secondary_light,
            flex: 5.2,
            paddingTop: 20,
            paddingHorizontal: 5,
            // borderBottomRightRadius: 20,
          }}>
          <DrawerItemList {...props} />
        </View>
        <View
          style={{
            flex: 0.8,
            justifyContent: 'center',
            borderBottomRightRadius: 20,
            backgroundColor: Colors[theme]?.secondary,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}>
            <FontAwesome
              name="bookmark"
              size={26}
              color={Colors[theme]?.primary}
            />
            <Text style={{color: Colors[theme]?.text}}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default CustomDrawer;

type ThemeColors = {
  primary: string;
  primary_light: string;
  primary_dark: string;
  secondary: string;
  secondary_light: string;
  success: string;
  warnning: string;
  danger: string;
  text: string;
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
      borderBottomRightRadius: 20,
    },
    profile: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
    name: {
      color: Colors[theme]?.text,
      opacity: 0.8,
      fontWeight: '800',
      fontSize: 20,
      marginVertical: 8,
    },
  });
