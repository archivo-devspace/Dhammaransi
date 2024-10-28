import {Platform, DeviceEventEmitter} from 'react-native';
import ReactNativeBlobUtil, {
  ReactNativeBlobUtilConfig,
} from 'react-native-blob-util';

type Callback = (err: any) => void;
type ProgressCallback = (progress: number) => void;

interface OfflineDownloadData {
  id: string;
  url: string;
  artist: string;
  title: string;
  downloadDate: Date;
  artwork: string;
  isAudio: boolean;
  selectedFolder: string | null;
}

export const sendDownloadedDataToLocalDir = async (
  callback: Callback = (err: any) => {},
  contentId: string,
  src: string,
  artistName: string,
  songName: string,
  posterImage: string,
  isAudio: boolean,
  selectedFolder: string | null,
  onProgress?: ProgressCallback,
) => {
  const {dirs} = ReactNativeBlobUtil.fs;
  const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
  const path = `${dirToSave}/file.json`;
  const secondPath = `${dirToSave}/downloads/${selectedFolder}/file.json`;

  let offlineMusicPlayerUrl = '';
  let imageUrl = '';
  let roundOffValue = 0;
  const getNewTime = new Date().getTime();

  const commonConfig = {
    fileCache: true,
    useDownloadManager: true,
    notification: true,
    title: songName,
    path: isAudio
      ? `${dirToSave}/${getNewTime}.mp3`
      : `${dirToSave}/${getNewTime}.mp4`,
    mediaScannable: true,
    description: 'file download',
  };

  const configOptions = Platform.select({
    ios: commonConfig,
    android: commonConfig,
  });

  const saveMetadata = async (
    offlineObjData: OfflineDownloadData,
    cb: () => void,
  ) => {
    let offlineDownloadList: OfflineDownloadData[] = [];
    let secondPathList: OfflineDownloadData[] = [];

    try {
      const localDownloads = await ReactNativeBlobUtil.fs.readFile(
        path,
        'utf8',
      );
      offlineDownloadList = JSON.parse(localDownloads) as OfflineDownloadData[];
    } catch (e) {
      // Handle file read error, if any
    }

    try {
      const localDownloads = await ReactNativeBlobUtil.fs.readFile(
        secondPath,
        'utf8',
      );
      secondPathList = JSON.parse(localDownloads) as OfflineDownloadData[];
    } catch (e) {
      // Handle file read error, if any
    }

    offlineDownloadList.push(offlineObjData);
    secondPathList.push(offlineObjData);

    await ReactNativeBlobUtil.fs
      .writeFile(path, JSON.stringify(offlineDownloadList), 'utf8')
      .then(() => {
        cb && cb();
      })
      .catch(() => {
        // Handle file write error, if any
      });

    await ReactNativeBlobUtil.fs
      .writeFile(secondPath, JSON.stringify(secondPathList), 'utf8')
      .then(() => {
        cb && cb();
      })
      .catch(() => {
        // Handle file write error, if any
      });
  };

  const startDownloadingPosterImage = async (cb: () => void) => {
    try {
      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: `${dirToSave}/${contentId}.webp`,
        IOSBackgroundTask: true,
      }).fetch('GET', posterImage, {});
      if (res) {
        imageUrl = res.path();
      }
    } catch (e) {
      // Handle image download error, if any
    }

    cb && cb();
  };

  if (src) {
    ReactNativeBlobUtil.config(configOptions as any)
      .fetch('GET', src, {})
      .progress((received: any, total: any) => {
        const percentageValue = (received / total) * 100;
        roundOffValue = Math.round(percentageValue);
        if (onProgress) {
          onProgress(roundOffValue);
        }

        const params = {
          contentId,
          source: src,
          artistName,
          songName,
          progressValue: JSON.stringify(roundOffValue),
        };
        DeviceEventEmitter.emit('downloadProgress', params);
      })
      .then(async res => {
        offlineMusicPlayerUrl = res.path();

        await startDownloadingPosterImage(async () => {
          const offlineObjData: OfflineDownloadData = {
            id: contentId,
            url: offlineMusicPlayerUrl,
            artist: artistName,
            title: songName,
            downloadDate: new Date(),
            artwork: imageUrl,
            isAudio,
            selectedFolder,
          };

          await saveMetadata(offlineObjData, () => {
            const params = {
              contentId,
              source: src,
              artistName,
              songName,
              progressValue: JSON.stringify(roundOffValue),
            };
            DeviceEventEmitter.emit('downloadDone', params);
          });
        });
      })
      .catch(err => {
        callback('error');
        DeviceEventEmitter.emit('downloadError', true);
      });
  }
};

export const fetchDownloadedDataFromLocalDir = async (
  sendData = (localDownloads: any) => {},
  folderName?: string,
) => {
  const trackFolder =
    Platform.OS === 'ios'
      ? ReactNativeBlobUtil.fs.dirs.DocumentDir
      : ReactNativeBlobUtil.fs.dirs.CacheDir;

  const fetchPath = folderName
    ? `${trackFolder}/downloads/${folderName}/file.json`
    : `${trackFolder}/file.json`;

  // console.log("folderpath", fetchPath)

  try {
    const exists = await ReactNativeBlobUtil.fs.exists(fetchPath);
    // console.log("exist", exists)
    if (!exists) {
      sendData([]); // Send an empty array if the file doesn't exist
      return;
    }

    let localDownloads = await ReactNativeBlobUtil.fs.readFile(
      fetchPath,
      'utf8',
    );
    // console.log("localDownlaods", localDownloads)
    localDownloads = JSON.parse(localDownloads);
    if (Array.isArray(localDownloads)) {
      sendData(localDownloads);
    }
  } catch (e: any) {
    // console.error('Error reading file:', e);
    sendData([]); // Send an empty array in case of an error
  }
};

export const deleteContentFromLocalDir = async (
  downloadedId: any,
  selectedFolder: string,
) => {
  const {dirs} = ReactNativeBlobUtil.fs;
  const cacheDir = dirs.CacheDir;
  const documentDir = dirs.DocumentDir;

  // Use appropriate directory based on platform
  const baseDir = Platform.OS === 'ios' ? documentDir : cacheDir;
  const jsonFilePath = `${baseDir}/file.json`;
  const folderJsonFilePath = `${baseDir}/downloads/${selectedFolder}/file.json`;

  try {
    // Ensure that the file exists before attempting to read
    const [localDownloadsExists, secondDownloadsExists] = await Promise.all([
      ReactNativeBlobUtil.fs.exists(jsonFilePath),
      ReactNativeBlobUtil.fs.exists(folderJsonFilePath),
    ]);

    if (localDownloadsExists) {
      await updateJsonFile(jsonFilePath, downloadedId);
    }

    if (secondDownloadsExists) {
      await updateJsonFile(folderJsonFilePath, downloadedId);
    }
  } catch (e) {
    console.error('Failed to delete content', e);
  }
};

const updateJsonFile = async (filePath: string, downloadedId: any) => {
  try {
    const fileContent = await ReactNativeBlobUtil.fs.readFile(filePath, 'utf8');
    let jsonObj = JSON.parse(fileContent);

    const index = jsonObj.findIndex((item: any) => item.id === downloadedId);
    if (index !== -1) {
      jsonObj.splice(index, 1);
      await ReactNativeBlobUtil.fs.writeFile(
        filePath,
        JSON.stringify(jsonObj),
        'utf8',
      );
    }
  } catch (e) {
    console.error(`Failed to update file at ${filePath}`, e);
  }
};

// export const deleteAllDownloadDataFromLocal = async (selectedFolder: string | null) => {
//   let jsonObj: any = [];
//   const { dirs } = ReactNativeBlobUtil.fs;
//   const path = `${dirs.CacheDir}/.file.json`;
//   const secondpath = `${dirs.CacheDir}/${selectedFolder}/.file.json`;

//   try {
//     await ReactNativeBlobUtil.fs.writeFile(path, JSON.stringify(jsonObj), 'utf8');
//     await ReactNativeBlobUtil.fs.writeFile(secondpath, JSON.stringify(jsonObj), 'utf8');
//   } catch (e) {
//     // Handle error
//     console.error('Failed to delete all download data', e);
//   }
// };

export const deleteAllDownloadDataFromLocal = async (
  selectedFolder: string | null,
) => {
  const {dirs} = ReactNativeBlobUtil.fs;
  const cacheDir = dirs.CacheDir;
  const documentDir = dirs.DocumentDir;

  // Use appropriate directory based on platform
  const baseDir = Platform.OS === 'ios' ? documentDir : cacheDir;
  const jsonFilePath = `${baseDir}/file.json`;
  const folderJsonFilePath = `${baseDir}/downloads/${selectedFolder}/file.json`;

  try {
    if (selectedFolder) {
      // Clear .file.json in the selected folder
      await ReactNativeBlobUtil.fs.writeFile(
        folderJsonFilePath,
        JSON.stringify([]),
        'utf8',
      );

      // Delete all files in the selected folder
      const folderPath = `${baseDir}/downloads/${selectedFolder}`;
      await deleteAllFilesInFolder(folderPath);
    }

    // Update the main .file.json to remove data related to selectedFolder
    await updateJsonFileForAllDelete(jsonFilePath, selectedFolder);
  } catch (e) {
    console.error('Failed to delete all download data', e);
  }
};

// Deletes all files in a specific folder
const deleteAllFilesInFolder = async (folderPath: string) => {
  try {
    const files = await ReactNativeBlobUtil.fs.ls(folderPath);
    await Promise.all(
      files.map(async file => {
        const filePath = `${folderPath}/${file}`;
        await ReactNativeBlobUtil.fs.unlink(filePath);
      }),
    );
  } catch (e) {
    console.error('Failed to delete files in folder', e);
  }
};

// Updates the main JSON file to remove entries related to the selectedFolder
const updateJsonFileForAllDelete = async (
  filePath: string,
  selectedFolder: string | null,
) => {
  try {
    const fileContent = await ReactNativeBlobUtil.fs.readFile(filePath, 'utf8');
    let jsonObj = JSON.parse(fileContent);

    if (selectedFolder) {
      jsonObj = jsonObj.filter(
        (item: any) => item.selectedFolder !== selectedFolder,
      );
    }

    await ReactNativeBlobUtil.fs.writeFile(
      filePath,
      JSON.stringify(jsonObj),
      'utf8',
    );
  } catch (e) {
    console.error(`Failed to update file at ${filePath}`, e);
  }
};
