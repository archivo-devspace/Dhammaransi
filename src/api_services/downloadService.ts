import { Platform, DeviceEventEmitter } from 'react-native';
import ReactNativeBlobUtil, { ReactNativeBlobUtilConfig } from 'react-native-blob-util';

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
  isDownloaded:boolean;
  originalUrl: string | null;
  originalArtwork: string | null;
}

const getDirToSave = () => (Platform.OS === 'ios' ? ReactNativeBlobUtil.fs.dirs.DocumentDir : ReactNativeBlobUtil.fs.dirs.CacheDir);

const createCommonConfig = (songName: string, isAudio: boolean, dirToSave: string, getNewTime: number) => ({
  fileCache: true,
  useDownloadManager: true,
  notification: true,
  title: songName,
  path: isAudio ? `${dirToSave}/${getNewTime}.mp3` : `${dirToSave}/${getNewTime}.mp4`,
  mediaScannable: true,
  description: 'file download',
});

const readFileContent = async (path: string) => {
  try {
    const fileContent = await ReactNativeBlobUtil.fs.readFile(path, 'utf8');
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
};

const writeFileContent = async (path: string, content: any) => {
  try {
    await ReactNativeBlobUtil.fs.writeFile(path, JSON.stringify(content), 'utf8');
  } catch (e) {
    console.error(`Failed to write to file at ${path}`, e);
  }
};

const startDownloadingPosterImage = async (posterImage: string, dirToSave: string, contentId: string) => {
  try {
    const res = await ReactNativeBlobUtil.config({
      fileCache: true,
      path: `${dirToSave}/${contentId}.webp`,
      IOSBackgroundTask: true,
    }).fetch('GET', posterImage);

    return res.path();
  } catch (e) {
    console.error('Failed to download poster image', e);
    return '';
  }
};

const saveMetadata = async (offlineObjData: OfflineDownloadData, cb: () => void) => {
  const paths = [
    `${getDirToSave()}/file.json`,
    `${getDirToSave()}/downloads/${offlineObjData.selectedFolder}/file.json`,
  ];

  try {
    const [offlineDownloadList, secondPathList] = await Promise.all(paths.map(readFileContent));
    offlineDownloadList.push(offlineObjData);
    secondPathList.push(offlineObjData);

    await Promise.all(paths.map((path, index) => writeFileContent(path, index === 0 ? offlineDownloadList : secondPathList)));
    cb();
  } catch (e) {
    console.error('Failed to save metadata', e);
  }
};

export const sendDownloadedDataToLocalDir = async (
  callback: Callback = (err: any) => {},
  contentId: string,
  src: string,
  artistName: string,
  songName: string,
  posterImage: string,
  isAudio: boolean,
  selectedFolder: string | null,
  isDownloaded:boolean,
  originalUrl: string | null,
  originalArtwork: string | null,
  onProgress?: ProgressCallback,
) => {
  const dirToSave = getDirToSave();
  const getNewTime = new Date().getTime();
  const commonConfig = createCommonConfig(songName, isAudio, dirToSave, getNewTime);
  if (src) {
    console.log("url", src)
    console.log("posterImage", posterImage)
    ReactNativeBlobUtil.config(commonConfig)
      .fetch('GET', src)
      .progress((received: any, total: any) => {
        const roundOffValue = Math.round((received / total) * 100);
        onProgress && onProgress(roundOffValue);
        DeviceEventEmitter.emit('downloadProgress', { contentId, source: src, artistName, songName, progressValue: JSON.stringify(roundOffValue) });
      })
      .then(async (res) => {
        const offlineMusicPlayerUrl = res.path();
        const imageUrl = await startDownloadingPosterImage(posterImage, dirToSave, contentId);

        const offlineObjData: OfflineDownloadData = {
          id: contentId,
          url: offlineMusicPlayerUrl,
          artist: artistName,
          title: songName,
          downloadDate: new Date(),
          artwork: imageUrl,
          isAudio,
          selectedFolder,
          isDownloaded:true,
          originalUrl: src,
          originalArtwork: posterImage
        };

        await saveMetadata(offlineObjData, () => {
          DeviceEventEmitter.emit('downloadDone', { contentId, source: src, artistName, songName, progressValue: JSON.stringify(100) });
        });
      })
      .catch((err) => {
        callback('error');
        DeviceEventEmitter.emit('downloadError', true);
      });
  }
};

export const fetchDownloadedDataFromLocalDir = async (sendData: (localDownloads: any) => void, folderName?: string) => {
  const fetchPath = folderName
    ? `${getDirToSave()}/downloads/${folderName}/file.json`
    : `${getDirToSave()}/file.json`;

  try {
    const exists = await ReactNativeBlobUtil.fs.exists(fetchPath);
    if (!exists) {
      sendData([]);
      return;
    }

    const localDownloads = await readFileContent(fetchPath);
    sendData(localDownloads);
  } catch (e) {
    sendData([]);
  }
};

export const deleteContentFromLocalDir = async (downloadedId: string, selectedFolder: string) => {
  const baseDir = getDirToSave();
  const jsonFilePath = `${baseDir}/file.json`;
  const folderJsonFilePath = `${baseDir}/downloads/${selectedFolder}/file.json`;

  try {
    const [localDownloadsExists, secondDownloadsExists] = await Promise.all([
      ReactNativeBlobUtil.fs.exists(jsonFilePath),
      ReactNativeBlobUtil.fs.exists(folderJsonFilePath),
    ]);

    if (localDownloadsExists) await updateJsonFile(jsonFilePath, downloadedId);
    if (secondDownloadsExists) await updateJsonFile(folderJsonFilePath, downloadedId);
  } catch (e) {
    console.error('Failed to delete content', e);
  }
};

const updateJsonFile = async (filePath: string, downloadedId: string) => {
  try {
    const fileContent = await ReactNativeBlobUtil.fs.readFile(filePath, 'utf8');
    let jsonObj = JSON.parse(fileContent);
    jsonObj = jsonObj.filter((item: any) => item.id !== downloadedId);

    await writeFileContent(filePath, jsonObj);
  } catch (e) {
    console.error(`Failed to update file at ${filePath}`, e);
  }
};

export const deleteAllDownloadDataFromLocal = async (selectedFolder: string | null) => {
  const baseDir = getDirToSave();
  const jsonFilePath = `${baseDir}/file.json`;
  const folderJsonFilePath = `${baseDir}/downloads/${selectedFolder}/file.json`;

  try {
    if (selectedFolder) {
      await writeFileContent(folderJsonFilePath, []);
      const folderPath = `${baseDir}/downloads/${selectedFolder}`;
      await deleteAllFilesInFolder(folderPath);
    }

    await updateJsonFileForAllDelete(jsonFilePath, selectedFolder);
  } catch (e) {
    console.error('Failed to delete all download data', e);
  }
};

const deleteAllFilesInFolder = async (folderPath: string) => {
  try {
    const files = await ReactNativeBlobUtil.fs.ls(folderPath);
    await Promise.all(files.map(async (file) => await ReactNativeBlobUtil.fs.unlink(`${folderPath}/${file}`)));
  } catch (e) {
    console.error('Failed to delete files in folder', e);
  }
};

const updateJsonFileForAllDelete = async (filePath: string, selectedFolder: string | null) => {
  try {
    const fileContent = await ReactNativeBlobUtil.fs.readFile(filePath, 'utf8');
    let jsonObj = JSON.parse(fileContent);

    if (selectedFolder) {
      jsonObj = jsonObj.filter((item: any) => item.selectedFolder !== selectedFolder);
    }

    await writeFileContent(filePath, jsonObj);
  } catch (e) {
    console.error(`Failed to update file at ${filePath}`, e);
  }
};
