// LanguageSwitcher.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import i18next, { languageResources } from '../services/i18next';
import languageList from '../services/languagesList.json';
import { Feather } from '@expo/vector-icons';

const Translate = () => {
  const [visible, setVisible] = useState(false);
  const slideUpValue = useRef(new Animated.Value(300)).current;
  const [buttonVisible, setButtonVisible] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language);

  const handleLanguageSelect = (languageKey) => {
    i18next.changeLanguage(languageKey);
    setSelectedLanguage(languageKey);
    hideModal();
  };

  const showModal = () => {
    setButtonVisible(false);
    setVisible(true);
    Animated.timing(slideUpValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideUpValue, {
      toValue: 300,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setVisible(false);
      setButtonVisible(true);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={hideModal}>
      <View style={{ flex: 1, justifyContent: 'flex-end', padding: 20, position: 'relative', backgroundColor: "transparent" }}>
        {buttonVisible && (
          <TouchableOpacity
            style={styles.changeLanguageButton}
            className="bg-gray-300 rounded-full hover:bg-gray-400 transition duration-300"
            onPress={visible ? hideModal : showModal}
          >
            <Feather name="globe" size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
        )}
        <Animated.View
          style={[
            styles.modalBackground,
            {
              transform: [{ translateY: slideUpValue }],
              zIndex: visible ? 1 : -1,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={hideModal}
          >
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.modalContent}>
            <FlatList
              data={Object.keys(languageResources)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleLanguageSelect(item)}
                  style={[
                    styles.languageItem,
                    item === selectedLanguage ? styles.selectedLanguageItem : null,
                  ]}
                >
                  <Feather name="chevron-right" size={20} color="#007BFF" style={styles.languageIcon} />
                  <Text
                    style={[
                      styles.languageText,
                      item === selectedLanguage ? styles.selectedLanguageText : null,
                    ]}
                  >
                    {languageList[item].nativeName}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    elevation: 10,
  },
  modalContent: {
    padding: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  languageText: {
    fontSize: 22,
    color: '#333',
    marginLeft: 10,
  },
  selectedLanguageItem: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  selectedLanguageText: {
    color: 'white',
  },
  languageIcon: {
    marginRight: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  changeLanguageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 10,
    left: 10,
    borderRadius: 25,
    zIndex: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 2,
  },
});

export default Translate;
