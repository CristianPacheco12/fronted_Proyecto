import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './DashboardScreen';
import CraftCrudScreen from './CraftCrudScreen';

// Pantalla principal de inicio de sesión
function LoginScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.168.137.90:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, password }),
      });

      const data = await response.json();

      if (data.token) {
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

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Pantalla de registro
function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://10.168.137.90:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, password }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Éxito', 'Cuenta creada exitosamente');
        navigation.navigate('Login'); // Vuelve a la pantalla de inicio de sesión
      } else {
        Alert.alert('Error', data.message || 'Registro fallido');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con el registro');
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
        <Text style={styles.title}>Registro</Text>
        
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

        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text style={styles.loginButtonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.registerText}>¿Ya tienes una cuenta? Inicia sesión</Text>
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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
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
  registerText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
