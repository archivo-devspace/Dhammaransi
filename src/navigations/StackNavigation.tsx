// StackNavigator.tsx
import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

// import { RootStackParamList } from './AppNavigation';

export type MainStackParamList = {
  Home: undefined;
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
    </Stack.Navigator>
  );
};

export default StackNavigation;
