import {ReactNode, createContext, useContext, useEffect, useState} from 'react';
import TrackPlayer from 'react-native-track-player';
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
  getAllTracks?: () => void;
  handleShuffleTracks: () => void;
  handleRepeatTracks: () => void;
  handleRepeatTrack: () => void;
  repeatIcon: () => 'repeat' | 'repeat-off' | 'repeat-once' | undefined;
  changeRepeatMode: () => void;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const TrackProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [trackLists, setTrackLists] = useState<Array<TrackProps>>([]);
  const [repeatMode, setRepeatMode] = useState('off');

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

  const handleSetupPlayer = () => {
    TrackPlayer.add(trackLists);
  };

  const handlePlay = (trackId: number) => {
    // handle
  };

  useEffect(() => {
    const getAllTracks = () => {
      setTrackLists(tracks);
    };
    getAllTracks();
  }, []);

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

  const handleRepeatTracks = () => {};

  const handleRepeatTrack = () => {};

  const contextValue: TrackContextType = {
    trackLists,
    setTrackLists,
    handleShuffleTracks,
    handleRepeatTrack,
    handleRepeatTracks,
    repeatIcon,
    changeRepeatMode,
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
