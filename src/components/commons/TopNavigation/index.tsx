import React, {useState, useEffect} from 'react';
import {Animated, StatusBar, useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../../../theme';
import {useThemeContext} from '../../../contexts/ThemeContext';

interface TopNavigationProps {
  title: string;
  scrollA?: Animated.Value;
}

const TopNavigation: React.FC<TopNavigationProps> = ({title, scrollA}) => {
  const safeArea = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const [isTransparent, setTransparent] = useState(!!scrollA);
  const {height} = useWindowDimensions();

  const BANNER_H = height * 0.4;
  const TOPNAVI_H = height * 0.07;

  useEffect(() => {
    const handleScroll = (event: {value: number}) => {
      const topNaviOffset = BANNER_H - TOPNAVI_H - safeArea.top;
      const shouldBeTransparent = event.value < topNaviOffset;
      if (isTransparent !== shouldBeTransparent) {
        setTransparent(shouldBeTransparent);
      }
    };

    if (scrollA) {
      const listenerId = scrollA.addListener(handleScroll);
      return () => scrollA.removeListener(listenerId);
    }
  }, [scrollA, safeArea.top, isTransparent]);

  const statusBarStyle = isTransparent
    ? 'dark-content'
    : theme === 'light'
    ? 'dark-content'
    : 'light-content';
  const statusBarBackgroundColor = isTransparent
    ? 'transparent'
    : Colors[theme].secondary;

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        translucent
        backgroundColor={statusBarBackgroundColor}
      />
    </>
  );
};

export default TopNavigation;
