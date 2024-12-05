import {
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Colors} from '../../../theme';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';
import {getFontFamily} from '../../../utils/common';

interface ModalProps {
  isModalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  handleConfirm: () => void;
  handleCancel: () => void;
  animationType: 'fade' | 'slide' | 'none';
  confirmText: string;
  cancelText: string;
  title: string;
  confirmType?: 'delete' | 'confirm';
  requiredCancelBtn?: boolean;
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
  confirmType = 'delete',
  requiredCancelBtn = true,
}: ModalProps) => {
  const {theme} = useThemeContext();
  const styles = createStyles(theme);
  const {height} = useWindowDimensions();

  return (
    <>
      <Modal
        transparent={true}
        animationType={animationType}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <StatusBar
          backgroundColor={
            theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)'
          }
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{title}</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleConfirm}
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor:
                      confirmType === 'delete'
                        ? Colors[theme].danger
                        : Colors[theme].primary,
                  },
                ]}>
                <Text
                  style={[
                    {
                      fontFamily: getFontFamily('regular'),
                      fontSize: height * 0.02,
                      color:
                        confirmType === 'delete' ? 'white' : Colors[theme].text,
                    },
                  ]}>
                  {confirmText}
                </Text>
              </TouchableOpacity>
              {requiredCancelBtn && (
                <TouchableOpacity
                  onPress={handleCancel}
                  style={[
                    styles.cancelButton,
                    {
                      backgroundColor:
                        confirmType === 'delete'
                          ? Colors[theme].primary
                          : Colors[theme].secondary_light,
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        fontFamily: getFontFamily('regular'),
                        fontSize: height * 0.02,
                        color:
                          confirmType === 'delete'
                            ? 'white'
                            : Colors[theme].text,
                      },
                    ]}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>
              )}
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
      backgroundColor:
        theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: Colors[theme].secondary_light,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      fontFamily: getFontFamily('bold'),
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
      padding: 10,
      borderRadius: 5,
      flex: 1,
      alignItems: 'center',
      marginRight: 10,
    },
    cancelButton: {
      padding: 10,
      borderRadius: 5,
      flex: 1,
      alignItems: 'center',
      marginLeft: 10,
    },
  });
