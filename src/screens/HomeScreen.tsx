import React, {useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';

import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
import {FontAwesome} from '../utils/common';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {images, menus, movies} from '../utils/constants';
import {Movies} from '../components/commons/Movies';
import ImageSlider from '../components/commons/ImageSlider';
import Audios from '../components/commons/Audio';
import TopNavigation from '../components/commons/TopNavigation';
import {useNavigation} from '@react-navigation/native';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const HomeScreen = ({navigation}: Props) => {
  // const navigation = useNavigation();
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const scrollA = useRef(new Animated.Value(0)).current;

  const customHeight = height * 0.3;

  const BANNER_H = height * 0.4;

  const styles = styling(theme);
  const platformIsIOS = Platform.OS === 'ios';
  const platformIsAndroid = Platform.OS === 'android';

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        barStyle={'default'}
        backgroundColor={'transparent'}
      />
      <TopNavigation title="Home" scrollA={scrollA} />
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {
            useNativeDriver: true,
          },
        )}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}>
        <View style={styles.bannerContainer}>
          <Animated.View
            style={[
              {
                width: '100%',
                transform: [
                  {
                    translateY: scrollA.interpolate({
                      inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
                      outputRange: [
                        -BANNER_H / 2,
                        0,
                        BANNER_H * 0.75,
                        BANNER_H * 0.75,
                      ],
                    }),
                  },
                  {scale: 1},
                ],
              },
              {height: customHeight - 16},
            ]}>
            <ImageSlider images={images} />
          </Animated.View>
        </View>
        <View
          style={{
            backgroundColor: Colors[theme]?.secondary,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            paddingBottom: 80,
            borderColor: Colors[theme]?.secondary_dark,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            gap: 10,
          }}>
          <View style={styles.menuContainer}>
            {menus?.map(menu => (
              <TouchableOpacity
                style={[
                  styles.menu,
                  {height: width < 500 ? height * 0.1 : height * 0.11},
                ]}
                key={menu.id}
                onPress={() => navigation.navigate(menu.link as any)}>
                <FontAwesome
                  name={menu.icon}
                  size={30}
                  color={Colors[theme].primary}
                />
                <Text style={{color: Colors[theme].text}}>{menu.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Movies data={movies} navigation={navigation} />
          <Audios data={movies} navigation={navigation} />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
    },
    menuContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',

      flexWrap: 'wrap',
      gap: 10,
      columnGap: 10,
      marginVertical: 20,
    },
    menu: {
      backgroundColor: Colors[theme].secondary_light,
      borderRadius: 10,
      width: '45%',
      ...Platform.select({
        ios: {
          shadowColor: '#52006A',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        android: {
          elevation: 10,
        },
      }),
      padding: 5,
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bannerContainer: {
      marginTop: -1000,
      paddingTop: 1000,
      alignItems: 'center',
      overflow: 'visible',
    },
  });

export default HomeScreen;
