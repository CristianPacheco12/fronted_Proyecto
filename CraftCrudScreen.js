import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

export default function CraftCrudScreen({ route, navigation }) {
    const [crafts, setCrafts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedCraft, setSelectedCraft] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const { token } = route.params;
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchCrafts();
        fetchCategories();
    }, []);

    const fetchCrafts = async () => {
        try {
            const response = await fetch('http://192.168.0.27:3000/api/crafts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setCrafts(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las artesanías');
            console.error(error);
        }
    };

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

    const selectImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Error', 'Se requiere acceso a la galería para seleccionar una imagen.');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!pickerResult.cancelled) {
            setImage(pickerResult.assets[0].uri);
        }
    };

    const editCraft = (craft) => {
        setSelectedCraft(craft);
        setTitle(craft.title);
        setDescription(craft.description);
        setPrice(craft.price.toString());
        setStock(craft.stock.toString());
        setCategoryId(craft.categoryId);
        setImage(craft.image ? `http://192.168.0.27:3000${craft.image}` : null);
        setEditMode(true);
        setShowForm(true);
        scrollRef.current.scrollTo({ y: 0, animated: true });
    };

    const addCraft = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('stock', stock);
            formData.append('categoryId', categoryId);

            if (image) {
                const localUri = image;
                const filename = localUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('image', {
                    uri: localUri,
                    name: filename,
                    type,
                });
            }

            const response = await fetch('http://192.168.0.27:3000/api/crafts', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Error al agregar la artesanía: ' + JSON.stringify(errorData));
            }

            const newCraft = await response.json();
            setCrafts([...crafts, newCraft]);
            resetForm();
            Alert.alert('Éxito', 'Artesanía agregada correctamente.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo agregar la artesanía. Revisa la consola para más detalles.');
            console.error('Error en addCraft:', error.message);
        }
    };

    const updateCraft = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', parseFloat(price));
            formData.append('stock', parseInt(stock));
            formData.append('categoryId', categoryId);

            if (image && !image.startsWith('http')) {
                const localUri = image;
                const filename = localUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('image', {
                    uri: localUri,
                    name: filename,
                    type,
                });
            }

            const response = await fetch(`http://192.168.0.27:3000/api/crafts/${selectedCraft.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Error al actualizar la artesanía: ' + JSON.stringify(errorData));
            }

            const updatedCraft = await response.json();
            setCrafts(crafts.map((craft) => (craft.id === updatedCraft.id ? updatedCraft : craft)));

            resetForm();
            Alert.alert('Éxito', 'Artesanía actualizada correctamente.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la artesanía. Revisa la consola para más detalles.');
            console.error('Error en updateCraft:', error.message);
        }
    };

    const deleteCraft = async (id) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar esta artesanía?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await fetch(`http://192.168.0.27:3000/api/crafts/${id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            setCrafts(crafts.filter((craft) => craft.id !== id));
                            Alert.alert('Éxito', 'Artesanía eliminada correctamente.');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la artesanía.');
                            console.error(error);
                        }
                    },
                },
            ]
        );
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPrice('');
        setStock('');
        setCategoryId('');
        setImage(null);
        setEditMode(false);
        setSelectedCraft(null);
    };

    const renderCraft = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.description}</Text>
            <Text style={styles.priceText}>Precio: ${item.price}</Text>
            <Text style={styles.stockText}>Stock: {item.stock}</Text>
            <Text style={styles.cardText}>Categoría: {item.CraftCategory?.title || 'Sin Categoría'}</Text>
            {item.image && (
                <Image
                    source={{ uri: `http://192.168.0.27:3000${item.image}` }}
                    style={styles.imagePreview}
                />
            )}
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
        <ScrollView
            ref={scrollRef}
            onScroll={(event) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                setShowForm(offsetY < 50);
            }}
            scrollEventThrottle={16}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Gestión de Artesanías</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>Volver</Text>
                    </TouchableOpacity>
                </View>

                {showForm && (
                    <>
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
                        <TextInput
                            style={styles.input}
                            placeholder="Stock"
                            keyboardType="numeric"
                            value={stock}
                            onChangeText={setStock}
                        />
                        <Picker
                            selectedValue={categoryId}
                            onValueChange={(itemValue) => setCategoryId(itemValue)}
                            style={styles.input}
                        >
                            <Picker.Item label="Seleccione una categoría" value="" />
                            {categories.map((category) => (
                                <Picker.Item key={category.id} label={category.title} value={category.id} />
                            ))}
                        </Picker>

                        <TouchableOpacity
                            onPress={selectImage}
                            style={[styles.button, styles.imageButton]}
                        >
                            <Text style={styles.buttonText}>SELECCIONAR IMAGEN</Text>
                        </TouchableOpacity>
                        {image && <Text style={styles.imageText}>Imagen seleccionada</Text>}

                        <Button
                            title={editMode ? 'Actualizar Artesanía' : 'Agregar Artesanía'}
                            onPress={editMode ? updateCraft : addCraft}
                        />
                    </>
                )}

<FlatList
    data={crafts}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderCraft}
    contentContainerStyle={{ paddingBottom: 20 }}
    onScroll={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowForm(offsetY < 50);
    }}
    scrollEventThrottle={16}
/>

            </View>
        </ScrollView>
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
    button: {
        backgroundColor: '#00adb5',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    imageText: {
        color: '#f9f9f9',
        marginTop: 10,
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
        width: '100%',
        alignSelf: 'center',
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
    stockText: {
        fontSize: 16,
        color: '#f9f9f9',
        marginBottom: 10,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    cardButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
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
});