import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import Container from '../components/commons/Container';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {AntDesign} from '../utils/common';
import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const MissionaryScreen = ({navigation}: Props) => {
  const {height, width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const customImageWidth = width * 0.2;
  const customImageHeight = width * 0.3;
  const styles = styling(theme);
  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleNavigate = (id: number) => {
    navigation.navigate('MissionDetail', {id});
  };

  const Card = (item: any) => {
    return (
      <Pressable
        style={styles.cardContainer}
        key={Date.now()}
        onPress={() => handleNavigate(item)}>
        <Image
          source={require('../assets/marguerite.jpg')}
          style={[
            {width: customImageWidth, height: customImageHeight},
            styles.cardImage,
          ]}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Title for Missionary</Text>
          <Text style={[styles.description, {width: width * 0.7}]}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem vel
            iusto molestiae alias ipsum officia asperiores magnam maxime commodi
            autem?
          </Text>
          <View style={styles.arrowButton}>
            <AntDesign
              name={'arrowright'}
              size={20}
              color={Colors[theme].primary}
            />
          </View>
        </View>
      </Pressable>
    );
  };
  return (
    <Container title="MENUS.JOURNEY">
      <ScrollView style={[styles.contentContainer, {width: width}]}>
        {items?.map(item => Card(item))}
      </ScrollView>
    </Container>
  );
};

export default MissionaryScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    contentContainer: {
      paddingHorizontal: 10,
    },
    cardContainer: {
      flexDirection: 'row',
      gap: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
      padding: 10,
      borderWidth: 1,
      borderColor: Colors[theme]?.secondary_light,
      backgroundColor: Colors[theme].secondary,
      marginBottom: 8,
      borderRadius: 8,
    },
    cardImage: {
      borderRadius: 20,
    },
    textContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    title: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
    description: {
      flexWrap: 'wrap',
    },
    arrowButton: {
      position: 'absolute',
      right: 0,
      bottom: 10,
      width: 'auto',
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: Colors[theme].primary,
      padding: 2,
      borderRadius: 10,
    },
  });
