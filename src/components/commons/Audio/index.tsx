import {Image, StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

const data = [
  {id: 1, image: require('../../../assets/marguerite.jpg'), text: 'audio1'},
  {id: 2, image: require('../../../assets/marguerite.jpg'), text: 'audio2'},
  {id: 3, image: require('../../../assets/marguerite.jpg'), text: 'audio3'},
  // Add more items as needed
];

const Audios = () => {
  const {theme} = useThemeContext();
  const styles = styling(theme);

  const renderItem = ({item}: any) => (
    <View style={styles.container}>
      <Image source={item.image} resizeMode="cover" style={styles.img} />
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View>
      <Text style={styles.headerText}>Audios</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        contentContainerStyle={styles.mainContainer}
      />
    </View>
  );
};

export default Audios;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      paddingHorizontal: 10,
      paddingVertical: 20,
    },
    headerText: {
      color: Colors[theme].text,
      fontSize: 20,
      marginHorizontal: 10,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    container: {
      marginRight: 10,
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
