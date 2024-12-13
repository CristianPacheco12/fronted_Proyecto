import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";

export default function ListarVentas({ route, navigation }) {
  const [sales, setSales] = useState([]);
  const { token } = route.params;

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch("http://192.168.0.27:3000/api/sales/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSales(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las ventas.");
      console.error("Error al obtener las ventas:", error);
    }
  };

  const renderSale = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Producto: {item.craftName}</Text>
      <Text style={styles.cardText}>Cantidad: {item.quantity}</Text>
      <Text style={styles.priceText}>Total: ${item.totalPrice}</Text>
      <Text style={styles.cardText}>Cliente: {item.User?.nombre || "Desconocido"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con el botón para regresar */}
      <View style={styles.header}>
        <Text style={styles.title}>Listado de Ventas</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Regresa al Dashboard
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Listado de Ventas */}
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
    backgroundColor: "#1f1f1f",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f9f9f9",
  },
  backButton: {
    backgroundColor: "#00adb5",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#292929",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: "100%",
    alignSelf: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f9f9f9",
    marginBottom: 8,
  },
  cardText: {
    color: "#b0b0b0",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00ff7f",
    marginBottom: 10,
  },
});
