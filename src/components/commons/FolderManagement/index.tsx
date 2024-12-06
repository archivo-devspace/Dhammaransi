import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util'

// import {sendDownloadedDataToLocalDir} from './downloadApi'; // Adjust the path to your download API file

const FolderManagement = ({ navigation }: any) => {
  const [folderName, setFolderName] = useState('');
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const loadFolders = async () => {
    const { dirs } = ReactNativeBlobUtil.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
    const path = `${dirToSave}/downloads`;

    try {
      const exists = await ReactNativeBlobUtil.fs.isDir(path);
      if (!exists) {
        await ReactNativeBlobUtil.fs.mkdir(path);
      }
      const files = await ReactNativeBlobUtil.fs.ls(path);
      const directories = await Promise.all(
        files.map(async file => {
          const fullPath = `${path}/${file}`;
          const isDir = await ReactNativeBlobUtil.fs.isDir(fullPath);
          return isDir ? fullPath : null;
        }),
      );
      setFolders(directories.filter(Boolean) as string[]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load folders!');
    }
  };

  const createFolder = async () => {
    if (!folderName) {
      Alert.alert('Error', 'Folder name cannot be empty!');
      return;
    }

    const { dirs } = ReactNativeBlobUtil.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
    const folderPath = `${dirToSave}/downloads/${folderName}`;


    try {
      const exists = await ReactNativeBlobUtil.fs.isDir(folderPath);
      if (!exists) {
        await ReactNativeBlobUtil.fs.mkdir(folderPath);
        Alert.alert('Success', 'Folder created successfully!');
        setFolderName('');
        loadFolders();
      } else {
        Alert.alert('Error', 'Folder already exists!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create folder!');
    }
  };

  

  useEffect(() => {
    loadFolders();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{}}>
        <Text style={styles.label}>Enter Folder Name:</Text>
        <TextInput
          style={styles.input}
          value={folderName}
          onChangeText={setFolderName}
          placeholder="Folder Name"
        />
      </View>
      <Button title="Create Folder" onPress={createFolder} />
      <View style={styles.folderList}>
        {folders.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedFolder(item);
              //   downloadMP3(item);
            }}>
            <Text style={styles.folderItem}>{item.split('/').pop()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  folderList: {
    marginTop: 16,
  },
  folderItem: {
    padding: 16,
    backgroundColor: '#eee',
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default FolderManagement;
