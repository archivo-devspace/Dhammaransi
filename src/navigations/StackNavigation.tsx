// StackNavigator.tsx
import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MovieScreen from '../screens/MovieScreen';
import Audios from '../screens/Audios';
import Pdf from '../screens/Pdf';

// import { RootStackParamList } from './AppNavigation';

export interface MovieProps {
  id: number;
  image: string;
  name: string;
  desc: string;
}

export type MainStackParamList = {
  Home: undefined;
  Movie: {
    item: MovieProps;
  };
  Audios: undefined;
  Pdf: undefined;
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
      <Stack.Screen name="Audios" component={Audios} />
      <Stack.Screen name="Pdf" component={Pdf} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
