import {StyleSheet} from 'react-native';
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import DrawerNavigation from './DrawerNavigation';

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <DrawerNavigation />
    </NavigationContainer>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
