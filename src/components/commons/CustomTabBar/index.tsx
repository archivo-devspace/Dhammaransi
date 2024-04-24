// CustomTabBar.js
import React, {useRef} from 'react';
import {View, TouchableOpacity, Text, Animated, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '../../../utils/common';
import {Colors} from '../../../theme';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';

const CustomTabBar = ({state, descriptors, navigation}) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const {navigate} = useNavigation();
  const linePosition = useRef(new Animated.Value(0)).current;
  const {theme} = useThemeContext();

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const totalTabs = state.routes.length;
  const tabWidth = 100; // Adjust as needed

  const translateX = linePosition.interpolate({
    inputRange: [0, totalTabs - 1],
    outputRange: [0, (totalTabs - 1) * tabWidth],
  });
  const styles = styling(theme);

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flexDirection: 'row',
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 5,
                marginVertical: 10,
                marginHorizontal: 5,
                gap: 4,
                alignItems: 'center',
                backgroundColor: isFocused
                  ? Colors[theme].primary
                  : 'transparent',
                borderRadius: 20,
                justifyContent: 'center',
              }}
              key={route.name}>
              {options?.tabBarIcon()}
              {isFocused && (
                <Text style={{color: Colors[theme].text}}>{label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;

const styling = (theme: Theme) =>
  StyleSheet.create({
    tabBarContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    tabBar: {
      flexDirection: 'row',
      borderTopLeftRadius: 20, // Adjust the border radius as needed
      borderTopRightRadius: 20, // Adjust the border radius as needed
      backgroundColor: Colors[theme].secondary_light, // Set the background color of the tab bar
    },
  });
