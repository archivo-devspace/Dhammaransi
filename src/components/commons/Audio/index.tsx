import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';

const Audios = () => {
  return (
    <ScrollView>
      <View>
        <Image source={require('../../../assets/marguerite.jpg')} />
        <Text>audio1</Text>
      </View>
    </ScrollView>
  );
};

export default Audios;

const styles = StyleSheet.create({});
