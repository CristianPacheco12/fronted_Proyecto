import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function DashboardScreen({ route, navigation }) {
  const { token } = route.params;
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const recuadros = [
    { id: 1, title: 'Ver Artesanías', image: 'https://i.pinimg.com/736x/e4/02/0d/e4020ddb2d788cd00abefe3032887346.jpg', route: 'VerArtesanias', roles: ['Administrador', 'Cliente'] },
    { id: 2, title: 'Artesanías', image: 'https://i.pinimg.com/736x/47/4d/48/474d48518ccadaeb70a2ca54a6b4030d.jpg', route: 'CraftCrudScreen', roles: ['Administrador'] },
    { id: 3, title: 'Categorías', image: 'https://i.pinimg.com/736x/65/2a/5e/652a5ea8ab74ff81d7915bb2e6079d2f.jpg', route: 'CategoriasCrudScreen', roles: ['Administrador'] },
    { id: 4, title: 'Comprar', image: 'https://i.pinimg.com/736x/12/b0/7d/12b07d7d7dbde76a3a687552d50d397f.jpg', route: 'VentasCrudScreen', roles: ['Administrador', 'Cliente'] },
    { id: 5, title: 'Ventas Realizadas', image: 'https://i.pinimg.com/736x/c8/94/c9/c894c976b43eea5c836bf22d7d1a6745.jpg', route: 'ListarVentas', roles: ['Administrador'] },
  ];

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://192.168.0.27:3000/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo cargar la información del usuario');
      }

      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleMenuOption = (option) => {
    setMenuVisible(false);
    switch (option) {
      case 'info':
        if (userInfo) {
          setModalContent(`Nombre: ${userInfo.nombre}\nTeléfono: ${userInfo.telefono}\nRol: ${userInfo.rol}`);
        } else {
          setModalContent('No se pudo cargar la información del usuario');
        }
        break;
      case 'about':
        setModalContent('Acerca de nosotros: Somos una empresa dedicada a apoyar a los artesanos Oaxaqueños.');
        break;
      case 'logout':
        navigation.navigate('Login');
        break;
      default:
        setModalContent(null);
    }
  };

  const filteredRecuadros = userInfo
    ? recuadros.filter((recuadro) => recuadro.roles.includes(userInfo.rol))
    : [];

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/43/28/e8/4328e84badafafa9dfb5b13b085788cd.jpg' }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido a la Tienda de Artesanías</Text>
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <Icon name="more-vert" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {menuVisible && (
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('info')}>
              <Icon name="person" size={20} color="black" />
              <Text style={styles.menuText}>Tu Información</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('about')}>
              <Icon name="info" size={20} color="black" />
              <Text style={styles.menuText}>Acerca de</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('logout')}>
              <Icon name="logout" size={20} color="black" />
              <Text style={styles.menuText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.grid}>
          {filteredRecuadros.map((recuadro) => (
            <TouchableOpacity
              key={recuadro.id}
              style={styles.card}
              onPress={() => navigation.navigate(recuadro.route, { token })}
            >
              <Image source={{ uri: recuadro.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{recuadro.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={modalContent !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalContent(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{modalContent}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalContent(null)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    marginBottom: 15,
    width: '48%', // Dos columnas
    alignItems: 'center',
    padding: 15,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#00adb5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
