import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useNavigation, NavigationProp} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
import {theme} from '../theme';
// import {
//   NavigationScreenProps,
//   RootStackParamList,
// } from '../navigation/AppNavigation';

export type MovieProps = {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type ApiResponse<T> = {
  page: number;
  results: Array<T>;
  total_pages: number;
  total_results: number;
};

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'] & {
    openDrawer?: () => void; // Add openDrawer function to the navigation prop type
  };
};

const HomeScreen = ({navigation}: Props) => {
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="default" backgroundColor="black" />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.topView}>
          <FontAwesome
            size={30}
            name="user"
            color={theme.primary}
            onPress={navigation.openDrawer}
          />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{}}></ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'gray',
  },
  safeAreaView: {
    marginBottom: Platform.OS === 'ios' ? 8 : 12,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  text: {},
});

export default HomeScreen;
