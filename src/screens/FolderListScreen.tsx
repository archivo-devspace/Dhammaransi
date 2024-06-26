import React, {useEffect, useState} from 'react';
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
import {MaterialIcons} from '../utils/common';
import Container from '../components/commons/Container';
import {CustomButton} from '../components/utils';
import {useTranslation} from 'react-i18next';

type Props = {
  navigation: NavigationMainBottomTabScreenProps['navigation'];
};

const FolderListScreen = ({navigation}: Props) => {
  const {folders, loadFolders, createFolder} = useTrackContext();
  const [folderName, setFolderName] = useState('');
  const {t} = useTranslation();

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

  const renderFolderItem = ({item}: {item: string}) => {
    return (
      <TouchableOpacity
        style={styles.folderItem}
        onPress={() => handleFolderPress(item)}>
        <MaterialIcons name="folder" size={24} color={Colors[theme].text} />
        <Text style={styles.folderName}>{item}</Text>
      </TouchableOpacity>
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
      backgroundColor: Colors[theme].secondary,
      marginBottom: 8,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
      borderWidth: 1,
      borderColor: Colors[theme]?.secondary_light,
    },
    folderName: {
      fontSize: 16,
      color: Colors[theme].text,
      marginLeft: 8,
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
      color: Colors[theme].text,
    },
  });

export default FolderListScreen;
