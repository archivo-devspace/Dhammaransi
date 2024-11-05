import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Item from '../Item';
import {getFontFamily} from '../../../utils/common';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';
import {NavigationMainStackScreenProps} from '../../../navigations/StackNavigation';
import {useTranslation} from 'react-i18next';
import DataNotFound from '../DataNotFound';
import {SinglePaintingApiRes} from '../../../types/apiRes';

type Props = {
  data?: SinglePaintingApiRes[];
  navigation: NavigationMainStackScreenProps['navigation'];
  isLoading?: boolean;
  isFetched: boolean;
  isError: boolean;
  error: unknown;
};

export const Movies = ({
  data,
  isLoading,
  isFetched,
  isError,
  error,
  navigation,
}: Props) => {
  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const ITEM_WIDTH = width - width * 0.3;
  const ITEM_HEIGHT = height - height * 0.7;
  const MARGIN_HORIZONTAL = 5;
  const ITEM_FULL_WIDTH = ITEM_WIDTH + MARGIN_HORIZONTAL * 2;
  const SPACER = (width - ITEM_FULL_WIDTH) / 2;
  const truncateIndex = 28;
  const [activeIndex, setActiveIndex] = useState(1); // Starting at 1 for the duplicated data
  const flatListRef = useRef<any>(null);
  const x = useSharedValue(0);

  const loopedData = data ? [data[data.length - 1], ...data, data[0]] : [];

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const handleScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / ITEM_FULL_WIDTH);
    setActiveIndex(index);

    if (index === 0) {
      flatListRef.current?.scrollToOffset({
        offset: (loopedData.length - 2) * ITEM_FULL_WIDTH,
        animated: false,
      });
      setActiveIndex(loopedData.length - 2);
    } else if (index === loopedData.length - 1) {
      flatListRef.current?.scrollToOffset({
        offset: ITEM_FULL_WIDTH,
        animated: false,
      });
      setActiveIndex(1);
    }
  };

  const handleClick = (id: number) => {
    navigation.navigate('PaintingScreen', {id});
  };

  const styles = styling(theme);

  const paintings = loopedData.map(item => ({
    ...item,
    artwork: item.details[0]?.file,
    description: item.title,
  }));

  return (
    <View style={[styles.mainContainer, {height: height - height * 0.62}]}>
      <Text style={[styles.text, {fontSize: height * 0.022}]}>
        {t('TITLES.TOP_PICTURES')}
      </Text>
      {isLoading ? (
        <Animated.FlatList
          ref={flatListRef}
          onScroll={onScroll}
          onMomentumScrollEnd={handleScrollEnd}
          data={[1, 2, 3]}
          keyExtractor={(item: any) => item.toString()}
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
                handleClick={() => {}}
                truncateIndex={truncateIndex}
                isLoading={isLoading}
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
          getItemLayout={(_, index) => ({
            length: ITEM_FULL_WIDTH,
            offset: ITEM_FULL_WIDTH * index,
            index,
          })}
          style={styles.flatListStyle}
        />
      ) : (isFetched && !data?.length) || isError ? (
        <DataNotFound
          error={error}
          customStyle={{width: ITEM_FULL_WIDTH, height: ITEM_HEIGHT}}
        />
      ) : (
        <Animated.FlatList
          ref={flatListRef}
          onScroll={onScroll}
          onMomentumScrollEnd={handleScrollEnd}
          data={paintings}
          keyExtractor={(item: any, index: any) => index}
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
          getItemLayout={(_, index) => ({
            length: ITEM_FULL_WIDTH,
            offset: ITEM_FULL_WIDTH * index,
            index,
          })}
          style={styles.flatListStyle}
        />
      )}
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
      fontFamily: getFontFamily('bold'),
      textAlign: 'center',
    },
    flatListStyle: {
      alignSelf: 'center',
    },
  });

export default Movies;
