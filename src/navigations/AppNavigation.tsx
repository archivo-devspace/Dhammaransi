import {StyleSheet} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';
import StackNavigation from './StackNavigation';

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
