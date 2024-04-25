import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const MovieListScreen = () => {
  return (
    <View>
      <SafeAreaView />
      <StatusBar />
      <Text>MovieListScreen</Text>
    </View>
  );
};

export default MovieListScreen;

const styles = StyleSheet.create({});
