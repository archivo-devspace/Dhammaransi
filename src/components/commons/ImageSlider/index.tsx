/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  useWindowDimensions,
} from 'react-native';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

const ImageSlider = ({images}: {images: any}) => {
  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const customHeight = height * 0.36;

  // Duplicate images for infinite scrolling
  const infiniteImages = images ? [images[images?.length - 1], ...images, images[0]] : [];

  const [active, setActive] = useState(1); // Start from the first actual image

  const onScrollChange = ({nativeEvent}: any) => {
    // Check if scroll has completed by comparing contentOffset with layoutMeasurement
    const contentOffsetX = nativeEvent.contentOffset.x;
    const layoutWidth = nativeEvent.layoutMeasurement.width;
    const currentSlide = Math.round(contentOffsetX / layoutWidth);

    // Only update the active state if it has fully scrolled to the next image
    if (currentSlide !== active) {
      setActive(currentSlide);
    }
  };

  const scrollViewRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (active + 1) % infiniteImages.length;
      const scrollToX = nextIndex * width;

      // Add easing effect while scrolling
      let currentOffset = active * width;
      const distance = scrollToX - currentOffset;
      const duration = 1000; // Duration of the animation in milliseconds
      const frames = 60; // Number of frames for the animation
      const increment = distance / frames;
      let frame = 0;

      const smoothScroll = () => {
        frame += 1;
        currentOffset += increment;
        scrollViewRef.current?.scrollTo({
          x: currentOffset,
          animated: false, // Disable native animation, using custom steps
        });

        if (frame < frames) {
          requestAnimationFrame(smoothScroll);
        }
      };

      smoothScroll();
      setActive(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [active]);

  // Adjust active index when reaching duplicated images
  useEffect(() => {
    if (active === 0) {
      // If swiped to the left of the first image, reset to the last image
      scrollViewRef.current?.scrollTo({
        x: (infiniteImages.length - 2) * width,
        animated: false,
      });
      setActive(infiniteImages.length - 2);
    } else if (active === infiniteImages.length - 1) {
      // If swiped to the right of the last image, reset to the first image
      scrollViewRef.current?.scrollTo({x: width, animated: false});
      setActive(1);
    }
  }, [active]);

  // Correct the active dot to map it to the real image index
  const realActiveIndex =
    active === 0
      ? images.length - 1
      : active === infiniteImages.length - 1
      ? 0
      : active - 1;

  const styles = Styling(theme);

  return (
    <View>
      <ScrollView
       scrollEventThrottle={16}
        pagingEnabled
        horizontal
        onMomentumScrollEnd={onScrollChange} // Use this for updating active after full scroll
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        style={{width, height: customHeight}}>
        {infiniteImages?.map((image: any, index: any) => (
          <Image
            key={index}
            source={{uri: image}}
            style={{width, height: customHeight, resizeMode: 'cover'}}
          />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images?.map((i: any, k: any) => (
          <Text
            key={k}
            style={k === realActiveIndex ? styles.activeDot : styles.dot}>
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
      color: Colors[theme].text,
      fontSize: 50,
    },
    activeDot: {
      color: Colors[theme].primary,
      fontSize: 50,
    },
  });

export default ImageSlider;
