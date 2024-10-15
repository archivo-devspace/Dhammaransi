import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Theme, useThemeContext } from '../../../contexts/ThemeContext';
import { Colors } from '../../../theme';
import Animated, {
  AnimatedProps,
  AnimatedScrollViewProps,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import BackDrop from '../BackDrop';
import { CustomButton } from '../../utils';
import { AntDesign, Entypo, getFontFamily, Ionicons } from '../../../utils/common';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native';
import { useTrackContext } from '../../../contexts/TrackContext';

interface Props extends AnimatedProps<AnimatedScrollViewProps> {
  snapTo: string;
  backGroundColor: string;
  children?: ReactNode;
}

export interface FolderListsBottomSheetMethods {
  expand: () => void;
  close: () => void;
}

const FolderListsBottomSheet = forwardRef<FolderListsBottomSheetMethods, Props>(
  ({ snapTo, children, backGroundColor, ...rest }: Props, ref) => {
    const { theme } = useThemeContext();
    const {
      onDownloadPress,
      selectedFolder,
      setSelectedFolder,
      loadFolders,
      createFolder,
      folders,
    } = useTrackContext();
    const styles = styling(theme);

    const [folderName, setFolderName] = useState('');
    const [isDownloadReady, setIsDownloadReady] = useState(false);
    // const [folders, setFolders] = useState<string[]>([]);
    // const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

    const { height } = Dimensions.get('screen');
    const closeHeight = height;

    const percentage = parseFloat(snapTo.replace('%', '')) / 100;
    const openHeight = height - height * percentage;
    const topAnimation = useSharedValue(closeHeight);
    const context = useSharedValue(0);
    const scrollBegin = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const [enableScroll, setEnableScroll] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
      loadFolders();
    }, []);

    const expand = useCallback(() => {
      'worklet';
      topAnimation.value = withTiming(openHeight);
    }, [openHeight, topAnimation]);

    const close = useCallback(() => {
      'worklet';
      topAnimation.value = withTiming(closeHeight);
    }, [openHeight, topAnimation]);

    useImperativeHandle(
      ref,
      () => ({
        expand,
        close,
      }),
      [expand, close],
    );

    const animationStyle = useAnimatedStyle(() => {
      const top = topAnimation.value;

      // Make it invisible when closed
      const opacity = top === closeHeight ? 0 : 1;
      const pointerEvents = top === closeHeight ? 'none' : 'auto';

      return {
        top,
        opacity,
        pointerEvents,
      };
    });

    const pan = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate(event => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(event.translationY + context.value, {
            damping: 100,
            stiffness: 400,
          });
        }
      })
      .onEnd(() => {
        if (topAnimation.value > openHeight + 50) {
          topAnimation.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    const onScroll = useAnimatedScrollHandler({
      onBeginDrag: event => {
        scrollBegin.value = event.contentOffset.y;
      },
      onScroll: event => {
        scrollY.value = event.contentOffset.y;
      },
    });

    const panScroll = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate(event => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else if (event.translationY > 0 && scrollY.value === 0) {
          runOnJS(setEnableScroll)(false);
          topAnimation.value = withSpring(
            Math.max(
              context.value + event.translationY - scrollBegin.value,
              openHeight,
            ),
            {
              damping: 100,
              stiffness: 400,
            },
          );
        }
      })
      .onEnd(() => {
        runOnJS(setEnableScroll)(true);
        if (topAnimation.value > openHeight + 100) {
          topAnimation.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    const scrollViewGesture = Gesture.Native();

    const handleCreateFolder = async () => {
      await createFolder(folderName);
      setFolderName('');
    };

    const download = async (item: string) => {
      const folderName = item.split('/').pop();
      if (folderName) {
        setSelectedFolder(folderName);
        setIsDownloadReady(true);
      }
    };

    useEffect(() => {
      if (isDownloadReady) {
        onDownloadPress();
        close();
        setIsDownloadReady(false); // Reset the state
      }
    }, [isDownloadReady]);

    return (
      <>
        <BackDrop
          topAnimation={topAnimation}
          openHeight={openHeight}
          closeHeight={closeHeight}
          close={close}
        />
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.continer,
              animationStyle,
              { backgroundColor: backGroundColor },
            ]}>
            <View style={styles.lineContainer}>
              <Text style={styles.playlists}>
                {t('UTILS.DOWNLOAD_MANAGED')}
              </Text>

              <CustomButton customButtonStyle={styles.icon} onPress={close}>
                <Entypo
                  name="circle-with-cross"
                  size={25}
                  color={Colors[theme].black}
                />
              </CustomButton>
            </View>
            <View style={styles.container}>
              <TextInput
                style={styles.input}
                value={folderName}
                onChangeText={setFolderName}
                placeholder={t('UTILS.FOLDER_NAME')}
                placeholderTextColor={Colors[theme].text}
              />
              <CustomButton
                customButtonStyle={styles.createButton}
                customButtonTextStyle={styles.textButton}
                title={t('UTILS.CREATE')}
                onPress={handleCreateFolder}
                icon={
                  <Ionicons
                    name="save"
                    size={20}
                    color={Colors[theme].black}
                  />
                }
                gap={10}
              />
            </View>
            <GestureDetector
              gesture={Gesture.Simultaneous(scrollViewGesture, panScroll)}>
              <Animated.ScrollView
                scrollEnabled={enableScroll}
                bounces={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={onScroll}>
                <View style={styles.container}>
                  <View style={styles.folderList}>
                    {folders.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => download(item)}>
                        <Text style={styles.folderItem}>
                          {item.split('/').pop()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Animated.ScrollView>
            </GestureDetector>
          </Animated.View>
        </GestureDetector>
      </>
    );
  },
);

export default FolderListsBottomSheet;

const styling = (theme: Theme) =>
  StyleSheet.create({
    continer: {
      ...StyleSheet.absoluteFillObject,

      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: 'green',
      zIndex: 100,
      paddingBottom: 4,
      borderColor: Colors[theme].secondary_dark,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
    },
    lineContainer: {
      justifyContent: 'center',
      paddingVertical: 14,
      flexDirection: 'row',
    },
    line: {
      borderBottomWidth: 1,
      borderColor: Colors[theme].secondary,
    },
    playlists: {
      color: Colors[theme].text,
      fontSize: 20,
      fontFamily: getFontFamily('bold'),
    },
    icon: {
      backgroundColor: Colors[theme].primary,
      alignSelf: 'center',
      borderRadius: 30,
      padding: 4,
      position: 'absolute',
      right: 16,
    },
    container: {
      justifyContent: 'center',
      padding: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: Colors[theme].text,
    },
    input: {
      height: 50,
      fontFamily: getFontFamily('regular'),
      borderColor: Colors[theme].primary,
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 8,
      color: Colors[theme].text
    },
    folderList: {
      marginTop: 5,
      gap: 5,
    },
    folderItem: {
      padding: 16,
      backgroundColor: Colors[theme].secondary_light,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
      color: Colors[theme].text,
      marginBottom: 8,
      borderRadius: 4,
      fontSize: 16,
      fontFamily: getFontFamily('regular'),
    },
    createButton: {
      backgroundColor: Colors[theme].primary,
      alignSelf: 'center',
      borderRadius: 5,
      padding: 10,
      width: '100%',
    },
    textButton: {
      fontSize: 18,
      fontFamily: getFontFamily('bold'),
      color: Colors[theme].black,
    },
  });
