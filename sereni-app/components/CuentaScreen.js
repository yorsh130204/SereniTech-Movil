//CuentaScreen.js
import React, { useState, useEffect } from 'react';
import { Text, Platform, RefreshControl } from 'react-native';
import { updateProfile, updatePassword, deleteUser, signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { ref, get, set } from 'firebase/database';
import { Image, Input, VStack, Button, Pressable, ScrollView, KeyboardAvoidingView, Modal } from 'native-base';
import profileImage from '../assets/img/users.png';
import { useNavigation } from '@react-navigation/native';

const AccountSection = () => {
  const navigation = useNavigation();
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      }
    } catch (error) {
      console.error('Error al cargar el nombre actual:', error.message);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    status: '',
    title: '',
    message: '',
  });

  const showAlert = (status, title, message) => {
    setModalContent({ status, title, message });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleUpdateName = async () => {
    if (!newName) {
      showAlert('error', 'Error', 'El campo de nuevo nombre no puede estar vacío.');
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
      showAlert('success', 'Éxito', 'Nombre actualizado exitosamente.');
    } catch (error) {
      showAlert('error', 'Error', 'Error al actualizar el nombre: ' + error.message);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showAlert('error', 'Error', 'Los campos de nueva contraseña y confirmación no pueden estar vacíos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('error', 'Error', 'La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    try {
      await updatePassword(currentUser, newPassword);
      showAlert('success', 'Éxito', 'Contraseña actualizada exitosamente.');
      setRefreshing(true);
    } catch (error) {
      showAlert('error', 'Error', 'Error al actualizar la contraseña: ' + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmationText || confirmationText.trim() !== 'Eliminar Cuenta') {
      showAlert('error', 'Error', 'Texto de confirmación incorrecto. Por favor, escribe "Eliminar Cuenta".');
      return;
    }

    try {
      await deleteUser(currentUser);
      showAlert('success', 'Éxito', 'Cuenta eliminada exitosamente.');
    } catch (error) {
      showAlert('error', 'Error', 'Error al eliminar la cuenta: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      showAlert('success', 'Éxito', 'Cierre de sesión exitoso.');
      navigation.navigate('Home');
    } catch (error) {
      showAlert('error', 'Error', 'Error al cerrar sesión: ' + error.message);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Realizar operaciones de carga de datos o actualización aquí
    await loadCurrentName(); // Puedes adaptar esto según tus necesidades
    setRefreshing(false);
  };

  return (
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
              style={{ width: 100, height: 100, borderWidth: 2, borderColor: '#10699b', borderRadius: 50, marginBottom: 10}}
            />
          )}

          <Text
            style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 2, color: '#10699b', fontFamily: 'Inter-Regular' }}
          >
            {currentName}
          </Text>

          {editingProfile ? (
            <>
              <Input
                placeholder={`Nuevo nombre (actual: ${currentName})`}
                value={newName}
                onChangeText={(text) => setNewName(text)}
                className="bg-white rounded-lg p-3 mb-1/2"
                style={{ fontFamily: 'Inter-Regular' }}
              />
              <Button
                onPress={handleUpdateName}
                bg="#6fc1d2"
                _pressed={{ bg: '#7da09c' }}
                isDisabled={!newName}
                style={{ fontSize: 20 }} // Ajusta el tamaño de la fuente según sea necesario
              >
                Actualizar Nombre
              </Button>

              <Input
                placeholder="Nueva contraseña"
                secureTextEntry
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                bg="white"
                rounded="md"
                p={3}
                marginBottom={2}
                fontFamily="Inter-Regular"
              />
              <Input
                placeholder="Confirmar nueva contraseña"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                bg="white"
                rounded="md"
                p={3}
                marginBottom={2}
                fontFamily="Inter-Regular"
              />
              <Button
                onPress={handleUpdatePassword}
                bg="#6fc1d2"
                _pressed={{ bg: '#7da09c' }}
                isDisabled={!newPassword || !confirmPassword}
                style={{ fontSize: 20 }} // Ajusta el tamaño de la fuente según sea necesario
              >
                Actualizar Contraseña
              </Button>

              <Input
                placeholder="Escribe 'Eliminar Cuenta' para confirmar"
                value={confirmationText}
                onChangeText={(text) => setConfirmationText(text)}
                bg="white"
                rounded="md"
                p={3}
                marginBottom={2}
                fontFamily="Inter-Regular"
              />
              <Button
                onPress={handleDeleteAccount}
                bg="#ef4444"
                _pressed={{ bg: '#7da09c' }}
                isDisabled={!confirmationText}
                style={{ fontSize: 20 }} // Ajusta el tamaño de la fuente según sea necesario
              >
                Eliminar Cuenta
              </Button>
            </>
          ) : (
            <Button onPress={() => setEditingProfile(true)} fontFamily="Inter-Regular">
              Editar Perfil
            </Button>
          )}

          {/* Logout */}
          <Pressable onPress={handleLogout} marginTop={2}>
            <Text
              fontSize="lg"
              color="#10699b"
              fontFamily="Inter-Regular"
              style={{ fontSize: 16, textAlign: 'center' }}
            >
              Logout
            </Text>
          </Pressable>
        </VStack>

        {/* Modal para mostrar alertas */}
        <Modal isOpen={modalVisible} onClose={closeModal}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>{modalContent.title}</Modal.Header>
            <Modal.Body>
              <Text>{modalContent.message}</Text>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AccountSection;
