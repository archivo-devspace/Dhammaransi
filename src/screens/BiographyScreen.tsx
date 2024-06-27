import {Image, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import Container from '../components/commons/Container';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {ScrollView} from 'react-native-gesture-handler';

const BiographyScreen = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const customImageWidth = width * 0.4;
  const customImageHeight = width * 0.5;
  const styles = styling(theme);

  interface TextContentProps {
    item: {
      id: number;
      title: string;
      desc: string;
    };
  }

  const defaultText = [
    {
      id: 1,
      title: 'Where he was born!',
      desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut etperferendis quod dolor saepe voluptatem sint nam excepturi! Officia aliquam nam aut possimus omnis in sequi architecto mollitia deleniti natus fugiat, perspiciatis tempora eum pariatur nesciunt commodi, nihil sint atque numquam cum nostrum id? Id eius fugit, quos expedita repudiandae repellendus aut saepe doloribus perspiciatis asperiores aperiam consequuntur laborum porro architecto consequatur quisquam ipsum error dolores illo nam sequi mollitia officiis consectetur? Doloribus animi sequi saepe voluptas odio! Suscipit, recusandae expedita amet odio voluptate ratione. Eius ab eos esse fugit, facilis in inventore veniam rerum autem cupiditate dolores! Consequatur, iste?',
    },
    {
      id: 2,
      title: 'Where he was born!',
      desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut etperferendis quod dolor saepe voluptatem sint nam excepturi! Officia aliquam nam aut possimus omnis in sequi architecto mollitia deleniti natus fugiat, perspiciatis tempora eum pariatur nesciunt commodi, nihil sint atque numquam cum nostrum id? Id eius fugit, quos expedita repudiandae repellendus aut saepe doloribus perspiciatis asperiores aperiam consequuntur laborum porro architecto consequatur quisquam ipsum error dolores illo nam sequi mollitia officiis consectetur? Doloribus animi sequi saepe voluptas odio! Suscipit, recusandae expedita amet odio voluptate ratione. Eius ab eos esse fugit, facilis in inventore veniam rerum autem cupiditate dolores! Consequatur, iste?',
    },
    {
      id: 3,
      title: 'Where he was born!',
      desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut etperferendis quod dolor saepe voluptatem sint nam excepturi! Officia aliquam nam aut possimus omnis in sequi architecto mollitia deleniti natus fugiat, perspiciatis tempora eum pariatur nesciunt commodi, nihil sint atque numquam cum nostrum id? Id eius fugit, quos expedita repudiandae repellendus aut saepe doloribus perspiciatis asperiores aperiam consequuntur laborum porro architecto consequatur quisquam ipsum error dolores illo nam sequi mollitia officiis consectetur? Doloribus animi sequi saepe voluptas odio! Suscipit, recusandae expedita amet odio voluptate ratione. Eius ab eos esse fugit, facilis in inventore veniam rerum autem cupiditate dolores! Consequatur, iste?',
    },
    {
      id: 4,
      title: 'Where he was born!',
      desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut etperferendis quod dolor saepe voluptatem sint nam excepturi! Officia aliquam nam aut possimus omnis in sequi architecto mollitia deleniti natus fugiat, perspiciatis tempora eum pariatur nesciunt commodi, nihil sint atque numquam cum nostrum id? Id eius fugit, quos expedita repudiandae repellendus aut saepe doloribus perspiciatis asperiores aperiam consequuntur laborum porro architecto consequatur quisquam ipsum error dolores illo nam sequi mollitia officiis consectetur? Doloribus animi sequi saepe voluptas odio! Suscipit, recusandae expedita amet odio voluptate ratione. Eius ab eos esse fugit, facilis in inventore veniam rerum autem cupiditate dolores! Consequatur, iste?',
    },
  ];

  const textContent = ({item}: TextContentProps) => {
    return (
      <View style={styles.textContainer} key={item.id}>
        <Text style={styles.headerText}>{item.title}</Text>
        <Text style={styles.headerDesc}>{item.desc}</Text>
      </View>
    );
  };

  return (
    <Container title="MENUS.BIOGRAPHY">
      <ScrollView style={[styles.container, {width: width}]}>
        <View style={[styles.headerContainer, {width: width * 0.54}]}>
          <View
            style={{
              width: customImageWidth,
              height: customImageHeight,
            }}>
            <Image
              source={require('../assets/marguerite.jpg')}
              style={{width: '100%', height: '100%', borderRadius: 25}}
              resizeMode="cover"
            />
          </View>
          <View style={styles.headerContentContainer}>
            <Text style={styles.headerText}>Title text</Text>
            <Text style={styles.headerDesc}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis odit, ea neque omnis accusamus facere nisi mollitia.
              Tempora laborum nesciunt itaque soluta, minus harum numquam
              perspiciatis eum maxime amet.
            </Text>
          </View>
        </View>
        {defaultText?.map(item => textContent({item}))}
      </ScrollView>
    </Container>
  );
};

export default BiographyScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
    },
    headerContainer: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
    },
    headerContentContainer: {
      paddingTop: 10,
      gap: 10,
    },
    headerText: {
      fontSize: 20,
      color: Colors[theme].text,
      fontWeight: 'bold',
    },
    headerDesc: {
      fontSize: 15,
      color: Colors[theme].text,
    },
    textContainer: {
      alignItems: 'center',
      gap: 10,
    },
  });
