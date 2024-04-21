import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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

  const {height} = useWindowDimensions();

  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <StatusBar translucent backgroundColor="transparent" />
      <SafeAreaView
        style={{
          backgroundColor: Colors[theme]?.primary,

          padding: 10,
          paddingTop: height > 500 ? 48 : 30,
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
            flex: height > 500 ? 5.2 : 4.5,
            paddingVertical: 5,
            paddingHorizontal: 5,
            // borderBottomRightRadius: 20,
          }}>
          <ScrollView>
            <DrawerItemList {...props} />
          </ScrollView>
        </View>
        <View
          style={{
            flex: height > 500 ? 0.8 : 1.5,
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

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
      borderBottomRightRadius: 20,
    },
    profile: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
    },
    name: {
      color: Colors[theme]?.text,
      opacity: 0.8,
      fontWeight: '800',
      fontSize: 20,
      marginBottom: 8,
    },
  });
