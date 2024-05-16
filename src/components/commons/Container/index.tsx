import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';
import Header from '../Header';

interface ContainerProps {
  children: React.ReactNode;
  title: string;
}

const Container = ({children, title}: ContainerProps) => {
  const {theme} = useThemeContext();
  const styles = styling(theme);
  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      <Header title={title} />
      {children}
    </View>
  );
};

export default Container;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
    },
  });
