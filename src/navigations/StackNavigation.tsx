// StackNavigator.tsx
import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MovieScreen from '../screens/MovieScreen';
import Audios from '../screens/AudioListScreen';
import MovieListScreen from '../screens/MovieListScreen';
import PaintingsScreen from '../screens/PaintingListScreen';
import PdfListScreen from '../screens/PdfListScreen';
import TrackScreen from '../screens/TrackScreen';

export interface MovieProps {
  id: number;
  image: string;
  name: string;
  desc: string;
}

export type MainStackParamList = {
  Home: undefined;
  MovieLists: undefined;
  Movie: {
    item: MovieProps;
  };
  Audios: undefined;
  Pdf: undefined;
  Painting: undefined;
  Biography: undefined;
  Timetable: undefined;
  Contact: undefined;
  More: undefined;
  Missionary: undefined;
  Track: undefined;
  Setting: undefined;
};

export type NavigationMainStackScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList>;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false, animation: 'fade_from_bottom'}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Movie" component={MovieScreen} />
      <Stack.Screen name="MovieLists" component={MovieListScreen} />
      <Stack.Screen name="Audios" component={Audios} />
      <Stack.Screen name="Pdf" component={PdfListScreen} />
      <Stack.Screen name="Painting" component={PaintingsScreen} />
      <Stack.Screen name="Track" component={TrackScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
