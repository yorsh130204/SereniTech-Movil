import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import profileImage from '../assets/img/user1.png';

const AccountSection = () => {
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    // Cargar el nombre actual cuando el componente se monta
    loadCurrentName();
  }, []);

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

  const handleUpdateName = async () => {
    try {
      await updateProfile(currentUser, { displayName: newName });
      await set(ref(FIREBASE_DB, `users/${currentUser.uid}`), { name: newName }, { merge: true });
      Alert.alert('Éxito', 'Nombre actualizado exitosamente.');
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar el nombre: ' + error.message);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    try {
      await updatePassword(currentUser, newPassword);
      Alert.alert('Éxito', 'Contraseña actualizada exitosamente.');
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar la contraseña: ' + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText.trim() !== 'Eliminar Cuenta') {
      Alert.alert('Error', 'Texto de confirmación incorrecto. Por favor, escribe "Eliminar Cuenta".');
      return;
    }

    try {
      await deleteUser(currentUser);
      Alert.alert('Éxito', 'Cuenta eliminada exitosamente.');
    } catch (error) {
      Alert.alert('Error', 'Error al eliminar la cuenta: ' + error.message);
    }
  };

  return (
    <View className="p-4 bg-gray-100 rounded-lg shadow-md">
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* Imagen de Perfil */}
        {profileImage && (
          <Image
            source={profileImage}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
          />
        )}

        {/* Nombre Actual */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          Nombre Actual: {currentName}
        </Text>
      </View>

      {editingProfile ? (
        // Sección para editar el perfil
        <>
          {/* Cambiar Nombre */}
          <TextInput
            placeholder={`Nuevo nombre (actual: ${currentName})`}
            value={newName}
            onChangeText={(text) => setNewName(text)}
            className="bg-white border rounded-md p-3 mb-4"
          />
          <Button title="Actualizar Nombre" onPress={handleUpdateName} />

          {/* Cambiar Contraseña */}
          <TextInput
            placeholder="Nueva contraseña"
            secureTextEntry
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            className="bg-white border rounded-md p-3 mb-4"
          />
          <TextInput
            placeholder="Confirmar nueva contraseña"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            className="bg-white border rounded-md p-3 mb-4"
          />
          <Button title="Actualizar Contraseña" onPress={handleUpdatePassword} />

          {/* Eliminar Cuenta */}
          <TextInput
            placeholder="Escribe 'Eliminar Cuenta' para confirmar"
            value={confirmationText}
            onChangeText={(text) => setConfirmationText(text)}
            className="bg-white border rounded-md p-3 mb-4"
          />
          <Button title="Eliminar Cuenta" onPress={handleDeleteAccount} />
        </>
      ) : (
        // Botón para activar la edición del perfil
        <Button title="Editar Perfil" onPress={() => setEditingProfile(true)} />
      )}
    </View>
  );
};

export default AccountSection;
