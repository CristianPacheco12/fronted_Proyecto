import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function CraftCrudScreen({ route }) {
  const [crafts, setCrafts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const { token } = route.params;

  useEffect(() => {
    fetchCrafts();
  }, []);

  const fetchCrafts = async () => {
    try {
      const response = await fetch('http://192.168.137.90/api/crafts', {
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
      const response = await fetch('http://192.168.137.90/api/crafts', {
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

  const deleteCraft = async (id) => {
    try {
      await fetch(`http://192.168.137.90/api/crafts/${id}`, {
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
      <Text>{item.description}</Text>
      <Text>Precio: ${item.price}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCraft(item.id)}>
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Artesanías</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <Button title="Agregar Artesanía" onPress={addCraft} />
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
