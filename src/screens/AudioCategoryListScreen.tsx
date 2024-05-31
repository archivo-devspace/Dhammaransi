import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AntDesign, truncateText} from '../utils/common';
import {CustomButton} from '../components/utils';
import Container from '../components/commons/Container';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {trackCategories} from '../utils/constants';
import {Colors} from '../theme';
import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const AudioCategoryListScreen = ({navigation}: Props) => {
  const {theme} = useThemeContext();
  const styles = styling(theme);

  const handleNavigate = (id: number) => {
    navigation.navigate('Audios', {id});
  };
  return (
    <Container title="TITLES.AUDIOCATEGORIES">
      <FlatList
        data={trackCategories}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <React.Fragment key={item.id}>
            <View style={styles.container}>
              <CustomButton
                onPress={() => handleNavigate(item.id)}
                customButtonStyle={styles.btn}>
                <View style={styles.trackContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 16,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{uri: item.artwork}}
                      resizeMode="cover"
                      style={styles.img}
                    />
                    <View style={{width: '70%', gap: 10}}>
                      <Text style={styles.title}>
                        {truncateText(item.name, 45)}
                      </Text>
                      <Text style={styles.desc}>
                        {truncateText(item.desc, 30)}
                      </Text>
                    </View>
                  </View>
                  <AntDesign
                    name={'arrowright'}
                    size={30}
                    color={Colors[theme].primary}
                  />
                </View>
              </CustomButton>
            </View>
          </React.Fragment>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        keyExtractor={item => item.id.toString()}
        // Optional: Add extra FlatList props like `ItemSeparatorComponent`, etc.
      />
    </Container>
  );
};

export default AudioCategoryListScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    trackContainer: {
      gap: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingRight: 20,
      height: 60,
    },
    img: {
      width: 60,
      height: 60,
      borderRadius: 12,
    },
    btn: {
      backgroundColor: Colors[theme].secondary,
    },
    title: {
      fontSize: 16,
      color: Colors[theme].text,
    },
    desc: {
      fontSize: 12,
      color: Colors[theme].text,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
    },
  });
