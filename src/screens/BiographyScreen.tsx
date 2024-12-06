/* eslint-disable react/no-unstable-nested-components */
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import Container from '../components/commons/Container';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {ScrollView} from 'react-native-gesture-handler';
import {useGetBiography} from '../api_services/lib/queryhooks/useBiography';
import SkeletonView from '../components/commons/Skeleton';
import NetworkError from '../components/commons/LottieAnimationView';
import {networkError} from '../utils/constants';
import {getFontFamily} from '../utils/common';

interface SkeletonConfig {
  height: number;
  widthRatio: number;
  borderRadious: number;
}

interface SkeletonGroupProps {
  gap: number;
  config: SkeletonConfig[];
}

const BiographyScreen = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = styling(theme);

  const {
    data: biography,
    isLoading: isBiographyLoading,
    refetch,
    isFetched,
    isError,
  } = useGetBiography();

  const generateSkeletonViews = (config: SkeletonConfig[]): JSX.Element[] => {
    return config.map(({height, widthRatio, borderRadious}, index) => (
      <SkeletonView
        key={index}
        height={height}
        width={width * widthRatio}
        borderRadius={borderRadious}
      />
    ));
  };

  const SkeletonGroup: React.FC<SkeletonGroupProps> = ({gap, config}) => {
    return (
      <View style={[styles.group, {gap}]}>{generateSkeletonViews(config)}</View>
    );
  };

  const LoadingSkeleton = () => {
    const commonConfig: SkeletonConfig[] = [
      {height: 10, widthRatio: 0.9, borderRadious: 6},
      {height: 10, widthRatio: 0.8, borderRadious: 6},
      {height: 10, widthRatio: 0.7, borderRadious: 6},
      {height: 10, widthRatio: 0.6, borderRadious: 6},
    ];

    const autoConfig: SkeletonConfig[] = Array(16).fill({
      height: 8,
      widthRatio: 0.9,
      borderRadious: 6,
    });

    return (
      <View style={styles.skeletonContainer}>
        <SkeletonGroup
          gap={7}
          config={[
            ...commonConfig,
            ...commonConfig,
            ...commonConfig,
            ...commonConfig,
            ...commonConfig,
          ]}
        />
        <SkeletonGroup gap={6} config={autoConfig.slice(0, 8)} />
        <SkeletonGroup gap={6} config={autoConfig.slice(0, 6)} />
        <SkeletonGroup gap={6} config={autoConfig} />
        <SkeletonGroup gap={6} config={autoConfig.slice(0, 10)} />
      </View>
    );
  };


  const formattedDescription = biography?.data?.results?.description
    ?.replace(/<\/p>/gi, '\n') // Replace closing </p> with two newlines
    ?.replace(/<p[^>]*>/gi, '') // Remove opening <p> tags
    ?.replace(/<br\s*\/?>/gi, '\n') // Replace <br> with newline
    ?.replace(/&nbsp;/g, ' ') // Replace &nbsp; with a space
    ?.replace(/<\/?[^>]+(>|$)/g, ''); // Remove any remaining HTML tags

  return (
    <Container title="MENUS.BIOGRAPHY">
      <ScrollView style={[styles.container, {width: width}]} showsVerticalScrollIndicator={false}>
        {isBiographyLoading ? (
          <LoadingSkeleton />
        ) : isFetched && isError ? (
          <NetworkError
            handlePress={refetch}
            btnType="refresh"
            lottieFiePath={networkError}
          />
        ) : (
          <Text
            style={{
              textAlign: 'left',
              fontSize: height * 0.023,
              color: Colors[theme]?.text,
              fontFamily: getFontFamily('regular'),
            }}>
            {formattedDescription}
          </Text>
        )}
      </ScrollView>
    </Container>
  );
};

export default BiographyScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
    },
    headerContentContainer: {
      paddingTop: 10,
      gap: 10,
    },
    headerText: {
      fontSize: 20,
      color: Colors[theme].text,
      fontWeight: 'bold',
    },
    headerDesc: {
      fontSize: 15,
      color: Colors[theme].text,
    },
    textContainer: {
      alignItems: 'center',
      gap: 10,
    },
    skeletonContainer: {
      padding: 30,
      flex: 1,
      gap: 35,
      backgroundColor: Colors[theme].secondary,
    },
    title: {
      height: 40,
      width: '70%',
      backgroundColor: 'red',
      borderRadius: 4,
      marginBottom: 16,
    },
    paragraph: {
      width: '100%',
      backgroundColor: 'red',
      borderRadius: 4,
      marginBottom: 8,
    },
    image: {
      height: 200,
      width: '100%',
      backgroundColor: 'blue',
      borderRadius: 4,
      marginBottom: 16,
    },
    group: {
      alignItems: 'center',
    },
  });
