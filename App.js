import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './DashboardScreen'; // Asegúrate de que la ruta sea correcta
import CraftCrudScreen from './CraftCrudScreen'; // Ruta correcta para acceder al CRUD desde el Dashboard

// Pantalla principal de inicio de sesión
function App({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Llamada a la API de autenticación
      const response = await fetch('http://192.168.137.90:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, password }),
      });

      const data = await response.json();

      if (data.token) {
        // Guardar el token y navegar al Dashboard con el token
        navigation.navigate('Dashboard', { token: data.token });
      } else {
        Alert.alert('Error', data.message || 'Inicio de sesión fallido');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con la solicitud de inicio de sesión');
      console.error(error);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://i.pinimg.com/originals/a2/65/77/a265778fe84bd0256fcafe7eee415b8c.jpg' }} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Inicio de sesión</Text>
        
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#fff"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        
        <TextInput
          placeholder="Teléfono"
          placeholderTextColor="#fff"
          value={telefono}
          onChangeText={setTelefono}
          style={styles.input}
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const Stack = createStackNavigator();

export default function MainApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={App} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="CraftCrudScreen" component={CraftCrudScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 25,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#5a3d5c',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
