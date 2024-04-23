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
import {NavigationMainStackScreenProps} from '../../../navigations/StackNavigation';

type Props = {
  data: any;
  navigation: NavigationMainStackScreenProps['navigation'] & {
    openDrawer?: () => void; // Add openDrawer function to the navigation prop type
  };
};

export const Movies = ({data, navigation}: Props) => {
  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const ITEM_WIDTH = width - width * 0.5;
  const ITEM_HEIGHT = height - height * 0.7;
  const MARGIN_HORIZONTAL = 20;
  const ITEM_FULL_WIDTH = ITEM_WIDTH + MARGIN_HORIZONTAL * 2;
  const SPACER = (width - ITEM_FULL_WIDTH) / 2;

  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const handleClick = (item: any) => {
    navigation.navigate('Movie', {item});
  };

  const styles = styling(theme);

  return (
    <View style={[styles.mainContainer, {height: height - height * 0.48}]}>
      <Text style={styles.text}>Movies</Text>
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
        style={styles.flatListStyle}
      />
    </View>
  );
};

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {},
    text: {
      color: Colors[theme].text,
      fontSize: 20,
      marginHorizontal: 10,
      marginBottom: remToPx(1),
      fontWeight: 'bold',
    },

    flatListStyle: {
      paddingTop: 10,
      alignSelf: 'center',
    },
  });

export default Movies;
