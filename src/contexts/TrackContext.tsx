import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import TrackPlayer, {
  Capability,
  State,
  Track,
  usePlaybackState,
} from 'react-native-track-player';
import {tracks} from '../utils/constants';

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
  handleRepeatTracks: () => void;
  handleRepeatTrack: () => void;
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
  playingIcon: () => any;
  handleNextTrack: () => void;
  handlePrevTrack: () => void;
  currentTrack: any;
  setRepeatMode: (repeatMode: string) => void;
  repeatMode: string;
  getCurrentQueue: () => Promise<Track[]>;
}

TrackPlayer.setupPlayer();

TrackPlayer.updateOptions({
  // Media controls capabilities
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
  ],

  // Capabilities that will show up when the notification is in the compact form on Android
  compactCapabilities: [Capability.Play, Capability.Pause],
});

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const TrackProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [trackLists, setTrackLists] = useState<Array<TrackProps>>([]);
  const [playingTrackLists, setPlayingTrackLists] = useState<Array<TrackProps>>(
    [],
  );

  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const playbackState = usePlaybackState();
  const [repeatMode, setRepeatMode] = useState('shuffle-disabled');

  useLayoutEffect(() => {
    const getAllTracks = () => {
      setTrackLists(tracks);
    };
    getAllTracks();
  }, []);

  const handlePlay = useCallback(
    async (trackId: number) => {
      const playingTrack = trackLists?.find(track => track.id === trackId);

      const remainingTracks = trackLists?.filter(track => track.id !== trackId);
      const current = playingTrack && [playingTrack, ...remainingTracks];
      const activeTrack = await TrackPlayer.getActiveTrack();
      if (current) {
        // setPlayingTrackLists(current);
        if (playingTrack.id !== activeTrack?.id) {
          await TrackPlayer.reset();
        }
        await TrackPlayer.add(current);
        await TrackPlayer.play();
        if (repeatMode === 'shuffle') {
          console.log('Playing');
          handleShuffleTracks();
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

  const changeRepeatMode = () => {
    if (repeatMode === 'shuffle-disabled') {
      setRepeatMode('shuffle');
      handleShuffleTracks();
    }
    if (repeatMode === 'shuffle') {
      setRepeatMode('track');
    }
    if (repeatMode === 'track') {
      setRepeatMode('repeat');
    }
    if (repeatMode === 'repeat') {
      setRepeatMode('shuffle-disabled');
    }
  };

  const playingIcon = () => {
    if (playbackState.state === State.Playing) {
      return 'controller-paus';
    }
    return 'controller-play';
  };

  const getCurrentQueue = async () => {
    return await TrackPlayer.getQueue();
  };

  const handleShuffleTracks = async () => {
    const currentQueue = await getCurrentQueue();
    console.log('currentQueue', currentQueue);
    for (let i = currentQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = currentQueue[i];
      currentQueue[i] = currentQueue[j];
      currentQueue[j] = temp;
    }
    const newQueue = [...currentQueue];
    console.log('newQueue', newQueue);

    await TrackPlayer.removeUpcomingTracks();
    await TrackPlayer.add(newQueue);
    await TrackPlayer.play();
  };

  const togglePlayingMode = async () => {
    if (playbackState.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleRepeatTracks = () => {};

  const handleRepeatTrack = () => {};

  const handleNextTrack = async () => {
    await TrackPlayer.skipToNext();
  };

  const handlePrevTrack = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const contextValue: TrackContextType = {
    trackLists,
    setTrackLists,
    playingTrackLists,
    setPlayingTrackLists,
    handleRepeatTrack,
    handleRepeatTracks,
    handlePlay,
    togglePlayingMode,
    repeatIcon,
    changeRepeatMode,
    playingIcon,
    handleNextTrack,
    handlePrevTrack,
    currentTrack,
    setRepeatMode,
    repeatMode,
    getCurrentQueue,
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
