import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  MainStackParamList,
  NavigationMainStackScreenProps,
} from '../navigations/StackNavigation';
import {RouteProp} from '@react-navigation/native';
import {useGetSinglePainting} from '../api_services/lib/queryhooks/usePainting';

interface MovieScreenProps {
  navigation: NavigationMainStackScreenProps['navigation'];
  route: RouteProp<MainStackParamList, 'Movie'>;
}

const MovieScreen = ({navigation, route}: MovieScreenProps) => {
  const item = route.params.item;
  console.log('item', item);
  const {data, isLoading, isError} = useGetSinglePainting(item.id.toString());
  console.log('single painting', data);
  return (
    <View>
      <Text>MovieScreen</Text>
    </View>
  );
};

export default MovieScreen;

const styles = StyleSheet.create({});
