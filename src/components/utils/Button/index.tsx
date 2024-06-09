import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {ReactNode} from 'react';

interface ButtonPorps {
  onPress?: () => void;
  title?: string;
  icon?: ReactNode;
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
            style={{flexDirection: 'row', gap: gap, justifyContent: 'center'}}>
            <View>{icon}</View>
            <Text
              style={
                customButtonTextStyle ? customButtonTextStyle : styles.text
              }>
              {title}
            </Text>
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
