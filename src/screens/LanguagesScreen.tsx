import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageScreen = (navigation: any) => {
  const {t} = useTranslation();
  const languages = [
    {label: 'English', value: 'en'},
    {label: 'Myanmar', value: 'mm'},

    // Add more languages as needed
  ];
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
    '',
  );

  const saveData = async () => {
    try {
      i18next.changeLanguage(selectedLanguage); // it will change the language through out the app.
      await AsyncStorage.setItem('LANGUAGE', selectedLanguage as string);
      console.log('saved');
    } catch {
      console.log('err in saving data');
    }
  };

  return (
    <View style={styles.lang}>
      <Text style={styles.sTitle1}> {t('LANGUAGE')}</Text>
      <Text style={styles.sTitle2}>{t('SELECT')} </Text>

      <FlatList
        data={languages}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedLanguage(item.value);
            }}
            style={
              selectedLanguage === item.value
                ? styles.selectedLanguage
                : styles.language
            }>
            <Text
              style={
                selectedLanguage === item.value
                  ? styles.selectedText
                  : styles.text
              }>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.btns}>
        <TouchableOpacity
          style={{
            width: 143,
            height: 48,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#FF5757',
            borderStyle: 'solid',
          }}>
          <Text
            style={{
              fontFamily: 'Manrope',
              fontStyle: 'normal',

              color: '#FF5757',
            }}>
            {t('CANCEL')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={saveData}
          style={{
            width: 150,
            height: 48,
            borderWidth: 0.5,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#2352D8',
          }}>
          <Text
            style={{
              color: '#F7F9FA',
              fontFamily: 'Manrope',
              fontStyle: 'normal',
            }}>
            {t('SAVE')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lang: {
    width: 365,
    left: 20,
    backgroundColor: '#FFFFFF',

    top: 40,
    bottom: 466,
    // border: 1px solid #E9EDF2;
    borderWidth: 1,
    borderColor: '#E9EDF2',
    borderRadius: 16,
    borderStyle: 'solid',
  },
  sTitle1: {
    paddingTop: 34,
    fontFamily: 'Manrope',
    fontStyle: 'normal',

    paddingLeft: 30,
    fontSize: 14,
    color: '#A8B4BF',
  },
  sTitle2: {
    paddingTop: 20,
    paddingBottom: 20,
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    paddingLeft: 30,
    fontSize: 12,

    color: '#576573',
  },
  languageItem: {
    height: 50,

    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
  },
  texts: {
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    color: '#576573',

    fontSize: 14,
  },
  icon: {
    width: 24,
    height: 24,
  },
  btns: {
    flexDirection: 'row',

    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  language: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedLanguage: {
    padding: 10,
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 14,
    color: '#576573',
  },
  selectedText: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default LanguageScreen;
