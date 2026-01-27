import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Text, Card, Title } from "react-native-paper";
import { colors } from "../../utils/theme";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const HistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await api.get(
          `/history.php?id_usuario=${user.id_usuario}`,
        );
        if (response.data.status === "success") {
          setTransactions(response.data.data);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Content style={styles.row}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={
              item.direccion === "ingreso"
                ? "arrow-down-circle"
                : "arrow-up-circle"
            }
            size={32}
            color={item.direccion === "ingreso" ? colors.success : colors.error}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.otro_usuario_nombre}</Text>
          <Text style={styles.date}>
            {new Date(item.fecha).toLocaleString()}
          </Text>
          <Text style={styles.type}>{item.tipo}</Text>
        </View>
        <Text
          style={[
            styles.amount,
            {
              color:
                item.direccion === "ingreso" ? colors.success : colors.error,
            },
          ]}
        >
          {item.direccion === "ingreso" ? "+" : "-"} S/{" "}
          {parseFloat(item.monto).toFixed(2)}
        </Text>
      </Card.Content>
    </Card>
  );

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Mis Movimientos</Title>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id_transaccion.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay movimientos aún</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 40 },
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: colors.primary,
    fontWeight: "bold",
  },
  center: { flex: 1, justifyContent: "center" },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { marginBottom: 10, borderRadius: 12, elevation: 2 },
  row: { flexDirection: "row", alignItems: "center" },
  iconContainer: { marginRight: 15 },
  info: { flex: 1 },
  name: { fontWeight: "bold", fontSize: 16 },
  date: { color: "#888", fontSize: 12 },
  type: { color: "#666", fontSize: 12, textTransform: "capitalize" },
  amount: { fontWeight: "bold", fontSize: 16 },
  empty: { textAlign: "center", marginTop: 50, color: "#999" },
});

export default HistoryScreen;
