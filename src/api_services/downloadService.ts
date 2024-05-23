import {Platform, DeviceEventEmitter} from 'react-native';

import RNFetchBlob, { RNFetchBlobConfig } from 'rn-fetch-blob';

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
}

export const sendDownloadedDataToLocalDir = async (
  callback: Callback = (err: any) => {},
  contentId: string,
  src: string,
  artistName: string,
  songName: string,
  posterImage: string,
  isAudio: boolean,
  onProgress?: ProgressCallback
) => {
  const { dirs } = RNFetchBlob.fs;
  const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
  const path = `${dirToSave}/.file.json`;

  let offlineMusicPlayerUrl = '';
  let imageUrl = '';
  let roundOffValue = 0;
  const getNewTime = new Date().getTime();

  const commonConfig = {
    fileCache: true,
    useDownloadManager: true,
    notification: true,
    title: songName,
    path: isAudio ? `${dirToSave}/${getNewTime}.mp3` : `${dirToSave}/${getNewTime}.mp4`,
    mediaScannable: true,
    description: 'file download',
  };

  const configOptions = Platform.select({
    ios: {
      fileCache: commonConfig.fileCache,
      title: commonConfig.title,
      path: commonConfig.path,
      appendExt: isAudio ? 'mp3' : 'mp4',
    } as RNFetchBlobConfig ,
    android: commonConfig,
  });

  const saveMetadata = async (offlineObjData: OfflineDownloadData, cb: () => void) => {
    let offlineDownloadList: OfflineDownloadData[] = [];
    try {
      const localDownloads = await RNFetchBlob.fs.readFile(path, 'utf8');
      offlineDownloadList = JSON.parse(localDownloads) as OfflineDownloadData[];
    } catch (e) {
      // Handle file read error, if any
    }

    offlineDownloadList.push(offlineObjData);
    await RNFetchBlob.fs.writeFile(path, JSON.stringify(offlineDownloadList), 'utf8')
      .then(() => {
        cb && cb();
      })
      .catch(() => {
        // Handle file write error, if any
      });
  };

  const startDownloadingPosterImage = async (cb: () => void) => {
    try {
      const res = await RNFetchBlob.config({
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
    RNFetchBlob.config(configOptions as any)
      .fetch('GET', src, {})
      .progress((received, total) => {
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
      .then(async (res) => {
        if (Platform.OS === 'ios') {
          await RNFetchBlob.fs.writeFile(commonConfig.path, res.data, 'base64');
          offlineMusicPlayerUrl = commonConfig.path;
        } else {
          offlineMusicPlayerUrl = res.path();
        }

        await startDownloadingPosterImage(async () => {
          const offlineObjData: OfflineDownloadData = {
            id:contentId,
            url: offlineMusicPlayerUrl,
            artist:artistName,
            title:songName,
            downloadDate: new Date(),
            artwork: imageUrl,
            isAudio,
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
      .catch((err) => {
        callback('error');
        DeviceEventEmitter.emit('downloadError', true);
      });
  }
};

export const fetchDownloadedDataFromLocalDir = async (sendData = (localDownloads:any) => {}) => {
  const trackFolder =
    Platform.OS === 'ios'
      ? RNFetchBlob.fs.dirs.DocumentDir
      : RNFetchBlob.fs.dirs.CacheDir;
  const MyPath = RNFetchBlob.fs.dirs.CacheDir + `/.file.json`;
  await RNFetchBlob.fs
    .ls(trackFolder)
    .then(files => {})
    .catch(err => {});
  try {
    let localDownloads = await RNFetchBlob.fs.readFile(MyPath, 'utf8');
    localDownloads = JSON.parse(localDownloads);
    if (Array.isArray(localDownloads)) {
      sendData(localDownloads);
    }
  } catch (e) {}
};

export const deleteContentFromLocalDir = async (downloadedId:any) => {
  let jsonObj = [];
  const MyPath = RNFetchBlob.fs.dirs.CacheDir + `/.file.json`;
  try {
    let localDownloads = await RNFetchBlob.fs.readFile(MyPath, 'utf8');
    localDownloads = JSON.parse(localDownloads);
    if (Array.isArray(localDownloads)) {
      jsonObj = localDownloads;
    }
  } catch (e) {}

  let flag:any = '';
  const contentIdToFind = downloadedId;
  jsonObj.map((item, index) => {
    if (item.id === contentIdToFind) {
      flag = index;
    }
  });
  jsonObj.splice(flag, 1);
  await RNFetchBlob.fs
    .writeFile(MyPath, JSON.stringify(jsonObj), 'utf8')
    .then(r => {})
    .catch(e => {});
};

export const deleteAllDownloadDataFromLocal = async () => {
  let jsonObj:any = [];
  const MyPath = RNFetchBlob.fs.dirs.CacheDir + `/.file.json`;
  await RNFetchBlob.fs
    .writeFile(MyPath, JSON.stringify(jsonObj), 'utf8')
    .then(r => {})
    .catch(e => {});
};
