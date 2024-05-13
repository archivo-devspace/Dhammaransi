import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors} from '../theme';
import {CustomButton} from '../components/utils';
import {Ionicons} from '../utils/common';
import {ebooks} from '../utils/constants';

const PdfListScreen = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const {top} = inset;
  const styles = styling(theme);
  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Text style={[{marginTop: top}, styles.headerText]}>တရားစာအုပ်များ</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {ebooks?.map(ebook => (
          <View key={ebook.id} style={[styles.contentContainer, {}]}>
            <View style={styles.contentContainer}>
              <View
                style={[
                  styles.img,
                  {
                    width: width * 0.2,
                    height: height * 0.16,
                  },
                ]}>
                <Image
                  style={{width: '100%', height: '100%', borderRadius: 10}}
                  source={{uri: ebook.image}}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.text}>{ebook.title}</Text>
            </View>
            <CustomButton
              onPress={() => console.log('hello')}
              icon={
                <Ionicons
                  name={`cloud-download-outline`}
                  size={30}
                  color={Colors[theme].text}
                />
              }
              customButtonStyle={styles.btn}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PdfListScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {},
    headerText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors[theme].text,
      textAlign: 'center',
      marginBottom: 10,
    },
    container: {
      paddingHorizontal: 30,
      paddingBottom: 150,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
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
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 4,
        },
      }),
    },
    btn: {},
  });
