import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import { Theme, useThemeContext } from '../contexts/ThemeContext';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from '../theme';
import { CustomButton } from '../components/utils';
import { Ionicons } from '../utils/common';
import { ebooks, fallBackImageUrl } from '../utils/constants';
import Container from '../components/commons/Container';
import { useGetBookList } from '../api_services/lib/queryhooks/useBook';

const PdfListScreen = () => {
  const { theme } = useThemeContext();
  const { width, height } = useWindowDimensions();
  const styles = styling(theme);

  const { data: bookLists, isLoading: isBookLoading } = useGetBookList();
  console.log('bookLists', bookLists)
  return (
    <Container title="TITLES.PDFSCREEN_TITLE">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {isBookLoading ? (
          // Loading Skeleton
          [...Array(3)].map((_, index) => (
            <View key={index} style={styles.skeletonContainer}>
              <View style={[styles.skeletonImg, { width: width * 0.30, height: height * 0.20 }]} />
              <View style={styles.skeletonTextContainer}>
                <View style={styles.skeletonText} />
                <View style={styles.skeletonText} />
              </View>
            </View>
          ))
        ) : (
          bookLists?.data?.results?.map(ebook => (
            <React.Fragment key={ebook.id}>
              <View style={styles.contentContainer}>
                <View style={styles.innerContentContainer}>
                  <View
                    style={[
                      styles.img,
                      {
                        width: width * 0.30,
                        height: height * 0.20,
                      },
                    ]}>
                    <Image
                      style={{ width: '100%', height: '100%', borderRadius: 20 }}
                      source={{ uri: ebook.cover_photo || fallBackImageUrl }}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={{
                    width: width * 0.60,
                    paddingRight: 10,
                    marginTop: 20,
                    gap: 20,
                  }}>
                    <Text style={styles.text}>{ebook.name}</Text>
                    <Text style={styles.author}>{ebook.author}</Text>
                  </View>
                </View>
                <Text style={styles.description}>
                  {ebook.description}
                </Text>
                <CustomButton
                  onPress={() => console.log('hello')}
                  icon={
                    <Ionicons
                      name={`cloud-download-outline`}
                      size={30}
                      color={Colors[theme].primary}
                    />
                  }
                  customButtonStyle={styles.btn}
                />
              </View>
              {ebooks.length !== ebook?.id && <View style={styles.divider} />}
            </React.Fragment>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default PdfListScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingRight: 10,
    },
    contentContainer: {
      alignItems: 'center',
      gap: 20,
      justifyContent: 'space-between',
      // marginBottom: 10,
    },
    innerContentContainer: {
      width: "100%",
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 5,
      marginBottom: 10,
    },
    text: {
      fontWeight: 'bold',
      color: Colors[theme].text,
      fontSize: 22,
    },
    description: {
      fontWeight: 'normal',
      color: Colors[theme].text,
      fontSize: 18,
    },
    author: {
      fontWeight: "bold",
      color: Colors[theme].text,
      fontSize: 20,
    },
    img: {
      borderRadius: 50,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
      marginVertical: 20,
    },
    btn: {
      alignSelf:"flex-end",
      paddingHorizontal: 50,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: Colors[theme].primary,
      borderRadius:20
    },
    // Skeleton styles
    skeletonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    skeletonImg: {
      backgroundColor: Colors[theme].secondary_dark,
      borderRadius: 20,
    },
    skeletonTextContainer: {
      flex: 1,
      paddingLeft: 10,
    },
    skeletonText: {
      backgroundColor: Colors[theme].secondary_dark,
      height: 20,
      borderRadius: 4,
      marginBottom: 8,
    },
  });
