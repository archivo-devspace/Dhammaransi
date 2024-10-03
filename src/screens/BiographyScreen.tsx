import {StyleSheet, View, useWindowDimensions} from 'react-native';
import React, {useState} from 'react';
import Container from '../components/commons/Container';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import {ScrollView} from 'react-native-gesture-handler';
import {useGetBiography} from '../api_services/lib/queryhooks/useBiography';
import RenderHTML from 'react-native-render-html';
import SkeletonView from '../components/commons/Skeleton';

const BiographyScreen = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const customImageWidth = width * 0.4;
  const customImageHeight = width * 0.5;
  const styles = styling(theme);

  const {data: biography, isLoading: isBiographyLoading} = useGetBiography();

  const LoadingSkeleton = () => {
    return (
      <View style={styles.skeletonContainer}>
        <SkeletonView height={40} width={200} borderRadius={5} />
        <SkeletonView height={height * 0.35} width={'auto'} borderRadius={10} />
        <SkeletonView height={height * 0.1} width={'auto'} borderRadius={10} />
        <SkeletonView height={height * 0.25} width={'auto'} borderRadius={10} />
        <SkeletonView height={height * 0.3} width={'auto'} borderRadius={10} />

        <SkeletonView height={200} width={'auto'} borderRadius={10} />
        <SkeletonView height={200} width={'auto'} borderRadius={10} />

        {/* <View style={[styles.paragraph, {height: height * 0.35}]} />
        <View style={[styles.paragraph, {height: height * 0.1}]} />
        <View style={[styles.paragraph, {height: height * 0.25}]} />
        <View style={[styles.paragraph, {height: height * 0.3}]} /> */}
      </View>
    );
  };

  return (
    <Container title="MENUS.BIOGRAPHY">
      <ScrollView style={[styles.container, {width: width}]}>
        {isBiographyLoading ? (
          <LoadingSkeleton />
        ) : (
          <RenderHTML
            contentWidth={width * 0.54}
            source={{
              html:
                biography?.data?.results?.description ||
                '<p>No data available</p>',
            }}
          />
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
      padding: 16,
      flex: 1,
      gap: 6,
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
  });
