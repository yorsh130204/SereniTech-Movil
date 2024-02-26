//CuentaScreen.js
import React, { useState, useEffect } from 'react';
import { Text, Platform, RefreshControl, StyleSheet } from 'react-native';
import { updateProfile, updatePassword, deleteUser, signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { ref, get, set } from 'firebase/database';
import { Image, Input, VStack, Button, Pressable, ScrollView, KeyboardAvoidingView, Modal, View, ChevronRightIcon, HStack, CloseIcon } from 'native-base';
import profileImage from '../assets/img/users.png';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Translate from './LanguageSwitcher';

const AccountSection = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalColor, setModalColor] = useState('');

  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    // Cargar el nombre actual cuando el componente se monta
    loadCurrentName();
  }, [refreshing]);

  const loadCurrentName = async () => {
    try {
      const userSnapshot = await get(ref(FIREBASE_DB, `users/${currentUser.uid}`));
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        setCurrentName(userData.name);
        setCurrentEmail(userData.email);
      }
    } catch (error) {
      console.error('Error al cargar el nombre actual:', error.message);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    color: '',
    title: '',
    message: '',
  });

  const showAlert = (status, title, message) => {
    let color;
  
    switch (status) {
      case 'error':
        color = '#ef4444';
        break;
      case 'success':
        color = '#6fc1d2';
        break;
      // Otros casos según sea necesario
  
      default:
        color = ''; // Color por defecto o vacío
    }
  
    setModalContent({ status, title, message });
    setModalColor(color);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleUpdateName = async () => {
    if (!newName) {
      showAlert('error', t("account.error"), t("account.newNameError"));
      return;
    }

    try {
      // Obtener la información actual del usuario desde la base de datos
      const userSnapshot = await get(ref(FIREBASE_DB, `users/${currentUser.uid}`));
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();

        // Actualizar solo el nombre en el auth
        await updateProfile(currentUser, { displayName: newName });

        // Actualizar el nombre en la base de datos manteniendo el uid y el email
        await set(ref(FIREBASE_DB, `users/${currentUser.uid}`), {
          ...userData,  // Mantener la información existente
          name: newName, // Actualizar solo el nombre
        });
      }

      setRefreshing(true);
      showAlert('success', t("account.success"), t("account.updateNameSuccess"));
      setNewName('');
    } catch (error) {
      showAlert('error', t("account.error"), t("account.updateNameError") + error.message);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showAlert('error', t("account.error"), t("account.newPasswordError"));
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('error', t("account.error"), t("account.passwordMismatchError"));
      return;
    }

    try {
      await updatePassword(currentUser, newPassword);
      showAlert('success', t("account.success"), t("account.updatePasswordSuccess"));
      setNewPassword('');
      setRefreshing(true);
    } catch (error) {
      showAlert('error', t("account.error"), t("account.updatePasswordError") + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmationText || confirmationText.trim() !== t("account.deleteAccount")) {
      showAlert('error', t("account.error"), t("account.confirmationTextError"));
      return;
    }

    try {
      await deleteUser(currentUser);
      showAlert('success', t("account.success"), 'Cuenta eliminada exitosamente.');
      navigation.navigate('Home');
    } catch (error) {
      showAlert('error', t("account.error"), 'Error al eliminar la cuenta: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      showAlert('success', t("account.success"), 'Cierre de sesión exitoso.');
      navigation.navigate('Home');
    } catch (error) {
      showAlert('error', t("account.error"), 'Error al cerrar sesión: ' + error.message);
    }
  };

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
          <VStack space={4} p={4} bg="#edf3f2" rounded="lg" shadow={4} alignItems="center">
            {profileImage && (
              <Image
                source={profileImage}
                alt="Profile Image"
                style={{ width: 100, height: 100, borderWidth: 2, borderColor: '#10699b', borderRadius: 50 }}
                className="mt-6 mb-2"
              />
            )}
            <View className="flex items-center mb-4">
              <Text className="mb-1 text-3xl font-bold">
                {currentName}
              </Text>
              <Text className="mb-2 text-xl text-gray-500">
                {currentEmail}
              </Text>
            </View>

            {editingProfile ? (
            <>
            <View className="flex items-center mb-2">
              <Input
                placeholder= {t("account.nameTitle")}
                value={newName}
                onChangeText={(text) => setNewName(text)}
                bg="white"
                rounded={0}
                borderWidth={0}
                borderBottomWidth={1}
                borderColor="gray.400"
                p={3}
                mb={2}
                fontFamily="Inter-Regular"
                fontSize={15}
              />
              <Button
                onPress={handleUpdateName}
                bg="#6fc1d2"
                _pressed={{ bg: '#7da09c' }}
                isDisabled={!newName}
                style={{ fontSize: 20, marginBottom: 10 }} // Ajusta el tamaño de la fuente y el margen inferior
              >
                {t("account.updateName")}
              </Button>
            </View>
            <View className="flex items-center mb-2">
              <Input
                placeholder={t("account.passwordTitle")}
                secureTextEntry
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                bg="white"
                rounded={0}
                borderWidth={0}
                borderBottomWidth={1}
                borderColor="gray.400"
                p={3}
                mb={2}
                fontFamily="Inter-Regular"
                fontSize={15}
              />
              <Input
                placeholder={t("account.confirmPasswordTitle")}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                bg="white"
                rounded={0}
                borderWidth={0}
                borderBottomWidth={1}
                borderColor="gray.400"
                p={3}
                mb={2}
                fontFamily="Inter-Regular"
                fontSize={15}
              />
              <Button
                onPress={handleUpdatePassword}
                bg="#6fc1d2"
                _pressed={{ bg: '#7da09c' }}
                isDisabled={!newPassword || !confirmPassword}
                style={{ fontSize: 20, marginBottom: 10 }}
              >
                {t("account.updatePassword")}
              </Button>
            </View>
            <View className="flex items-center mb-2">
              <Input
                placeholder={t("account.confirmDelete")}
                value={confirmationText}
                onChangeText={(text) => setConfirmationText(text)}
                bg="white"
                rounded={0}
                borderWidth={0}
                borderBottomWidth={1}
                borderColor="gray.400"
                p={3}
                mb={2}
                fontFamily="Inter-Regular"
                fontSize={15}
              />
              <Button
                onPress={handleDeleteAccount}
                bg="#ef4444"
                _pressed={{ bg: '#7da09c' }}
                isDisabled={!confirmationText}
                style={{ fontSize: 20 }}
              >
                {t("account.deleteAccount")}
              </Button>
            </View>
            </>
            ) : (
              <Button
                onPress={() => setEditingProfile(true)}
                className="bg-[#10699b] rounded-3xl pl-6 pr-6 hover:bg-gray-600"
              >
                <HStack space={2} alignItems="center">
                  <Text className="text-white text-lg mr-2">{t("account.editProfile")}</Text>
                  <ChevronRightIcon color="white" />
                </HStack>
              </Button>
            )}

            {/* Logout */}
            <Pressable 
              onPress={handleLogout} 
              marginTop={2}
              className="pl-5 pr-5 py-2.5 bg-[#ef4444] rounded-3xl transition duration-300 hover:bg-gray-600 mt-5 mb-6"
            >
            <HStack space={2} alignItems="center">
              <Text className="text-white text-lg mr-2">{t("account.logout")}</Text>
              <CloseIcon color="white" />
            </HStack>
            </Pressable>
          </VStack>

          {/* Modal para mostrar alertas */}
          <Modal isOpen={modalVisible} onClose={closeModal}>
            <Modal.Content>
              <Modal.CloseButton style={{ backgroundColor: "white", color: "blue" }} className="mt-1" />
              <Modal.Header bg={modalColor}>
                <Text style={{ color: 'white', fontSize: 28 }}>{modalContent.title}</Text>
              </Modal.Header>
              <Modal.Body bg={modalColor}>
                <Text style={{ color: 'white', fontSize: 19, textAlign: 'center' }}>{modalContent.message}</Text>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.translateContainer}>
        <Translate />
      </View>
    </View>
  );
};

export default AccountSection;

const styles = StyleSheet.create({
  translateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});