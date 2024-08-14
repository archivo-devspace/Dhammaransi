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
import {useTranslation} from 'react-i18next';

type Props = {
  data: MovieProps[];
  navigation: NavigationMainStackScreenProps['navigation'];
};

export const Movies = ({data, navigation}: Props) => {
  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const ITEM_WIDTH = width - width * 0.25;
  const ITEM_HEIGHT = height - height * 0.77;
  const MARGIN_HORIZONTAL = 10;
  const ITEM_FULL_WIDTH = ITEM_WIDTH + MARGIN_HORIZONTAL * 2;
  const SPACER = (width - ITEM_FULL_WIDTH) / 2;

  const truncateIndex = 26;

  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const handleClick = (item: MovieProps) => {
    console.log('hello');
    navigation.navigate('Movie', {item});
  };

  const styles = styling(theme);

  return (
    <View style={[styles.mainContainer, {height: height - height * 0.69}]}>
      <Text style={[styles.text,{fontSize: height * 0.02}]}>{t('TITLES.TOP_PICTURES')}</Text>
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
              truncateIndex={truncateIndex}
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
      marginHorizontal: 10,
      marginBottom: remToPx(0.8),
      fontWeight: '500',
      opacity: 0.7,
      textAlign: 'center',
    },
    flatListStyle: {
      paddingTop: 5,
      alignSelf: 'center',
    },
  });

export default Movies;
