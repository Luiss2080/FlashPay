import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import {
  Text,
  Searchbar,
  Chip,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";

const HistoryScreen = () => {
  const navigation = useNavigation<any>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "ingreso" | "egreso">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Using home-data for now as it returns transactions, but ideally we'd have a specific endpoint paging them.
        // Let's use home-data for MVP or create a dedicated endpoint if needed.
        // Actually, home-data limits to 5. Let's create a specific fetch if possible or just use what we have.
        // Since we didn't create a 'history' endpoint in backend yet, let's reuse home-data and filter client side
        // OR simply display the top 5 for now and note it.
        // Better yet: Update backend homeController to accept a 'limit' param or new route.
        // Let's assume /api/home-data gives us recent ones.

        const response = await api.get(
          `/api/home-data?id_usuario=${user.id_usuario}`,
        );
        if (response.data.status === "success") {
          // Backend currently limits to 5. We might want to increase this limit in the backend controller later.
          setTransactions(response.data.data.transactions);
          setFilteredTransactions(response.data.data.transactions);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = transactions;

    if (filter !== "all") {
      filtered = filtered.filter((t) => t.direccion === filter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.otro_usuario_nombre
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          t.tipo.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredTransactions(filtered);
  }, [filter, searchQuery, transactions]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor:
              item.direccion === "ingreso" ? "#E8F5E9" : "#FFEBEE",
          },
        ]}
      >
        <Ionicons
          name={item.direccion === "ingreso" ? "arrow-down" : "arrow-up"}
          size={20}
          color={item.direccion === "ingreso" ? colors.success : colors.error}
        />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.txName}>
          {item.otro_usuario_nombre || "Sistema"}
        </Text>
        <Text style={styles.txDate}>
          {item.tipo} • {new Date(item.fecha).toLocaleDateString()}
        </Text>
      </View>
      <Text
        style={[
          styles.txAmount,
          {
            color: item.direccion === "ingreso" ? colors.success : colors.error,
          },
        ]}
      >
        {item.direccion === "ingreso" ? "+" : "-"} S/{" "}
        {parseFloat(item.monto).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Movimientos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Buscar..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ fontSize: 14 }}
        />
        <View style={styles.chipsRow}>
          <Chip
            selected={filter === "all"}
            onPress={() => setFilter("all")}
            style={styles.chip}
            showSelectedOverlay
          >
            Todos
          </Chip>
          <Chip
            selected={filter === "ingreso"}
            onPress={() => setFilter("ingreso")}
            style={styles.chip}
            showSelectedOverlay
          >
            Ingresos
          </Chip>
          <Chip
            selected={filter === "egreso"}
            onPress={() => setFilter("egreso")}
            style={styles.chip}
            showSelectedOverlay
          >
            Egresos
          </Chip>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} color={colors.primary} />
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_transaccion.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No se encontraron movimientos.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  filterContainer: {
    backgroundColor: "white",
    padding: 15,
  },
  searchBar: {
    borderRadius: 10,
    height: 45,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
    elevation: 0,
  },
  chipsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  chip: {
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 20,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  txName: {
    fontWeight: "bold",
    fontSize: 15,
    color: colors.text,
  },
  txDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  txAmount: {
    fontWeight: "bold",
    fontSize: 15,
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
  },
});

export default HistoryScreen;
