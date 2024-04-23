import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  MainStackParamList,
  NavigationMainStackScreenProps,
} from '../navigations/StackNavigation';
import {RouteProp} from '@react-navigation/native';

interface MovieScreenProps {
  navigation: NavigationMainStackScreenProps['navigation'];
  route: RouteProp<MainStackParamList, 'Movie'>;
}

const MovieScreen = ({navigation, route}: MovieScreenProps) => {
  const item = route.params.item;
  console.log('item', item);
  return (
    <View>
      <Text>MovieScreen</Text>
    </View>
  );
};

export default MovieScreen;

const styles = StyleSheet.create({});
