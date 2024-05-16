import {
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors} from '../theme';
import {ebooks} from '../utils/constants';

import Header from '../components/commons/Header';

const PaintingsScreen = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = styling(theme);
  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Header title="MENUS.PICTURES" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {ebooks?.map(ebook => (
          <React.Fragment key={ebook.id}>
            <View style={styles.contentContainer}>
              <Pressable style={styles.contentContainer}>
                <View
                  style={[
                    styles.img,
                    {
                      width: width * 0.9,
                      height: height * 0.18,
                    },
                  ]}>
                  <Image
                    style={{width: '100%', height: '100%', borderRadius: 10}}
                    source={{uri: ebook.image}}
                    resizeMode="cover"
                  />
                </View>

                <Text style={styles.text}>{ebook.title}</Text>
              </Pressable>
            </View>
            {ebooks.length !== ebook?.id && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

export default PaintingsScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme].secondary,
    },
    container: {
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    contentContainer: {
      // flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    text: {
      fontWeight: 'bold',
      color: Colors[theme].text,
      fontSize: 18,
    },
    img: {
      borderRadius: 100,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
      marginVertical: 20,
    },
    btn: {},
  });
