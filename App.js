import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './DashboardScreen';
import CraftCrudScreen from './CraftCrudScreen';
import CategoriasCrudScreen from './CategoriasCrudScreen';
import ListarVentas from './ListarVentas';
import VentasCrudScreen from './VentasCrudScreen';
import VerArtesanias from './verArtesanias';

// Pantalla principal de inicio de sesión
function LoginScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async () => {
    try {
      console.log('Iniciando login con:', { nombre, telefono, password }); // Depuración
      const response = await fetch('http://192.168.0.27:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        console.log('Login exitoso:', data);
        navigation.navigate('Dashboard', { token: data.token });
      } else {
        console.error('Error en el login:', data);
        Alert.alert('Error', data.error || 'Inicio de sesión fallido');
      }
    } catch (error) {
      console.error('Error de red o servidor:', error);
      Alert.alert('Error', 'Hubo un problema con la solicitud de inicio de sesión');
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://i.pinimg.com/736x/40/f5/c2/40f5c22e0062cebb5d0d68ae8f75cc78.jpg' }} 
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
  secureTextEntry={!showPassword} // Alterna entre mostrar y ocultar la contraseña
  style={styles.input}
/>

         <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.togglePassword}
          >
            <Text style={styles.togglePasswordText}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
            </TouchableOpacity>



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

function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    console.log('Iniciando proceso de registro con:', { nombre, telefono, password }); // Log inicial para depuración
    try {
      const response = await fetch('http://192.168.0.27:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, password }),
      });

      console.log('Respuesta del servidor:', response); // Log para verificar la respuesta cruda
      const data = await response.json();

      console.log('Datos recibidos:', data); // Log para ver los datos procesados

      if (response.ok && data.token) {
        console.log('Registro exitoso, redirigiendo al dashboard');
        Alert.alert('Éxito', 'Cuenta creada exitosamente');
        navigation.navigate('Dashboard', { token: data.token }); // Redirige al dashboard con el token
      } else {
        console.error('Error en el registro:', data.error || 'Registro fallido');
        Alert.alert('Error', data.error || 'Registro fallido');
      }
    } catch (error) {
      console.error('Error de red o en el servidor:', error);
      Alert.alert('Error', 'Hubo un problema con el registro');
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://i.pinimg.com/736x/11/aa/71/11aa71d044fee73c52d70d2ed46bdd6f.jpg' }} 
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
          secureTextEntry={!showPassword}
          style={styles.input}
          onFocus={() => setShowPassword(true)}
          onBlur={() => setShowPassword(false)}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.togglePassword}
        >
          <Text style={styles.togglePasswordText}>
            {showPassword ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>

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
        <Stack.Screen 
          name="CategoriasCrudScreen" 
          component={CategoriasCrudScreen} 
        />
         <Stack.Screen name="ListarVentas" component={ListarVentas} />
         <Stack.Screen name="VentasCrudScreen" component={VentasCrudScreen} />
         <Stack.Screen name="VerArtesanias" component={VerArtesanias} />
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
    backgroundColor: '#30d9bd',
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

  togglePassword: {
    position: 'absolute',
    right: 30, // Ajusta la posición horizontal
    top: '60%', // Ajusta la posición vertical para centrarlo
  },
  togglePasswordText: {
    fontSize: 30, // Tamaño grande para el ícono
    color: '#fff', // Color del ícono
  },
  
  
});
