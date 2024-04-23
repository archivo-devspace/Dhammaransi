import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';
import {remToPx} from '../../../utils/common';

const Audios = () => {
  const {theme} = useThemeContext();
  const styles = styling(theme);
  return (
    <View>
      <Text style={styles.headerText}>Audios</Text>
      <ScrollView horizontal contentContainerStyle={styles.mainContainer}>
        <View style={styles.container}>
          <Image
            source={require('../../../assets/marguerite.jpg')}
            resizeMode="cover"
            style={styles.img}
          />
          <Text style={styles.text}>audio1</Text>
        </View>
        <View style={styles.container}>
          <Image
            source={require('../../../assets/marguerite.jpg')}
            resizeMode="cover"
            style={styles.img}
          />
          <Text style={styles.text}>audio1</Text>
        </View>
        <View style={styles.container}>
          <Image
            source={require('../../../assets/marguerite.jpg')}
            resizeMode="cover"
            style={styles.img}
          />
          <Text style={styles.text}>audio1</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Audios;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      marginHorizontal: 10,
      marginVertical: 20,
      gap: 10,
    },
    headerText: {
      color: Colors[theme].text,
      fontSize: 20,
      marginHorizontal: 10,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    container: {
      gap: 2,
    },
    img: {
      width: 85,
      height: 85,
      borderRadius: 100,
    },
    text: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: Colors[theme].text,
    },
  });
