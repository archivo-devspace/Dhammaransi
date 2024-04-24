import {StyleSheet} from 'react-native';
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import DrawerNavigation from './DrawerNavigation';
import BottomNavigation from './BottomNavigation';

const AppNavigation = () => {
  return (
    <NavigationContainer>
      {/* <DrawerNavigation /> */}
      <BottomNavigation />
    </NavigationContainer>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
