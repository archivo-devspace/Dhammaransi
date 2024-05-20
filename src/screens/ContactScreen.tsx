import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LoadingSpinner from '../components/utils/LoadingSpinner';

const ContactScreen = () => {
  console.log('loading...');
  return (
    <View>
      <Text>ContactScreen</Text>
      <LoadingSpinner durationMs={1500} />
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({});
