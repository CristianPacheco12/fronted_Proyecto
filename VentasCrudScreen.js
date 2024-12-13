import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Cambio importante para usar Picker correctamente

export default function VentasCrudScreen({ route, navigation }) {
    const [sales, setSales] = useState([]);
    const [crafts, setCrafts] = useState([]);
    const [selectedCraftId, setSelectedCraftId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const { token } = route.params;

    useEffect(() => {
        fetchSales();
        fetchCrafts();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await fetch('http://192.168.0.27:3000/api/sales', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setSales(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las ventas');
            console.error('Error al obtener las ventas:', error);
        }
    };

    const fetchCrafts = async () => {
        try {
            const response = await fetch('http://192.168.0.27:3000/api/crafts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setCrafts(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las artesanías');
            console.error('Error al obtener las artesanías:', error);
        }
    };

    const addSale = async () => {
        try {
            if (!selectedCraftId || !quantity) {
                Alert.alert('Error', 'Debes seleccionar una artesanía y especificar una cantidad.');
                return;
            }

            const response = await fetch('http://192.168.0.27:3000/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ craftId: selectedCraftId, quantity: parseInt(quantity) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al agregar la venta');
            }

            const newSale = await response.json();
            setSales([...sales, newSale.sale]);
            resetForm();
            Alert.alert('Éxito', 'Venta registrada correctamente.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo registrar la venta.');
            console.error('Error al agregar la venta:', error);
        }
    };

    const editSale = (sale) => {
        setSelectedSale(sale);
        setQuantity(sale.quantity.toString());
        setEditMode(true);
    };
    
    const updateSale = async () => {
        try {
            const response = await fetch(`http://192.168.0.27:3000/api/sales/${selectedSale.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: parseInt(quantity) }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar la venta');
            }
    
            const updatedSale = await response.json();
            setSales(sales.map((sale) => (sale.id === updatedSale.sale.id ? updatedSale.sale : sale)));
            resetForm();
            Alert.alert('Éxito', 'Venta actualizada correctamente.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la venta.');
            console.error('Error al actualizar la venta:', error);
        }
    };
    
    const deleteSale = async (id) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar esta venta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://192.168.0.27:3000/api/sales/${id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                            });
    
                            if (!response.ok) throw new Error('Error al eliminar la venta');
    
                            setSales(sales.filter((sale) => sale.id !== id));
                            Alert.alert('Éxito', 'Venta eliminada correctamente.');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la venta.');
                            console.error('Error al eliminar la venta:', error);
                        }
                    },
                },
            ]
        );
    };

    const resetForm = () => {
        setQuantity('');
        setSelectedCraftId('');
        setEditMode(false);
        setSelectedSale(null);
    };

    const renderSale = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Producto: {item.craftName}</Text>
            <Text style={styles.cardText}>Cantidad: {item.quantity}</Text>
            <Text style={styles.priceText}>Total: ${item.totalPrice}</Text>
            <View style={styles.cardButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => editSale(item)}>
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSale(item.id)}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tus compras</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
    <Text style={styles.label}>Artesanía:</Text>
    <Picker
        selectedValue={selectedCraftId}
        onValueChange={(itemValue) => setSelectedCraftId(itemValue)}
        style={styles.input}
    >
        <Picker.Item label="Seleccione una artesanía" value="" />
        {crafts.map((craft) => (
            <Picker.Item key={craft.id} label={craft.title} value={craft.id} />
        ))}
    </Picker>

    <Text style={styles.label}>Cantidad:</Text>
    <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
    />
    <Button
        title={editMode ? "Actualizar Venta" : "Agregar Venta"}
        onPress={editMode ? updateSale : addSale}
    />
</View>

            <FlatList
                data={sales}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSale}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
    card: {
        backgroundColor: '#292929',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f9f9f9',
    },
    cardText: {
        color: '#b0b0b0',
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00ff7f',
        marginBottom: 10,
    },
    form: {
        marginBottom: 20,
    },
    label: {
        color: '#f9f9f9',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#2c2c2c',
        color: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    cardButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#00adb5',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: '#ff6363',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});