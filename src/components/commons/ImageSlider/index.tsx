import React, {useEffect, useState} from 'react';
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

  const [active, setActive] = useState(0);

  const onScrollChange = ({nativeEvent}: any) => {
    const slide = Math.round(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };

  const scrollViewRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (active + 1) % images.length;
      setActive(nextIndex);
      scrollViewRef.current?.scrollTo({
        animated: true,
        x: nextIndex * width,
        y: 0,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [active]);

  const styles = Styling(theme);

  return (
    <View>
      <ScrollView
        pagingEnabled
        horizontal
        onScroll={onScrollChange}
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
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
