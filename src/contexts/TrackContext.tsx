import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import TrackPlayer, {
  Capability,
  RepeatMode,
  State,
  Track,
  usePlaybackState,
} from 'react-native-track-player';

import {
  deleteAllDownloadDataFromLocal,
  fetchDownloadedDataFromLocalDir,
  sendDownloadedDataToLocalDir,
} from '../api_services/downloadService';
import {Alert, DeviceEventEmitter, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { createChannel, displayNotification } from '../api_services/notificationService';

export interface TrackProps {
  id: number;
  url: any;
  title: string;
  artist: string;
  date: string;
  artwork: any;
}

export interface TrackContextType {
  trackLists: Array<TrackProps>;
  setTrackLists: (trackLists: Array<TrackProps>) => void;
  playingTrackLists: Array<TrackProps>;
  setPlayingTrackLists: (playingTrackLists: Array<TrackProps>) => void;
  getAllTracks?: () => void;
  repeatIcon: () =>
    | 'repeat'
    | 'repeat-off'
    | 'repeat-once'
    | 'shuffle'
    | 'shuffle-disabled'
    | undefined;
  changeRepeatMode: () => void;
  handlePlay: (trackId: number) => void;
  togglePlayingMode: () => void;
  handleNextTrack: () => void;
  handlePrevTrack: () => void;
  currentTrack: any;
  setRepeatMode: (repeatMode: string) => void;
  repeatMode: string;
  getCurrentQueue: () => Promise<Track[]>;
  getActiveTrack: () => Promise<any>;
  onDownloadPress: () => void;
  onAlreadyDownloadPress: () => void;
  setDownloadingTrackIds: Dispatch<any>;
  setDownloading: Dispatch<SetStateAction<boolean>>;
  isAlreadyDownload: boolean;
  setAlreadyDownload: Dispatch<SetStateAction<boolean>>;
  isDownloading: boolean;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isModalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  deleteTrackById: (id: any) => void;
  downloadProgress: number;
  selectedFolder: string | null;
  setSelectedFolder: Dispatch<SetStateAction<string | null>>;
  loadFolders: () => void;
  createFolder: any;
  deleteFolder: any;
  folders: string[];
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const TrackProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [trackLists, setTrackLists] = useState<Array<TrackProps>>([]);
  const [playingTrackLists, setPlayingTrackLists] = useState<Array<TrackProps>>(
    [],
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAlreadyDownload, setAlreadyDownload] = useState(false);
  const [downloadingTrackIds, setDownloadingTrackIds] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setDownloading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const playbackState = usePlaybackState();
  const [repeatMode, setRepeatMode] = useState('shuffle-disabled');
  const [initialQueue, setInitialQueue] = useState<any>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folders, setFolders] = useState<string[]>([]);

  // useLayoutEffect(() => {
  //   const getAllTracks = () => {
  //     setTrackLists(tracks);
  //   };
  //   getAllTracks();
  // }, []);

  const loadFolders = async () => {
    const {dirs} = RNFetchBlob.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
    const path = `${dirToSave}/downloads`;
    const defaultFolderPath = `${dirToSave}/downloads/Downloads`;

    try {
      const exists = await RNFetchBlob.fs.isDir(path);
      console.log('exists', exists);
      if (!exists) {
        await RNFetchBlob.fs.mkdir(path);
        await RNFetchBlob.fs.mkdir(defaultFolderPath);
      }
      const files = await RNFetchBlob.fs.ls(path);
      const directories = await Promise.all(
        files.map(async file => {
          const fullPath = `${path}/${file}`;
          const isDir = await RNFetchBlob.fs.isDir(fullPath);
          return isDir ? file : null;
        }),
      );
      setFolders(directories.filter(Boolean) as string[]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load folders!');
    }
  };

  const createFolder = async (folderName: string) => {
    if (!folderName) {
      Alert.alert('Error', 'Folder name cannot be empty!');
      return;
    }

    const {dirs} = RNFetchBlob.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
    const folderPath = `${dirToSave}/downloads/${folderName}`;

    try {
      const exists = await RNFetchBlob.fs.isDir(folderPath);
      if (!exists) {
        await RNFetchBlob.fs.mkdir(folderPath);
        loadFolders();
        Alert.alert('Success', 'Folder created successfully!');
        //  setFolderName('');
      } else {
        Alert.alert('Error', 'Folder already exists!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create folder!');
    }
  };

  console.log('downloadingTrackIds', downloadingTrackIds);

  const deleteFolder = async (folderName: string) => {
    const {dirs} = RNFetchBlob.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
    const folderPath = `${dirToSave}/downloads/${folderName}`;

    const jsonFile = Platform.OS === 'ios' ? `${dirs.DocumentDir}/downloads/${folderName}/.file.json` : `${dirs.CacheDir}/downloads/${folderName}/.file.json`;
    // console.log('jsonFile', jsonFile);

    // console.log('folderPath', folderPath);
    // console.log('folderName', folderName);

    try {
      const exists = await RNFetchBlob.fs.isDir(folderPath);
      console.log('Folder exists:', exists, 'at path:', folderPath);
      if (exists) {
        console.log('Deleting folder:', folderPath);

        const fileExists = await RNFetchBlob.fs.exists(jsonFile);
        if (fileExists) {
          // Read and parse the JSON file
          const jsonContent = await RNFetchBlob.fs.readFile(jsonFile, 'utf8');
          const objectArray = JSON.parse(jsonContent);

          // Extract IDs from the objects in the JSON file
          const jsonFileIds = objectArray.map((obj: any) => obj.id);

          // Filter out IDs in downloadingTrackIds that match the IDs from the JSON file
          const updatedDownloadingTrackIds = downloadingTrackIds.filter(
            (id: any) => !jsonFileIds.includes(id),
          );

          // Update the state with the filtered IDs
          setDownloadingTrackIds(updatedDownloadingTrackIds);

          // console.log(
          //   'Updated downloadingTrackIds:',
          //   updatedDownloadingTrackIds,
          // );
        } else {
          console.log('JSON file does not exist at path:', jsonFile);
        }

        await deleteAllDownloadDataFromLocal(folderName);
        await RNFetchBlob.fs.unlink(`/${folderPath}`); // Ensure this function is correctly defined
        await loadFolders(); // Reload the folder list after deletion
        // setDownloadingTrackIds([]);
        Alert.alert('Success', 'Folder deleted successfully!');
      } else {
        Alert.alert('Error', 'Folder does not exist!');
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
      Alert.alert('Error', 'Failed to delete folder!');
    }
  };

  useLayoutEffect(() => {
    fetchDownloadedDataFromLocalDir(item => {
      if (item?.length > 0) {
        const track = item.find((obj: any) => obj?.id === currentTrack.id);
        setAlreadyDownload(!!track);
      } else {
        setAlreadyDownload(false);
      }
    });

    const find = downloadingTrackIds.find(
      (element: any) => element === currentTrack.id,
    );

    // console.log('find', find);
    if (find !== undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    // Reset the downloading state if the current track changes
    if (!find) {
      setDownloading(false);
    }
  }, [currentTrack, downloadingTrackIds, deleteFolder]);

  // console.log('downloading...', downloadingTrackIds);

  const deleteTrackById = async (id: any) => {
    const remainTracks = downloadingTrackIds.filter((item: any) => {
      return item !== id;
    });
    setDownloadingTrackIds(remainTracks);
  };

  const onDownloadPress = async () => {
    const find = downloadingTrackIds.find(
      (element: any) => element === currentTrack.id,
    );
    if (!find) {
      setModalVisible(true);
      setDownloading(true);
      setDownloadingTrackIds((prevIds: any) => [...prevIds, currentTrack.id]);

      sendDownloadedDataToLocalDir(
        err => {
          if (err) {
            setDownloading(false);
            setDownloadingTrackIds((prevIds: any) =>
              prevIds.filter((id: any) => id !== currentTrack.id),
            );
          }
        },
        currentTrack.id,
        currentTrack.url,
        currentTrack.artist,
        currentTrack.title,
        currentTrack.artwork,
        true,
        selectedFolder,
      );
      setSelectedFolder(null);
    } else {
      setModalVisible(true); // Show the modal with current progress if already downloading
    }
  };

  const onAlreadyDownloadPress = async() => {
    const channelId = await createChannel({channelId:'alreadyDownloaded', channelName:
      'Already Downloaded'
    });

    await displayNotification({channelId:channelId,title:"Already Downloaded !", body:"This content is already downloaded."})
  };

  const handlePlay = useCallback(
    async (trackId: number) => {
      const playingTrack = trackLists?.find(track => track.id === trackId);

      const remainingTracks = trackLists?.filter(track => track.id !== trackId);
      const current = playingTrack && [playingTrack, ...remainingTracks];
      const activeTrack = await TrackPlayer.getActiveTrack();
      if (current) {
        if (playingTrack.id !== activeTrack?.id) {
          await TrackPlayer.reset();
        }
        console.log('shuggle', repeatMode);
        if (repeatMode == 'shuffle') {
          console.log('shuggle', repeatMode);
          handleShuffleTracks();
        } else {
          await TrackPlayer.add(current);
          await TrackPlayer.play();
        }
      } else {
        console.error('No track found to play.');
        return;
      }
    },
    [trackLists],
  );

  useEffect(() => {
    const getCurrentTrack = async () => {
      const current = await TrackPlayer.getActiveTrack();
      current && setCurrentTrack(current);
    };

    getCurrentTrack();
  }, [playbackState]);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'downloadProgress',
      data => {
        if (data.contentId === currentTrack?.id) {
          const progress = parseInt(data.progressValue);
          setDownloadProgress(progress);
        }
      },
    );

    const downloaedListener = DeviceEventEmitter.addListener(
      'downloadDone',
      data => {
        if (data.contentId === currentTrack?.id) {
          setDownloadProgress(100);
        }
      },
    )
    console.log("listener", listener)

    return () => {
      listener.remove();
      downloaedListener.remove();
      // setDownloadProgress(100)
    };
  }, [currentTrack, isDownloading, downloadProgress]);

  const repeatIcon = () => {
    if (repeatMode === 'shuffle-disabled') {
      return 'shuffle-disabled';
    }
    if (repeatMode === 'shuffle') {
      return 'shuffle';
    }
    if (repeatMode === 'track') {
      return 'repeat-once';
    }
    if (repeatMode === 'repeat') {
      return 'repeat';
    }
  };

  console.log('repeat mode', repeatMode);

  const changeRepeatMode = async () => {
    if (repeatMode === 'shuffle') {
      setRepeatMode('shuffle-disabled');
      // await TrackPlayer.setRepeatMode(RepeatMode.Off);
      handleUnShuffleTracks();
    }
    if (repeatMode === 'shuffle-disabled') {
      setRepeatMode('track');
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
    }
    if (repeatMode === 'track') {
      setRepeatMode('repeat');
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    }
    if (repeatMode === 'repeat') {
      // setRepeatMode('shuffle-disabled');

      await TrackPlayer.setRepeatMode(RepeatMode.Off);

      // handleUnShuffleTracks();
      setInitialQueue(getCurrentQueue);
      const currentQueue = await getCurrentQueue();
      setInitialQueue(currentQueue);
      setRepeatMode('shuffle');

      handleShuffleTracks();
    }
  };

  const getCurrentQueue = async () => {
    return await TrackPlayer.getQueue();
  };

  const getActiveTrack = async () => {
    return await TrackPlayer.getActiveTrack();
  };

  const handleUnShuffleTracks = async () => {
    const currentQueue = await getCurrentQueue();
    const currentTrack = await TrackPlayer.getActiveTrack();

    const currentTrackIndex = currentQueue.findIndex(item => {
      return item.title === currentTrack?.title;
    });

    const previousTrackIndexArray =
      currentTrackIndex > 0
        ? Array.from({length: currentTrackIndex}, (_, i) => i)
        : [];

    const activeIndex = initialQueue.findIndex(
      (track: any) => track.id === currentTrack?.id,
    );

    await TrackPlayer.remove(previousTrackIndexArray);
    await TrackPlayer.removeUpcomingTracks();
    await TrackPlayer.add(initialQueue);

    await TrackPlayer.move(0, activeIndex);
    await TrackPlayer.remove(activeIndex + 1);
    // await TrackPlayer.play();
  };

  const handleShuffleTracks = async () => {
    const currentQueue = await getCurrentQueue();
    const currentTrack = await TrackPlayer.getActiveTrack();

    const currentTrackIndex = currentQueue.findIndex(item => {
      return item.title === currentTrack?.title;
    });

    const upcomingQueue = currentQueue.slice(currentTrackIndex + 1);
    const previousQueue = currentQueue.splice(0, currentTrackIndex);

    const previousTrackIndexArray =
      currentTrackIndex > 0
        ? Array.from({length: currentTrackIndex}, (_, i) => i)
        : [];

    const remainingQueue = [...upcomingQueue, ...previousQueue];

    for (let i = remainingQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = remainingQueue[i];
      remainingQueue[i] = remainingQueue[j];
      remainingQueue[j] = temp;
    }

    await TrackPlayer.remove(previousTrackIndexArray);
    await TrackPlayer.removeUpcomingTracks();
    await TrackPlayer.add(remainingQueue);
    // await TrackPlayer.play();
  };

  const togglePlayingMode = async () => {
    if (playbackState.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleNextTrack = async () => {
    await TrackPlayer.skipToNext();
    await TrackPlayer.play();
  };

  const handlePrevTrack = async () => {
    await TrackPlayer.skipToPrevious();
    await TrackPlayer.play();
  };

  const contextValue: TrackContextType = {
    trackLists,
    setTrackLists,
    playingTrackLists,
    setPlayingTrackLists,
    handlePlay,
    togglePlayingMode,
    repeatIcon,
    changeRepeatMode,
    handleNextTrack,
    handlePrevTrack,
    currentTrack,
    setRepeatMode,
    repeatMode,
    getCurrentQueue,
    getActiveTrack,
    onDownloadPress,
    onAlreadyDownloadPress,
    setDownloadingTrackIds,
    setDownloading,
    isAlreadyDownload,
    setAlreadyDownload,
    isDownloading,
    loading,
    setLoading,
    isModalVisible,
    setModalVisible,
    deleteTrackById,
    downloadProgress,
    selectedFolder,
    setSelectedFolder,
    loadFolders,
    createFolder,
    deleteFolder,
    folders,
  };

  return (
    <TrackContext.Provider value={contextValue}>
      {children}
    </TrackContext.Provider>
  );
};

export const useTrackContext = () => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error('useTrackContext must be used within a TrackProvider');
  }
  return context;
};
