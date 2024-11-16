import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function CraftCrudScreen({ route, navigation }) {
  const [crafts, setCrafts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedCraft, setSelectedCraft] = useState(null);
  const { token } = route.params;

  useEffect(() => {
    fetchCrafts();
  }, []);

  const fetchCrafts = async () => {
    try {
      const response = await fetch('http://10.168.137.90:3000/api/crafts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCrafts(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las artesanías');
      console.error(error);
    }
  };

  const addCraft = async () => {
    try {
      const response = await fetch('http://10.168.137.90:3000/api/crafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, price: parseFloat(price) }),
      });
      const newCraft = await response.json();
      setCrafts([...crafts, newCraft]);
      setTitle('');
      setDescription('');
      setPrice('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la artesanía');
      console.error(error);
    }
  };

  const editCraft = (craft) => {
    setSelectedCraft(craft);
    setTitle(craft.title);
    setDescription(craft.description);
    setPrice(craft.price.toString());
    setEditMode(true);
  };

  const updateCraft = async () => {
    try {
      const response = await fetch(`http://10.168.137.90:3000/api/crafts/${selectedCraft.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, price: parseFloat(price) }),
      });
      const updatedCraft = await response.json();
      setCrafts(crafts.map((craft) => (craft.id === updatedCraft.id ? updatedCraft : craft)));
      setEditMode(false);
      setTitle('');
      setDescription('');
      setPrice('');
      setSelectedCraft(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la artesanía');
      console.error(error);
    }
  };

  const deleteCraft = async (id) => {
    try {
      await fetch(`http://10.168.137.90:3000/api/crafts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrafts(crafts.filter((craft) => craft.id !== id));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la artesanía');
      console.error(error);
    }
  };

  const renderCraft = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>{item.description}</Text>
      <Text style={styles.priceText}>Precio: ${item.price}</Text>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => editCraft(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCraft(item.id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado con botón de Volver */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Artesanías</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#f7f5f5"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor="#f7f5f5"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        placeholderTextColor="#f7f5f5"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <Button title={editMode ? "Actualizar Artesanía" : "Agregar Artesanía"} onPress={editMode ? updateCraft : addCraft} />
      <FlatList
        data={crafts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCraft}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: '#1f1f1f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9f9f9',
  },
  backButton: {
    backgroundColor: '#00adb5',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#292929',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f9f9f9',
    marginBottom: 8,
  },
  cardText: {
    color: '#b0b0b0',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff7f',
    marginBottom: 10,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#00adb5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#ff6363',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
