import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationMainBottomTabScreenProps} from '../navigations/BottomNavigation';
import {MainStackParamList} from '../navigations/StackNavigation';
import {RouteProp} from '@react-navigation/native';

type Props = {
  route: RouteProp<MainStackParamList, 'MissionDetail'>;
  navigation: NavigationMainBottomTabScreenProps['navigation'];
};

const MissionDetailScreen = ({navigation, route}: Props) => {
  const {id} = route.params;
  console.log('id', id);
  return (
    <View>
      <Text>MissionDetailScreen</Text>
    </View>
  );
};

export default MissionDetailScreen;

const styles = StyleSheet.create({});
