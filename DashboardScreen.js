import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

function DashboardScreen({ route, navigation }) {
  const { token } = route.params; // Recibe el token aquí

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Bienvenido a la Tienda de Artesanías</Text>
        
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>
            Acerca de Nosotros: Somos una tienda dedicada a la venta de artesanías locales. 
            Nuestro objetivo es apoyar a los artesanos y ofrecer productos únicos a nuestros clientes.
          </Text>
        </View>
        
        <Image 
          source={{ uri: 'https://i.pinimg.com/originals/a2/65/77/a265778fe84bd0256fcafe7eee415b8c.jpg' }} 
          style={styles.artImage}
        />
      </ScrollView>

      {/* Barra de botones en la parte inferior */}
      <View style={styles.bottomBar}>
        {/* Pasar el token a CraftCrudScreen */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('CraftCrudScreen', { token })} 
          style={styles.button}
        >
          <Text style={styles.buttonText}>Artesanías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Categorías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ventas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Historial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  aboutContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 16,
    textAlign: 'center',
  },
  artImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#ddd',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#5a3d5c',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DashboardScreen;
