import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Text,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

const ImageSlider = ({images}: {images: any}) => {
  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const customHeight = height * 0.3;

  console.log('width', width);
  const [active, setActive] = useState(0);

  const onScrollChange = ({nativeEvent}: any) => {
    const slide = Math.round(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    console.log('slide', slide);
    if (slide !== active) {
      setActive(slide);
    }
  };

  const styles = Styling(theme);

  return (
    <View>
      <ScrollView
        pagingEnabled
        horizontal
        onScroll={onScrollChange}
        showsHorizontalScrollIndicator={false}
        style={{width, height: customHeight}}>
        {images.map((image: any, index: any) => (
          <Image
            key={index}
            source={{uri: image}}
            style={{width, height: customHeight, resizeMode: 'cover'}}
          />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((i: any, k: any) => (
          <Text key={k} style={k == active ? styles.activeDot : styles.dot}>
            .
          </Text>
        ))}
      </View>
    </View>
  );
};

const Styling = (theme: Theme) =>
  StyleSheet.create({
    pagination: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
    },
    dot: {
      color: Colors[theme].primary_light,
      fontSize: 50,
    },
    activeDot: {
      color: Colors[theme].text,
      fontSize: 50,
    },
  });

export default ImageSlider;
