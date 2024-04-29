import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  StatusBar,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {AntDesign} from '../utils/common';
import {CustomButton} from '../components/utils';
type Item = {
  id: number;
  name: string;
  artist: string;
};

const data: Item[] = [
  {id: 1, name: 'Hello', artist: 'Artist hello'},
  {id: 2, name: 'Hello', artist: 'Artist hello'},
  {id: 3, name: 'Hello', artist: 'Artist hello'},
  {id: 4, name: 'Hello', artist: 'Artist hello'},
  {id: 5, name: 'Hello', artist: 'Artist hello'},
  {id: 6, name: 'Hello', artist: 'Artist hello'},
  {id: 7, name: 'Hello', artist: 'Artist hello'},
  {id: 8, name: 'Hello', artist: 'Artist hello'},
  {id: 9, name: 'Hello', artist: 'Artist hello'},
  {id: 10, name: 'Hello', artist: 'Artist hello'},
];

const Audios = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const [isPlayed, setIsPlayed] = useState<boolean[]>(
    Array(data.length).fill(false),
  );
  const styles = styling(theme);
  const {top, bottom, left, right} = insets;

  const handlePlayAudio = (index: number) => {
    setIsPlayed(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={{marginTop: top}}>
        <StatusBar translucent backgroundColor={'transparent'} />
        {data?.map(item => (
          <React.Fragment key={item.id}>
            <View style={styles.container}>
              <View style={styles.trackContainer}>
                <Image
                  source={require('../assets/marguerite.jpg')}
                  resizeMode="cover"
                  style={[
                    styles.img,
                    {height: height * 0.1, width: width * 0.2},
                  ]}
                />
                <View>
                  <Text style={styles.title}>In My Feelings</Text>
                  <Text style={styles.desc}>In My Feelings</Text>
                </View>
              </View>
              <CustomButton
                onPress={() => handlePlayAudio(item.id)}
                customButtonStyle={styles.btn}
                icon={
                  <AntDesign
                    name={isPlayed[item.id] ? 'pause' : 'caretright'}
                    size={25}
                    color={Colors[theme].text}
                  />
                }
              />
            </View>
            {data.length !== item?.id && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

export default Audios;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme].secondary,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 40,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    trackContainer: {
      gap: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    img: {
      // width:
    },
    btn: {
      backgroundColor: Colors[theme].secondary,
    },
    title: {
      fontSize: 22,
      color: Colors[theme].text,
    },
    desc: {
      fontSize: 15,
      color: Colors[theme].text,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
      marginVertical: 20,
    },
  });
