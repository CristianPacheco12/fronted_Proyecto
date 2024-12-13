import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';

export default function VerArtesanias({ navigation, route }) {
    const [crafts, setCrafts] = useState([]);
    const { token } = route.params;

    useEffect(() => {
        fetchCrafts();
    }, []);

    const fetchCrafts = async () => {
        try {
            const response = await fetch('http://192.168.0.27:3000/api/crafts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setCrafts(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las artesanías.');
            console.error(error);
        }
    };

    const renderCraft = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.description}</Text>
            <Text style={styles.priceText}>Precio: ${item.price}</Text>
            <Text style={styles.stockText}>Stock: {item.stock}</Text>
            <Text style={styles.cardText}>
                Categoría: {item.CraftCategory?.title || 'Sin Categoría'}
            </Text>
            {item.image && (
                <Image
                    source={{ uri: `http://192.168.0.27:3000${item.image}` }}
                    style={styles.imagePreview}
                />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Lista de Artesanías</Text>
                 <TouchableOpacity
                         style={styles.backButton}
                         onPress={() => navigation.goBack()} // Regresa al Dashboard
                       >
                         <Text style={styles.backButtonText}>Volver</Text>
                       </TouchableOpacity>
            </View>
            <FlatList
                data={crafts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCraft}
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
});
