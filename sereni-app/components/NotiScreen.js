// NotiScreen.js
import React, { useState, useEffect } from 'react';
import { Text, Platform, RefreshControl, StyleSheet } from 'react-native';
import { updateProfile, updatePassword, deleteUser, signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { ref, get, set } from 'firebase/database';
import { Image, Input, VStack, Button, Pressable, ScrollView, KeyboardAvoidingView, Modal, View, ChevronRightIcon, HStack, CloseIcon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Translate from './LanguageSwitcher';

const NotiScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
  }, [refreshing]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Realizar operaciones de carga de datos o actualización aquí
    await loadCurrentName(); // Puedes adaptar esto según tus necesidades
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View className="flex-1 justify-between">
            <Text className="items-center">Contenido de noti</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.translateContainer}>
        <Translate />
      </View>
    </View>
  );
};

export default NotiScreen;

const styles = StyleSheet.create({
  translateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});
