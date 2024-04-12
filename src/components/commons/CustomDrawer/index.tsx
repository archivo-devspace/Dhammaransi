import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {theme} from '../../../theme';

const CustomDrawer = (props: DrawerContentComponentProps) => {
  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <StatusBar translucent backgroundColor="transparent" />
      <SafeAreaView
        style={{
          backgroundColor: 'gray',
          width: undefined,
          padding: 16,
          paddingTop: 52,
          borderTopRightRadius: 20,
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../../assets/lotus.png')}
            style={styles.profile}
          />
          <Text style={styles.name}>Myat Dhamma</Text>
        </View>
      </SafeAreaView>
      <View style={styles.mainContainer}>
        <View
          style={{
            backgroundColor: theme.primary,
            flex: 6,
            paddingTop: 20,
            paddingHorizontal: 5,
            borderBottomRightRadius: 20,
          }}>
          <DrawerItemList {...props} />
        </View>
      </View>
    </ScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.primary,
    borderBottomRightRadius: 20,
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: theme.primary,
  },
  name: {
    color: theme.primary,
    opacity: 0.8,
    fontWeight: '800',
    fontSize: 20,
    marginVertical: 8,
  },
});
