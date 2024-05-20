// import React, {useState, useEffect} from 'react';
// import {Animated, StatusBar, useWindowDimensions} from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {Colors} from '../../../theme';
// import {useThemeContext} from '../../../contexts/ThemeContext';

// interface TopNavigationProps {
//   title: string;
//   scrollA?: Animated.Value;
// }

// const TopNavigation: React.FC<TopNavigationProps> = ({title, scrollA}) => {
//   const safeArea = useSafeAreaInsets();
//   const {theme} = useThemeContext();
//   const [isTransparent, setTransparent] = useState(!!scrollA);
//   const {height} = useWindowDimensions();

//   const BANNER_H = height * 0.4;
//   const TOPNAVI_H = height * 0.07;

//   useEffect(() => {
//     const handleScroll = (event: {value: number}) => {
//       const topNaviOffset = BANNER_H - TOPNAVI_H - safeArea.top;
//       const shouldBeTransparent = event.value < topNaviOffset;
//       if (isTransparent !== shouldBeTransparent) {
//         setTransparent(shouldBeTransparent);
//       }
//     };

//     if (scrollA) {
//       const listenerId = scrollA.addListener(handleScroll);
//       return () => scrollA.removeListener(listenerId);
//     }
//   }, [scrollA, safeArea.top, isTransparent]);

//   const statusBarStyle = isTransparent
//     ? 'dark-content'
//     : theme === 'light'
//     ? 'dark-content'
//     : 'light-content';
//   const statusBarBackgroundColor = isTransparent
//     ? 'transparent'
//     : Colors[theme].secondary;

//   return (
//     <>
//       <StatusBar
//         barStyle={statusBarStyle}
//         translucent
//         backgroundColor={statusBarBackgroundColor}
//       />
//     </>
//   );
// };

// export default TopNavigation;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import {TOPNAVI_H} from '../../../utils/constants';
import {Colors} from '../../../theme';
import {Theme, useThemeContext} from '../../../contexts/ThemeContext';

const TopNavigation = (props: any) => {
  const safeArea = useSafeArea();
  const {height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const {title, scrollA} = props;
  const BANNER_H = height * 0.4;
  const isFloating = !!scrollA;
  const [isTransparent, setTransparent] = useState(isFloating);

  useEffect(() => {
    if (!scrollA) {
      return;
    }
    const listenerId = scrollA.addListener((a: any) => {
      const topNaviOffset =
        BANNER_H - TOPNAVI_H - safeArea.top - (TOPNAVI_H + safeArea.top + 10);
      isTransparent !== a.value < topNaviOffset &&
        setTransparent(!isTransparent);
    });
    return () => scrollA.removeListener(listenerId);
  });

  const styles = styling(theme, safeArea, isFloating, isTransparent);

  return (
    <>
      <StatusBar
        barStyle={isTransparent ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </>
  );
};

const styling = (
  theme: Theme,
  safeArea: any,
  isFloating: any,
  isTransparent: any,
) =>
  StyleSheet.create({
    container: {
      paddingTop: safeArea.top,
      marginBottom: isFloating ? -TOPNAVI_H - safeArea.top : 0,
      height: TOPNAVI_H + safeArea.top,
      justifyContent: 'center',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomColor: isTransparent
        ? 'transparent'
        : Colors[theme].secondary_dark,
      borderLeftColor: isTransparent
        ? 'transparent'
        : Colors[theme].secondary_dark,
      borderRightColor: isTransparent
        ? 'transparent'
        : Colors[theme].secondary_dark,
      borderWidth: 1,
      backgroundColor: isTransparent ? '#0001' : Colors[theme].secondary,
      shadowOpacity: isTransparent ? 0 : 0.5,
      elevation: isTransparent ? 0.05 : 5,
      zIndex: 100,
    },
    title: {
      textAlign: 'center',
      fontWeight: '500',
      fontSize: 18,
      paddingHorizontal: 20,
      lineHeight: 24,
      color: isTransparent ? '#FFF' : Colors[theme].text,
    },
  });

export default TopNavigation;
