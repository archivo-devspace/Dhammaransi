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
  usePlaybackState,
} from 'react-native-track-player';
import {tracks} from '../utils/constants';
import {useNavigation} from '@react-navigation/native';

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
  handleShuffleTracks: () => void;
  handleRepeatTracks: () => void;
  handleRepeatTrack: () => void;
  repeatIcon: () => 'repeat' | 'repeat-off' | 'repeat-once' | undefined;
  changeRepeatMode: () => void;
  handlePlay: (trackId: number) => void;
  togglePlayingMode: () => void;
  playingIcon: () => any;
  handleNextTrack: () => void;
  handlePrevTrack: () => void;
  currentTrack: any;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const TrackProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [trackLists, setTrackLists] = useState<Array<TrackProps>>([]);
  const [playingTrackLists, setPlayingTrackLists] = useState<Array<TrackProps>>(
    [],
  );

  const [currentTrack, setCurrentTrack] = useState<any>(null);

  const playbackState = usePlaybackState();
  const [repeatMode, setRepeatMode] = useState('off');

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
      if (current) {
        setPlayingTrackLists(current);
      } else {
        console.error('No track found to play.');
        return;
      }
    },
    [trackLists],
  );

  useEffect(() => {
    const playTrack = async () => {
      await TrackPlayer.reset();
      console.log('after reset');
      await TrackPlayer.add(playingTrackLists);
      console.log('after add');
      console.log('playingTrackLists', playingTrackLists);
      await TrackPlayer.play();
    };

    if (playingTrackLists.length > 0) {
      playTrack();
    }
  }, [playingTrackLists]);

  useEffect(() => {
    const getCurrentTrack = async () => {
      const current = await TrackPlayer.getActiveTrack();
      current && setCurrentTrack(current);
    };

    getCurrentTrack();
  }, [playbackState]);

  const repeatIcon = () => {
    if (repeatMode === 'off') {
      return 'repeat-off';
    }
    if (repeatMode === 'track') {
      return 'repeat-once';
    }
    if (repeatMode === 'repeat') {
      return 'repeat';
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode === 'off') {
      setRepeatMode('track');
    }
    if (repeatMode === 'track') {
      setRepeatMode('repeat');
    }
    if (repeatMode === 'repeat') {
      handleShuffleTracks();
      setRepeatMode('off');
    }
  };

  const playingIcon = () => {
    if (playbackState.state === State.Playing) {
      return 'controller-paus';
    }
    return 'controller-play';
  };

  const handleShuffleTracks = () => {
    const shuffledTracks = [...trackLists]; // Create a copy of the original array
    for (let i = shuffledTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate random index
      [shuffledTracks[i], shuffledTracks[j]] = [
        shuffledTracks[j],
        shuffledTracks[i],
      ]; // Swap elements
    }
    return shuffledTracks;
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
    handleShuffleTracks,
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
