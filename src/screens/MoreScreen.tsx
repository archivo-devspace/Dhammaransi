import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../theme';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {FontAwesome} from '../utils/common';
import {NavigationMainStackScreenProps} from '../navigations/StackNavigation';

type Props = {
  navigation: NavigationMainStackScreenProps['navigation'];
};

const MoreScreen = ({navigation}: Props) => {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeContext();
  console.log('insets', insets);
  const styles = styling(theme);

  const menuOptions = [
    {
      id: 1,
      name: 'ဆရာတော်ဘုရားထေရုပတ္တိ',
      icon: 'user-circle',
      link: 'Biography',
    },
    {
      id: 2,
      name: 'တရားစခန်းအချိန်စာရင်း',
      icon: 'calendar-alt',
      link: 'Timetable',
    },
    {
      id: 3,
      name: 'သာသနာပြုလုပ်ငန်းစဉ်များ',
      icon: 'place-of-worship',
      link: 'Missionary',
    },
    {
      id: 4,
      name: 'ဆက်သွယ်ရန်',
      icon: 'portrait',
      link: 'Contact',
    },
    {
      id: 5,
      name: 'Setting',
      icon: 'cog',
      link: 'Setting',
    },
  ];
  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      {/* <SafeAreaView /> */}
      <View style={{marginTop: insets.top}}>
        <Text style={styles.headerText}>More</Text>
      </View>
      <ScrollView style={styles.optionContainer}>
        {menuOptions.map(menu => (
          <React.Fragment key={menu.id}>
            <Pressable
              style={styles.menu}
              onPress={() => navigation.navigate(menu.link as any)}>
              <View style={styles.menuText}>
                <View
                  style={{
                    width: 40,
                    alignItems: 'center',
                  }}>
                  <FontAwesome
                    name={menu.icon}
                    size={25}
                    color={Colors[theme].text}
                  />
                </View>
                <Text style={{color: Colors[theme].text}}>{menu.name}</Text>
              </View>
              <FontAwesome
                name={'angle-right'}
                size={20}
                color={Colors[theme].text}
              />
            </Pressable>
            {menuOptions.length !== menu.id && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

export default MoreScreen;

const styling = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors[theme]?.secondary,
    },
    headerText: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 25,
      color: Colors[theme].text,
    },
    optionContainer: {
      paddingHorizontal: 10,
      marginTop: 20,
    },
    menu: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    menuText: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 30,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: Colors[theme].secondary_dark,
      marginVertical: 20,
    },
  });
