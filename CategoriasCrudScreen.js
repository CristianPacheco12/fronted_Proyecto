import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function CategoriasCrudScreen({ route, navigation }) {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { token } = route.params;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://192.168.0.27:3000/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las categorías');
      console.error(error);
    }
  };

  const addCategory = async () => {
    try {
      const response = await fetch('http://192.168.0.27:3000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setTitle('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la categoría');
      console.error(error);
    }
  };

  const editCategory = (category) => {
    setSelectedCategory(category);
    setTitle(category.title);
    setDescription(category.description);
    setEditMode(true);
  };

  const updateCategory = async () => {
    try {
      const response = await fetch(`http://192.168.0.27:3000/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      const updatedCategory = await response.json();
      setCategories(categories.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)));
      setEditMode(false);
      setTitle('');
      setDescription('');
      setSelectedCategory(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la categoría');
      console.error(error);
    }
  };

  const deleteCategory = (id) => {
    Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar esta categoría?',
        [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await fetch(`http://192.168.0.27:3000/api/categories/${id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setCategories(categories.filter((category) => category.id !== id));
                        Alert.alert('Éxito', 'Categoría eliminada correctamente.');
                    } catch (error) {
                        Alert.alert('Error', 'No se pudo eliminar la categoría.');
                        console.error(error);
                    }
                },
            },
        ],
    );
};


  const renderCategory = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>{item.description}</Text>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => editCategory(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCategory(item.id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Categorías</Text>
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
      <Button title={editMode ? "Actualizar Categoría" : "Agregar Categoría"} onPress={editMode ? updateCategory : addCategory} />
      <FlatList
    contentContainerStyle={{ paddingBottom: 20 }} // Añade un margen inferior
    data={categories}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderCategory}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    paddingHorizontal: 20,
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
    width: '100%', // Ocupa el 90% del ancho de la pantalla
    alignSelf: 'center', // Centra el elemento horizontalmente
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
