/* eslint-disable react-hooks/exhaustive-deps */
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
import {DeviceEventEmitter, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {
  createChannel,
  displayNotification,
} from '../api_services/notificationService';
import CustomAlert from '../components/commons/CustomAlert';

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
  pdfDownloading: Record<number, boolean>;
  startPdfDownload: (id: number) => void;
  finishPdfDownload: (id: number) => void;
  pdfDownlaodProgress: Record<number, number>;
  setPdfDownloadForProgress: (id: number, progress: number) => void;
  getTrackDuration: (progressed: any) => string;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const TrackProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [trackLists, setTrackLists] = useState<Array<TrackProps>>([]);
  const [playingTrackLists, setPlayingTrackLists] = useState<Array<TrackProps>>(
    [],
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAlreadyDownload, setAlreadyDownload] = useState(true);
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

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alerType, setAlertType] = useState<
    'success' | 'warning' | 'error' | null
  >(null);

  const [pdfDownloading, setPdfDownloading] = useState<Record<number, boolean>>(
    {},
  );
  const [pdfDownlaodProgress, setPdfDownloadProgress] = useState<
    Record<number, number>
  >({});

  // useLayoutEffect(() => {
  //   const getAllTracks = () => {
  //     setTrackLists(tracks);
  //   };
  //   getAllTracks();
  // }, []);

  const loadFolders = async () => {
    const {dirs} = ReactNativeBlobUtil.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
    const path = `${dirToSave}/downloads`;
    const defaultFolderPath = `${dirToSave}/downloads/Downloads`;

    try {
      const exists = await ReactNativeBlobUtil.fs.isDir(path);
      if (!exists) {
        await ReactNativeBlobUtil.fs.mkdir(path);
        await ReactNativeBlobUtil.fs.mkdir(defaultFolderPath);
      }
      const files = await ReactNativeBlobUtil.fs.ls(path);
      const directories = await Promise.all(
        files.map(async file => {
          const fullPath = `${path}/${file}`;
          const isDir = await ReactNativeBlobUtil.fs.isDir(fullPath);
          return isDir ? file : null;
        }),
      );
      setFolders(directories.filter(Boolean) as string[]);
    } catch (error) {
      setAlertTitle('Error');
      setAlertMessage('Failed to load folders!');
      setAlertType('error');
      setIsAlertVisible(true);
      // Alert.alert('Error', 'Failed to load folders!');
    }
  };

  const createFolder = async (folderName: string) => {
    if (!folderName) {
      setAlertTitle('Warnning');
      setAlertMessage('Folder name cannot be empty!');
      setAlertType('warning');
      setIsAlertVisible(true);
      return;
    }

    const {dirs} = ReactNativeBlobUtil.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
    const folderPath = `${dirToSave}/downloads/${folderName}`;

    try {
      const exists = await ReactNativeBlobUtil.fs.isDir(folderPath);
      if (!exists) {
        await ReactNativeBlobUtil.fs.mkdir(folderPath);
        loadFolders();
        setAlertTitle('Success');
        setAlertMessage('Folder created successfully!');
        setAlertType('success');
        setIsAlertVisible(true); //  setFolderName('');
      } else {
        setAlertTitle('Warning');
        setAlertMessage('Folder already exists!');
        setAlertType('warning');
        setIsAlertVisible(true);
      }
    } catch (error) {
      setAlertTitle('Error');
      setAlertMessage('Failed to create folder!');
      setAlertType('error');
      setIsAlertVisible(true);
    }
  };

  const deleteFolder = async (folderName: string) => {
    const {dirs} = ReactNativeBlobUtil.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
    const folderPath = `${dirToSave}/downloads/${folderName}`;

    const jsonFile =
      Platform.OS === 'ios'
        ? `${dirs.DocumentDir}/downloads/${folderName}/file.json`
        : `${dirs.CacheDir}/downloads/${folderName}/file.json`;

    try {
      const exists = await ReactNativeBlobUtil.fs.isDir(folderPath);
      // console.log('Folder exists:', exists, 'at path:', folderPath);
      if (exists) {
        // console.log('Deleting folder:', folderPath);

        const fileExists = await ReactNativeBlobUtil.fs.exists(jsonFile);
        if (fileExists) {
          // Read and parse the JSON file
          const jsonContent = await ReactNativeBlobUtil.fs.readFile(
            jsonFile,
            'utf8',
          );
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
        await ReactNativeBlobUtil.fs.unlink(`/${folderPath}`); // Ensure this function is correctly defined
        await loadFolders(); // Reload the folder list after deletion
        // setDownloadingTrackIds([]);
        setAlertTitle('Success');
        setAlertMessage('Folder deleted successfully!');
        setAlertType('success');
        setIsAlertVisible(true);
        // Alert.alert('Success', 'Folder deleted successfully!');
      } else {
        setAlertTitle('Error');
        setAlertMessage('Folder does not exist!');
        setAlertType('error');
        setIsAlertVisible(true);
        // Alert.alert('Error', 'Folder does not exist!');
      }
    } catch (error) {
      // console.error('Failed to delete folder:', error);
      setAlertTitle('Error');
      setAlertMessage('Failed to delete folder!');
      setAlertType('error');
      setIsAlertVisible(true);
      // Alert.alert('Error', 'Failed to delete folder!');
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

  const deleteTrackById = async (id: any) => {
    const remainTracks = downloadingTrackIds.filter((item: any) => {
      return item !== id;
    });
    setDownloadingTrackIds(remainTracks);
  };

  // const onDownloadPress = async () => {
  //   const find = downloadingTrackIds.find(
  //     (element: any) => element === currentTrack.id,
  //   );

  //   if (!find) {
  //     setModalVisible(true);
  //     setDownloading(true);
  //     setDownloadingTrackIds((prevIds: any) => [...prevIds, currentTrack.id]);

  //     await sendDownloadedDataToLocalDir(
  //       err => {
  //         if (err) {
  //           setDownloading(false);
  //           setDownloadingTrackIds((prevIds: any) =>
  //             prevIds.filter((id: any) => id !== currentTrack.id),
  //           );
  //         }
  //       },
  //       currentTrack.id,
  //       currentTrack.url,
  //       currentTrack.artist,
  //       currentTrack.title,
  //       currentTrack.artwork,
  //       true,
  //       selectedFolder,
  //     );
  //     setSelectedFolder(null);
  //     setDownloading(false);
  //   } else {
  //     setModalVisible(true); // Show the modal with current progress if already downloading
  //   }
  // };

  const onDownloadPress = async () => {
    // Check if the track is currently downloading
    const find = downloadingTrackIds.find(
      (element: any) => element === currentTrack?.id,
    );

    // Check if the track is already downloaded
    const alreadyExists = await new Promise(resolve => {
      fetchDownloadedDataFromLocalDir(item => {
        const track = item?.find((obj: any) => obj?.id === currentTrack?.id);
        resolve(!!track); // Resolve the promise with true/false based on whether the track exists
      });
    });

    console.log("originalImage", currentTrack?.originalImage)
    console.log("originalUrl", currentTrack?.originalUrl)

    // If the track is not being downloaded and does not already exist, start the download
    if (!find && !alreadyExists) {
      setDownloading(true); // Set the downloading state
      setDownloadingTrackIds((prevIds: any) => [...prevIds, currentTrack?.id]); // Add the track to the downloading list

      // Start the download process
      await sendDownloadedDataToLocalDir(
        err => {
          if (err) {
            // Handle download error and remove track from downloading list
            setDownloading(false);
            setDownloadingTrackIds((prevIds: any) =>
              prevIds.filter((id: any) => id !== currentTrack?.id),
            );
          }
        },
        currentTrack?.id,
        currentTrack?.isDownloaded === true ? currentTrack?.originalUrl : currentTrack?.url,
        currentTrack?.artist,
        currentTrack?.title,
        currentTrack?.isDownloaded === true ? currentTrack?.originalArtwork :  currentTrack?.artwork,
        true, // Assuming this is for audio
        selectedFolder,
        false,
        null,
        null
      );

      // Reset states after download completes
      setSelectedFolder(null);
      setDownloading(false);
    } else {
      onAlreadyDownloadPress();
    }
  };

  const onAlreadyDownloadPress = async () => {
    const channelId = await createChannel({
      channelId: 'alreadyDownloaded',
      channelName: 'Already Downloaded',
    });

    await displayNotification({
      channelId: channelId,
      title: 'Already Downloaded !',
      body: 'This content is already downloaded.',
    });
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
        if (repeatMode == 'shuffle') {
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
    );

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

  const getTrackDuration = (progressed: any) => {
    const durationInSeconds = progressed.duration - progressed.position;

    if (durationInSeconds <= 0) {
      return '00:00';
    } else {
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);

      return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
  };

  const startPdfDownload = (id: number) => {
    setPdfDownloading(prev => ({...prev, [id]: true}));
    setPdfDownloadProgress(prev => ({...prev, [id]: 0}));
  };

  const finishPdfDownload = (id: number) => {
    setPdfDownloading(prev => ({...prev, [id]: false}));
    setPdfDownloadProgress(prev => ({...prev, [id]: 100}));
  };

  const setPdfDownloadForProgress = (id: number, progress: number) => {
    setPdfDownloadProgress(prev => ({...prev, [id]: progress}));
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
    getTrackDuration,
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
    pdfDownloading,
    startPdfDownload,
    finishPdfDownload,
    pdfDownlaodProgress,
    setPdfDownloadForProgress,
  };

  return (
    <>
      <TrackContext.Provider value={contextValue}>
        {children}
      </TrackContext.Provider>
      <CustomAlert
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
        btnText="Ok"
        type={alerType}
      />
    </>
  );
};

export const useTrackContext = () => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error('useTrackContext must be used within a TrackProvider');
  }
  return context;
};
