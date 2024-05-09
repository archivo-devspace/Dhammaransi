import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

type Props = {
  items: any;
};

const RenderItem = ({items}: Props) => {
  const {theme} = useThemeContext();
  const styles = styling(theme);
  return (
    <>
      {items.map((item: any) => {
        return (
          <View style={[styles.container]}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image} />
            </View>
            <Text style={styles.text}>{item.title}</Text>
            <Text style={styles.text}>{item.id}</Text>
          </View>
        );
      })}
    </>
  );
};

export default RenderItem;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 14,
      marginHorizontal: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    imageContainer: {
      backgroundColor: '#572ce8',
      padding: 10,
      borderRadius: 8,
    },
    image: {
      width: 30,
      height: 30,
    },
    text: {
      color: Colors[theme].text,
      fontSize: 16,
    },
  });
