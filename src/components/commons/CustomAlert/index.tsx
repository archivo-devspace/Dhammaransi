import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import {Ionicons} from '../../../utils/common';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {Colors} from '../../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  btnText: string;
  type: 'success' | 'error' | 'warning' | null;
}

const CustomAlert = ({
  visible,
  onClose,
  title,
  message,
  btnText,
  type = 'warning',
}: Props) => {
  const {theme} = useThemeContext();
  const styles = createStyles(theme);

  return (
    <>
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}>
        <StatusBar
          backgroundColor={
            theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)'
          }
        />
        <View style={styles.modalContainer}>
          <View style={styles.alertBox}>
            {type === 'success' && (
              <Ionicons
                name="checkmark-circle-outline"
                size={45}
                color={Colors[theme].success}
              />
            )}
            {type === 'warning' && (
              <Ionicons
                name="alert-circle-outline"
                size={45}
                color={Colors[theme].warnning}
              />
            )}
            {type === 'error' && (
              <Ionicons
                name="remove-circle-outline"
                size={45}
                color={Colors[theme].danger}
              />
            )}

            {title && <Text style={styles.alertTitle}>{title}</Text>}
            <Text style={styles.alertText}>{message}</Text>
            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  borderColor:
                    type === 'success'
                      ? Colors[theme].success
                      : type === 'error'
                      ? Colors[theme].danger
                      : Colors[theme].warnning,
                },
              ]}
              onPress={onClose}>
              <Text style={styles.buttonText}>{btnText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)',
    },

    alertBox: {
      width: 300,
      padding: 20,
      backgroundColor: Colors[theme].secondary,
      borderRadius: 20,
      elevation: 0,
      alignItems: 'center',
    },
    alertTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginTop: 10,
    },
    alertText: {
      fontSize: 18,
      marginVertical: 26,
      textAlign: 'center',
      color: Colors[theme].text,
    },
    closeButton: {
      borderWidth: 2,
      padding: 10,
      borderRadius: 10,
      width: '50%',
      alignItems: 'center',
    },
    buttonText: {
      color: Colors[theme].text,
      fontSize: 16,
      fontWeight: '500',
    },
  });

export default CustomAlert;
