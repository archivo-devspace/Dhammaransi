import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import {useTrackContext} from '../contexts/TrackContext';
import {Colors} from '../theme';
import {Theme, useThemeContext} from '../contexts/ThemeContext';
import {NavigationMainBottomTabScreenProps} from '../navigations/BottomNavigation';
import {AntDesign, MaterialIcons} from '../utils/common';
import Container from '../components/commons/Container';
import {CustomButton} from '../components/utils';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
import ConfirmModal from '../components/commons/ConfirmModal';

type Props = {
  navigation: NavigationMainBottomTabScreenProps['navigation'];
};

const FolderListScreen = ({navigation}: Props) => {
  const {folders, loadFolders, createFolder, deleteFolder} = useTrackContext();
  const [folderName, setFolderName] = useState('');
  const {t} = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFolderName, setSelectedFolderName] = useState<string | null>(
    null,
  );
  const swipeableRefs = useRef<Swipeable[]>([]);

  const {theme} = useThemeContext();
  const styles = createStyles(theme);

  useEffect(() => {
    loadFolders();
  }, []);

  const handleFolderPress = (folderName: string) => {
    navigation.navigate('FolderDetail', {folderName});
  };

  const handleCreateFolder = async () => {
    await createFolder(folderName);
    setFolderName('');
  };

  const confirmDeletion = (folderName: string) => {
    setSelectedFolderName(folderName);
    setModalVisible(true);
  };
  console.log('setDeletion', folderName);

  const handleDeletion = async () => {
    console.log('selectedFolderName', selectedFolderName);
    if (selectedFolderName) {
      swipeableRefs.current.forEach(ref => ref?.close());
      await deleteFolder(selectedFolderName);
      setModalVisible(false);
      setSelectedFolderName(null);
    }
  };

  const handleCancelDeletion = () => {
    setModalVisible(false);
    swipeableRefs.current.forEach(ref => ref?.close());
  };

  const renderFolderItem = ({item, index}: {item: string; index: number}) => {
    console.log('renderFolderItem', item);
    return (
      <Swipeable
        // ref={swipeableRef}
        ref={ref => {
          swipeableRefs.current[index] = ref as any;
        }}
        onSwipeableWillOpen={() => confirmDeletion(item)}
        renderLeftActions={() => (
          <View style={styles.leftDeleteContainer}>
            <View style={styles.deleteButton}>
              <AntDesign name="delete" size={30} color="white" />
            </View>
          </View>
        )}
        renderRightActions={() => (
          <View style={styles.deleteContainer}>
            <View style={styles.deleteButton}>
              <AntDesign name="delete" size={30} color="white" />
            </View>
          </View>
        )}>
        <View style={styles.trackItem}>
          {/* <CustomButton
          onPress={() => handlePlayAudio(item)}
          customButtonStyle={styles.playButton}>
          <AntDesign
            name="caretright"
            size={30}
            color={Colors[theme].primary}
          />
        </CustomButton> */}
          <TouchableOpacity
            style={{
              width: '100%',
              gap: 20,
              flexDirection: 'row',
              paddingVertical: 20,
              alignItems: 'center',
            }}
            onPress={() => handleFolderPress(item)}>
            <MaterialIcons
              name="folder"
              size={24}
              color={Colors[theme].primary}
            />
            <Text style={styles.folderName}>{item.split('/').pop()}</Text>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <Container title={t('UTILS.DOWNLOAD_MANAGED')}>
      <View style={styles.formcontainer}>
        <TextInput
          style={styles.input}
          value={folderName}
          onChangeText={setFolderName}
          placeholder={t('UTILS.FOLDER_NAME')}
          placeholderTextColor={Colors[theme].text}
        />
        <CustomButton
          customButtonStyle={styles.createButton}
          customButtonTextStyle={styles.textButton}
          title={t('UTILS.CREATE')}
          onPress={handleCreateFolder}
        />
      </View>

      <View style={styles.container}>
        <FlatList
          data={folders}
          renderItem={renderFolderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.folderList}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <ConfirmModal
        title={t('UTILS.DELETE_FOLDER')}
        confirmText={t('UTILS.YES_DELETE')}
        cancelText={t('UTILS.NO_DELETE')}
        animationType="fade"
        handleConfirm={handleDeletion}
        handleCancel={handleCancelDeletion}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />
    </Container>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: Colors[theme].secondary,
      paddingBottom: 46,
    },
    folderList: {
      paddingBottom: 20,
    },
    folderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 24,
      width: '100%',
      backgroundColor: Colors[theme].secondary,
      marginBottom: 8,
      borderRadius: 8,
    },
    folderName: {
      fontSize: 16,
      color: Colors[theme].text,
    },
    formcontainer: {
      justifyContent: 'center',
      padding: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: Colors[theme].text,
    },
    input: {
      height: 50,
      borderColor: Colors[theme].primary,
      color: Colors[theme].text,
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 15,
      borderRadius: 5,
    },
    createButton: {
      backgroundColor: Colors[theme].primary,
      alignSelf: 'center',
      borderRadius: 5,
      padding: 10,
      width: '100%',
    },
    textButton: {
      fontSize: 20,
      fontWeight: '500',
      color: Colors[theme].black,
    },
    trackItem: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor: Colors[theme].secondary,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].secondary_dark,
    },
    deleteContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: Colors[theme].danger,
      // borderRadius: 16,
      // borderLeftWidth: 2,
      // borderRightWidth: 2,
      // borderLeftColor: Colors[theme].danger,
      // borderRightColor: Colors[theme].danger,
    },
    leftDeleteContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: Colors[theme].danger,
      // borderRadius: 16,
      // borderLeftWidth: 2,
      // borderRightWidth: 2,
      // borderLeftColor: Colors[theme].danger,
      // borderRightColor: Colors[theme].danger,
    },
    deleteButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 70,
      height: '100%',
    },
  });

export default FolderListScreen;
