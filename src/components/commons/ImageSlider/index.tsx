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
      const scrollToX = nextIndex * width;
      const step = 60; // Increase for slower animation, decrease for faster
      const duration = 3000; // Total duration of the animation in milliseconds
      const steps = Math.floor(duration / step);
      let currentStep = 0;
      const timer = setInterval(() => {
        scrollViewRef.current?.scrollTo({
          x: scrollToX,
          animated: true,
        });
        currentStep++;
        if (currentStep >= steps) {
          clearInterval(timer);
          scrollViewRef.current?.scrollTo({x: scrollToX, animated: true});
        }
      }, step);
    }, 10000);

    return () => clearInterval(interval);
  }, [active]);

  const styles = Styling(theme);

  return (
    <View>
      <ScrollView
        pagingEnabled
        horizontal
        scrollEventThrottle={32}
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
