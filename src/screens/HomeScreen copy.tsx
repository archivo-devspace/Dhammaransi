// import {
//   View,
//   Text,
//   StatusBar,
//   StyleSheet,
//   Platform,
//   TouchableOpacity,
//   ScrollView,
//   ImageSourcePropType,
//   Image,
//   useWindowDimensions,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {SafeAreaView} from 'react-native-safe-area-context';

// import {useNavigation, NavigationProp} from '@react-navigation/native';

// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';
// // import {theme} from '../theme';
// import {AntDesign, FontAwesome} from '../utils/common';
// import {Theme, useThemeContext} from '../contexts/ThemeContext';
// import {Colors} from '../theme';
// import {images, movies} from '../utils/constants';
// import {Movies} from '../components/commons/Movies';
// import ImageSlider from '../components/commons/ImageSlider';
// import Animated from 'react-native-reanimated';
// import {CustomButton} from '../components/utils';

// export type ApiResponse<T> = {
//   page: number;
//   results: Array<T>;
//   total_pages: number;
//   total_results: number;
// };

// type Props = {
//   navigation: NavigationMainStackScreenProps['navigation'] & {
//     openDrawer?: () => void; // Add openDrawer function to the navigation prop type
//   };
// };

// const HomeScreen = ({navigation}: Props) => {
//   const {theme} = useThemeContext();
//   const {width, height} = useWindowDimensions();

//   // console.log('theme', theme);
//   const styles = styling(theme);
//   // const scrollA = useRef(new Animated.Value(0)).current;
//   return (
//     <>
//       <ScrollView
//         style={styles.mainContainer}
//         // onScroll={Animated.event([
//         // {nativeEvent: {contentOffset:{y:scrollA}}}
//         // ])}
//       >
//         <StatusBar translucent backgroundColor={'transparent'} />

//         {/**header bar */}
//         <SafeAreaView style={styles.topView}>
//           <CustomButton
//             icon={
//               <AntDesign
//                 name="menu-fold"
//                 size={30}
//                 color={Colors[theme].text}
//               />
//             }
//             onPress={navigation.openDrawer}
//             customButtonStyle={styles.btn}
//           />
//         </SafeAreaView>
//         <View>
//           <ImageSlider images={images} />
//         </View>
//         {/* Dhamma movies  */}
//         <Movies data={movies} navigation={navigation} />
//       </ScrollView>
//     </>
//   );
// };

// const styling = (theme: Theme) =>
//   StyleSheet.create({
//     mainContainer: {
//       flex: 1,
//       backgroundColor: Colors[theme]?.secondary,
//     },
//     safeAreaView: {
//       marginBottom: Platform.OS === 'ios' ? 8 : 12,
//       marginTop: Platform.OS === 'ios' ? 8 : 42,
//     },
//     topView: {
//       position: 'absolute',
//       left: 10,
//       zIndex: 10,
//     },
//     text: {},
//     bannerContainer: {
//       flex: 0,
//     },
//     moviesContainer: {
//       width: '100%',
//     },
//     movie: {
//       width: '30%',
//       backgroundColor: 'gray',
//       height: '100%',
//     },
//     image: {},
//     audiosContainer: {},
//     btn: {
//       width: 45,
//       height: 45,
//       borderRadius: 10,
//       backgroundColor: Colors[theme]?.primary,
//       padding: 5,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//   });

// export default HomeScreen;

import React, {useRef} from 'react';
import {
  View,
  ScrollView,
  Image,
  Animated,
  Text,
  useWindowDimensions,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import TopNavigation from '../components/commons/TopNavigation';
import {BANNER_H, images} from '../utils/constants';
import ImageSlider from '../components/commons/ImageSlider';
import {CustomButton} from '../components/utils';
import {AntDesign} from '../utils/common';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';

export type ApiResponse<T> = {
  page: number;
  results: Array<T>;
  total_pages: number;
  total_results: number;
};

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'] & {
    openDrawer?: () => void; // Add openDrawer function to the navigation prop type
  };
};

const HomeScreen = ({navigation}: Props) => {
  const scrollA = useRef(new Animated.Value(0)).current;
  const {} = useThemeContext();
  const {width} = useWindowDimensions();
  const height = width * 0.7;
  const {theme, setTheme} = useThemeContext();

  const styles = styling(theme);
  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} />

      {/**header bar */}
      {/* <SafeAreaView style={styles.topView}>
        <CustomButton
          icon={
            <AntDesign name="menu-fold" size={30} color={Colors[theme].text} />
          }
          onPress={navigation.openDrawer}
          customButtonStyle={styles.btn}
        />
      </SafeAreaView> */}
      <TopNavigation title="Home" scrollA={scrollA} />
      <Animated.ScrollView
        // onScroll={e => console.log(e.nativeEvent.contentOffset.y)}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}>
        <View style={styles.bannerContainer}>
          {/* <Animated.Image
            style={styles.banner(scrollA)}
            source={require('../assets/marguerite.jpg')}
          /> */}
          <Animated.View style={[styles.banner(scrollA), {height: height}]}>
            <ImageSlider images={images} />
          </Animated.View>
        </View>
        <Text style={{backgroundColor: 'red'}}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
          quisquam molestias adipisci, consequatur aspernatur laborum sint
          impedit repudiandae animi omnis aliquid eos hic architecto in beatae
          maiores, tempora minus! Aspernatur, officia, quas labore doloribus
          ipsum soluta minus ipsa iure voluptas fuga laborum amet, nostrum iste
          blanditiis rerum impedit dicta nesciunt consequatur sint obcaecati
          esse deserunt. Culpa nesciunt ut, ipsam amet incidunt, reprehenderit
          quis quia quibusdam accusamus odit molestias sit cumque vel.
          Praesentium obcaecati est rerum? Unde nisi totam incidunt quae nemo
          excepturi aperiam accusamus officia quam. Rerum error, facere hic
          assumenda exercitationem ut culpa impedit iure, harum itaque minus
          voluptate molestias aliquid totam consequatur non, cumque sed.
          Consectetur iusto dolorum illum porro unde eum, natus ipsa vel nostrum
          in neque quis optio, magnam sed laborum eveniet, similique ut harum
          qui voluptatibus ex voluptatem. Inventore fuga, explicabo aliquid
          labore eligendi commodi eveniet unde itaque ipsam culpa dolor nisi
          fugit, voluptatibus voluptates quam nobis, voluptatum sequi. Quam
          possimus voluptas, harum quasi deleniti neque vitae impedit amet odit
          maxime ducimus alias, quis suscipit consequuntur quisquam ea quae
          tempore assumenda itaque rerum, labore eaque magnam. Sed dolore
          quibusdam excepturi enim magni delectus animi cupiditate ut!
          Voluptatibus iste ipsam, autem sunt magni quis aliquam labore in qui
          perferendis amet nisi eos quo corporis, ad expedita cupiditate
          assumenda id deleniti esse perspiciatis eveniet accusamus deserunt.
          Maxime animi delectus velit distinctio temporibus natus ducimus,
          dolores error similique voluptate reprehenderit nobis voluptates non
          necessitatibus earum porro doloremque ullam ut numquam iure corporis
          magni. Soluta non aliquid, repellendus minima iste explicabo quas ex!
          Illo enim deserunt nemo, architecto possimus eos dolorum modi et
          doloremque aperiam ratione in perspiciatis, amet cupiditate fugit
          facilis reiciendis placeat id repellat obcaecati. Exercitationem
          obcaecati consectetur dolor odit quasi, temporibus dicta maxime natus
          expedita earum saepe voluptates quae beatae. Ea perspiciatis natus
          accusamus. Laboriosam vitae tenetur eum fugit dignissimos reiciendis
          tempore odit cupiditate neque nam molestiae necessitatibus voluptates
          ut aut qui officia sapiente doloribus cum facere repellat, sint
          assumenda. Maxime enim quo sed harum modi delectus quisquam quidem,
          inventore illo consequatur, dolorum provident mollitia voluptate
          ducimus saepe quos ullam nesciunt recusandae dicta incidunt amet.
          Nesciunt, amet excepturi. Mollitia eligendi consequatur voluptatibus
          tenetur unde vero officia. Accusantium exercitationem delectus ab,
          quod necessitatibus quisquam facere sed architecto autem aliquid,
          tempora nesciunt cupiditate illo pariatur non esse impedit sit?
          Laborum voluptates animi soluta ad velit libero sequi dolorem
          praesentium recusandae, nihil dolores ducimus quo et eligendi
          explicabo ullam aspernatur quasi pariatur nisi eius. Voluptas dolor
          nisi, minima tenetur labore omnis repudiandae nostrum architecto
          deleniti modi quia laborum? Quod, magnam consequuntur ullam ducimus
          corporis deleniti officia nam rerum tempora id, error quos qui. Porro
          atque incidunt assumenda quam in officia natus aspernatur deleniti
          soluta quibusdam quas tenetur, accusantium nihil laboriosam nobis,
          eius ratione consequatur ullam explicabo earum eos vel, nulla dolore
          mollitia? Esse culpa saepe quaerat consequuntur repellendus
          perferendis provident repellat sint voluptates, fugiat, voluptatibus
          veritatis est eaque expedita quod? Voluptas iure non cupiditate autem
          enim, dolor saepe ullam maxime quas quis! Provident, rem facilis alias
          maiores perspiciatis est.
        </Text>
      </Animated.ScrollView>
    </View>
  );
};

export default HomeScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
    },
    bannerContainer: {
      marginTop: -1000,
      paddingTop: 1000,
      alignItems: 'center',
      overflow: 'hidden',
    },
    banner: (scrollA: any) => ({
      width: '100%',
      transform: [
        {
          translateY: scrollA.interpolate({
            inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
            outputRange: [-BANNER_H / 2, 0, BANNER_H * 0.75, BANNER_H * 0.75],
          }),
        },
        {
          scale: 1,
        },
      ],
    }),
    safeAreaView: {
      marginBottom: Platform.OS === 'ios' ? 8 : 12,
      marginTop: Platform.OS === 'ios' ? 8 : 42,
    },
    topView: {
      position: 'absolute',
      left: 10,
      top: 42,
      zIndex: 10,
    },
    text: {},

    moviesContainer: {
      width: '100%',
    },
    movie: {
      width: '30%',
      backgroundColor: 'gray',
      height: '100%',
    },
    image: {},
    audiosContainer: {},
    btn: {
      width: 45,
      height: 45,
      borderRadius: 10,
      backgroundColor: Colors[theme]?.primary,
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
