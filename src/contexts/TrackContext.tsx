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
  fetchDownloadedDataFromLocalDir,
  sendDownloadedDataToLocalDir,
} from '../api_services/downloadService';
import {showToast} from '../screens/TrackScreen';
import {DeviceEventEmitter} from 'react-native';

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

  // useLayoutEffect(() => {
  //   const getAllTracks = () => {
  //     setTrackLists(tracks);
  //   };
  //   getAllTracks();
  // }, []);

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
  }, [currentTrack, downloadingTrackIds]);

  // console.log('downloading...', downloadingTrackIds);

  const deleteTrackById = async (id: any) => {
    const remainTracks = downloadingTrackIds.filter((item: any) => {
      return item !== id;
    });
    setDownloadingTrackIds(remainTracks);
  };

  const onDownloadPress = () => {
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
      );
    } else {
      setModalVisible(true); // Show the modal with current progress if already downloading
    }
  };

  const onAlreadyDownloadPress = () => {
    showToast(
      'success',
      'Already downloaded',
      'This content is already downloaded',
    );
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

    return () => {
      listener.remove();

      // setDownloadProgress(0);
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
    if (repeatMode === 'shuffle-disabled') {
      setInitialQueue(getCurrentQueue);

      setRepeatMode('shuffle');

      handleShuffleTracks();
    }
    if (repeatMode === 'shuffle') {
      setRepeatMode('track');
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
    }
    if (repeatMode === 'track') {
      setRepeatMode('repeat');
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    }
    if (repeatMode === 'repeat') {
      setRepeatMode('shuffle-disabled');

      await TrackPlayer.setRepeatMode(RepeatMode.Off);

      const activeTrack = await TrackPlayer.getActiveTrack();

      const removeActiveTrackQueue = initialQueue._j.filter(
        (track: Track) => track.title !== activeTrack?.title,
      );
      await TrackPlayer.removeUpcomingTracks();
      await TrackPlayer.add(removeActiveTrackQueue);
    }
  };

  const getCurrentQueue = async () => {
    return await TrackPlayer.getQueue();
  };

  const getActiveTrack = async () => {
    return await TrackPlayer.getActiveTrack();
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
    await TrackPlayer.play();
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
