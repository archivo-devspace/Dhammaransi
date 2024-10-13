/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';

interface ButtonPorps {
  onPress?: () => any;
  title?: string;
  icon?: ReactNode;
  endIcon?: ReactNode;
  customButtonStyle?: object;
  customButtonTextStyle?: object;
  children?: ReactNode;
  gap?: number;
  disabled?: boolean;
}

const CustomButton = ({
  onPress,
  title,
  icon,
  customButtonStyle,
  customButtonTextStyle,
  children,
  gap = 0,
  disabled,
  endIcon,
}: ButtonPorps) => {
  return (
    <>
      {children ? (
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          style={
            customButtonStyle
              ? customButtonStyle
              : [styles.button, disabled ? {opacity: 0} : {opacity: 1}]
          }>
          <View style={{flexDirection: 'row'}}>{children}</View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          style={customButtonStyle ? customButtonStyle : styles.button}>
          <View
            style={{
              flexDirection: 'row',
              gap: gap,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>{icon}</View>
            <Text
              style={
                customButtonTextStyle ? customButtonTextStyle : styles.text
              }>
              {title}
            </Text>
            {endIcon && <View style={{marginLeft: 10}}>{endIcon}</View>}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    ...Platform.select({
      ios: {
        backgroundColor: 'lightblue',
        borderRadius: 15,
        padding: 10,
      },
      android: {
        backgroundColor: 'lightblue',
        borderRadius: 5,
        padding: 10,
      },
    }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...Platform.select({
      ios: {
        color: 'white',
        fontSize: 18,
      },
      android: {
        color: 'white',
        fontSize: 20,
      },
    }),
  },
});

export default CustomButton;
