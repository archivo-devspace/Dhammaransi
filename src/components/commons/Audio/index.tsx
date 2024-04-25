// import {
//   Image,
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   useWindowDimensions,
// } from 'react-native';
// import React from 'react';
// import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
// import {Colors} from '../../../theme';

// const data = [
//   {id: 1, image: require('../../../assets/marguerite.jpg'), text: 'audio1'},
//   {id: 2, image: require('../../../assets/marguerite.jpg'), text: 'audio2'},
//   {id: 3, image: require('../../../assets/marguerite.jpg'), text: 'audio3'},
//   // Add more items as needed
// ];

// const Audios = () => {
//   const {theme} = useThemeContext();
//   const styles = styling(theme);
//   const {width, height} = useWindowDimensions();

//   const renderItem = ({item}: any) => (
//     <View style={styles.container}>
//       <Image
//         source={item.image}
//         resizeMode="cover"
//         style={[
//           styles.img,
//           {width: width - width * 0.7, height: height - height * 0.8},
//         ]}
//       />
//       <Text style={styles.text}>{item.text}</Text>
//     </View>
//   );

//   return (
//     <View>
//       <Text style={styles.headerText}>Audios</Text>
//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={item => item.id.toString()}
//         horizontal
//         contentContainerStyle={styles.mainContainer}
//       />
//     </View>
//   );
// };

// export default Audios;

// const styling = (theme: Theme) =>
//   StyleSheet.create({
//     mainContainer: {
//       paddingHorizontal: 16,
//       paddingVertical: 20,
//       gap: 10,
//     },
//     headerText: {
//       color: Colors[theme].text,
//       fontSize: 20,
//       marginHorizontal: 10,
//       fontWeight: 'bold',
//       textAlign: 'center',
//     },
//     container: {
//       marginRight: 10,
//     },
//     img: {
//       borderRadius: 16,
//     },
//     text: {
//       textAlign: 'center',
//       fontWeight: 'bold',
//       paddingTop: 10,
//       color: Colors[theme].text,
//     },
//   });

import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import React from 'react';

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Item from '../Item';
import {remToPx} from '../../../utils/common';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';
import {
  MovieProps,
  NavigationMainStackScreenProps,
} from '../../../navigations/StackNavigation';

type Props = {
  data: MovieProps[];
  navigation: NavigationMainStackScreenProps['navigation'];
};

export const Audios = ({data, navigation}: Props) => {
  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const ITEM_WIDTH = width - width * 0.6;
  const ITEM_HEIGHT = height - height * 0.82;
  const MARGIN_HORIZONTAL = 10;
  const ITEM_FULL_WIDTH = ITEM_WIDTH + MARGIN_HORIZONTAL * 2;
  const SPACER = (width - ITEM_FULL_WIDTH) / 2;
  const truncateIndex = 14;

  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const handleClick = (item: MovieProps) => {
    console.log('hello');
    navigation.navigate('Audios', {item});
  };

  const styles = styling(theme);

  return (
    <View style={[styles.mainContainer, {height: height - height * 0.74}]}>
      <Text style={styles.text}>Paintings</Text>
      <Animated.FlatList
        onScroll={onScroll}
        data={data}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({item, index}) => {
          return (
            <Item
              item={item}
              index={index}
              height={ITEM_HEIGHT}
              width={ITEM_WIDTH}
              marginHorizontal={MARGIN_HORIZONTAL}
              x={x}
              fullWidth={ITEM_FULL_WIDTH}
              handleClick={handleClick}
              truncateIndex={truncateIndex}
            />
          );
        }}
        ListHeaderComponent={<View />}
        ListHeaderComponentStyle={{width: SPACER}}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={{width: SPACER}}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate={'fast'}
        snapToInterval={ITEM_FULL_WIDTH}
        initialScrollIndex={1}
        getItemLayout={(data, index) => ({
          length: ITEM_FULL_WIDTH,
          offset: ITEM_FULL_WIDTH * index,
          index,
        })}
        style={styles.flatListStyle}
      />
    </View>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      // backgroundColor: 'black',
      // marginTop: 10,
    },
    text: {
      color: Colors[theme].text,
      fontSize: 20,
      marginHorizontal: 10,
      marginBottom: remToPx(0.8),
      fontWeight: 'bold',
      textAlign: 'center',
    },
    flatListStyle: {
      paddingTop: 5,
      alignSelf: 'center',
    },
  });

export default Audios;
