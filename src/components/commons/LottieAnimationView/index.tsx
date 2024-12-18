import LottieView from 'lottie-react-native'
import React from 'react'
import { Platform, StyleSheet, useWindowDimensions, Vibration, View } from 'react-native'
import { CustomButton } from '../../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme, useThemeContext } from '../../../contexts/ThemeContext';
import { Colors } from '../../../theme';
import { networkError } from '../../../utils/constants';

type Props = {
    handlePress: () => void;
    lottieFiePath : string;
    btnType: "refresh" | "back"
}

const LottieAnimationView = ({ handlePress,lottieFiePath,btnType }: Props) => {
    const { height, width } = useWindowDimensions();
    const { theme } = useThemeContext();
    const styles = styling(theme);


    const onPressControl = () => {
        Vibration.vibrate(5);
        handlePress();
    }

    return (
        <View style={{ height: height * 0.6, width: width, justifyContent: "flex-end", alignItems: "center", paddingBottom: 10 }}>
            <LottieView
                style={{ width: width, height: 400 }}
                source={lottieFiePath}
                autoPlay={true}
                loop
                resizeMode={'contain'}
            />
            <View style={{ alignSelf: 'center' }}>
                <CustomButton
                    onPress={onPressControl}
                    icon={
                        <Ionicons
                            name={btnType === "refresh" ? "reload-circle-sharp": "return-down-back-outline"}
                            size={30}
                            color={Colors[theme].primary_light}
                        />
                    }

                    customButtonStyle={[styles.reloadBtn]}
                />
            </View>
        </View>
    )
}

export default LottieAnimationView

const styling = (theme: Theme) =>
    StyleSheet.create({
        reloadBtn: {
            alignSelf: 'flex-end',
            paddingHorizontal: 50,
            backgroundColor: Colors[theme].secondary,
            paddingVertical: 10,
            shadowColor: Colors[theme].text,
            borderRadius: 20,
            ...Platform.select({
                ios: {
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 4,
                },
            }),
        },
    })