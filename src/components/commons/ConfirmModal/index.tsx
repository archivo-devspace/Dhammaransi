import {
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Colors} from '../../../theme';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';

interface ModalProps {
  isModalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  handleConfirm: () => void;
  handleCancel: () => void;
  animationType: 'fade' | 'slide' | 'none';
  confirmText: string;
  cancelText: string;
  title: string;
}

const ConfirmModal = ({
  isModalVisible,
  setModalVisible,
  handleConfirm,
  handleCancel,
  animationType,
  confirmText,
  cancelText,
  title,
}: ModalProps) => {
  const {theme} = useThemeContext();
  const styles = createStyles(theme);

  return (
    <>
      <Modal
        transparent={true}
        animationType={animationType}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <StatusBar backgroundColor={'rgba(0, 0, 0, 0.5)'} />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{title}</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.confirmButton}>
                <Text style={styles.buttonText}>{confirmText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.cancelButton}>
                <Text style={styles.buttonText}>{cancelText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ConfirmModal;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: Colors[theme].secondary_dark,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      textAlign: 'center',
      lineHeight: 35,
      color: Colors[theme].text,
      marginBottom: 20,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    confirmButton: {
      backgroundColor: Colors[theme].danger,
      padding: 10,
      borderRadius: 5,
      flex: 1,
      alignItems: 'center',
      marginRight: 10,
    },
    cancelButton: {
      backgroundColor: Colors[theme].primary,
      padding: 10,
      borderRadius: 5,
      flex: 1,
      alignItems: 'center',
      marginLeft: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
