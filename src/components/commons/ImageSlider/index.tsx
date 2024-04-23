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

const ImageSlider = ({images}: {images: any}) => {
  const {width} = useWindowDimensions();
  const height = width * 0.7;

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

  return (
    <View>
      <ScrollView
        pagingEnabled
        horizontal
        onScroll={onScrollChange}
        showsHorizontalScrollIndicator={false}
        style={{width, height}}>
        {images.map((image: any, index: any) => (
          <Image
            key={index}
            source={{uri: image}}
            style={{width, height, resizeMode: 'cover'}}
          />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((i: any, k: any) => (
          <Text key={k} style={k == active ? styles.activeDot : styles.dot}>
            •
          </Text>
        ))}
      </View>
      {/* <LinearGradient
        colors={[
          'transparent',
          'rgba(23,23,25,0.3)',
          'rgba(23,23,23,0.7)',
          'transparent',
        ]}
        style={{
          width,
          height: height * 0.2,
          position: 'absolute',
          bottom: 0,
          opacity: 0.4,
        }}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
  },
  dot: {
    color: '#888',
    fontSize: 50,
  },
  activeDot: {
    color: '#FFF',
    fontSize: 50,
  },
});

export default ImageSlider;
