import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import {Colors} from '../theme';
import {useThemeContext} from '../contexts/ThemeContext';

const ContactScreen = () => {
  const {theme} = useThemeContext();
  console.log('loading...');
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors[theme].secondary,
      }}>
      <Text>ContactScreen</Text>
      <LoadingSpinner
        durationMs={1500}
        loaderSize={70}
        bgColor={Colors[theme].secondary_dark}
        color={Colors[theme].primary_light}
        loadingText="LOADING"
        loadingTextColor={Colors[theme].primary}
        loadingTextSize={8}
      />
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({});
