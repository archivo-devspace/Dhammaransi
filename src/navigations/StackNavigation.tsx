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
import MoreScreen from '../screens/MoreScreen';
import BiographyScreen from '../screens/BiographyScreen';
import ContactScreen from '../screens/ContactScreen';
import TimetableScreen from '../screens/TimetableScreen';
import MissionaryScreen from '../screens/MissionaryScreen';
import LanguageScreen from '../screens/LanguagesScreen';
import SettingScreen from '../screens/SettingScreen';
import BottomTapNavigator from './BottomNavigation';
import TrackPopupScreen from '../screens/TrackPopupScreen';

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
  Audios: {
    item: MovieProps | null;
  };
  Pdf: undefined;
  Painting: undefined;
  Biography: undefined;
  Timetable: undefined;
  Contact: undefined;
  More: undefined;
  Missionary: undefined;
  Track: undefined;

  Setting: undefined;
  Languages: undefined;
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
      <Stack.Screen name="Home" component={BottomTapNavigator} />
      <Stack.Screen name="Movie" component={MovieScreen} />
      <Stack.Screen name="MovieLists" component={MovieListScreen} />
      <Stack.Screen name="Audios" component={Audios} />
      <Stack.Screen name="Pdf" component={PdfListScreen} />
      <Stack.Screen name="Painting" component={PaintingsScreen} />
      <Stack.Screen name="Track" component={TrackPopupScreen} />

      <Stack.Screen name="More" component={MoreScreen} />
      <Stack.Screen name="Biography" component={BiographyScreen} />
      <Stack.Screen name="Timetable" component={TimetableScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Missionary" component={MissionaryScreen} />
      <Stack.Screen name="Languages" component={LanguageScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
