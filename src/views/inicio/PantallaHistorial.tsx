import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Share,
  RefreshControl,
} from "react-native";
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
import { Skeleton } from "../../components/common/Skeleton";
import { hapticFeedback } from "../../utils/haptics";

const PantallaHistorial = () => {
  // ...
  const navigation = useNavigation<any>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
        const response = await api.get(
          `/api/home-data?id_usuario=${user.id_usuario}`,
        );
        if (response.data.status === "success") {
          setTransactions(response.data.data.transactions || []);
          setFilteredTransactions(response.data.data.transactions || []);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Small delay for skeleton demo
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 500);
    }
  };

  const onRefresh = () => {
    hapticFeedback.light();
    setRefreshing(true);
    fetchHistory();
  };

  const handleShare = async (item: any) => {
    hapticFeedback.selection();
    try {
      const message = `
🧾 *Constancia de Transferencia - FlashPay*

👤 *Origen:* ${item.direccion === "egreso" ? "Tú" : item.otro_usuario_nombre || "Sistema"}
➡️ *Destino:* ${item.direccion === "egreso" ? item.otro_usuario_nombre || "Sistema" : "Tú"}
💰 *Monto:* S/ ${parseFloat(item.monto).toFixed(2)}
📅 *Fecha:* ${new Date(item.fecha).toLocaleString()}
🔖 *ID:* ${item.id_transaccion}

¡Operación exitosa con FlashPay! 🚀
      `.trim();

      await Share.share({
        message,
        title: "Constancia FlashPay",
      });
    } catch (error) {
      console.error(error);
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
          (t.otro_usuario_nombre || "Sistema")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          t.tipo.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredTransactions(filtered);
  }, [filter, searchQuery, transactions]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() =>
        navigation.navigate("TransactionDetail", { transaction: item })
      }
    >
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
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={[
            styles.txAmount,
            {
              color:
                item.direccion === "ingreso" ? colors.success : colors.error,
            },
          ]}
        >
          {item.direccion === "ingreso" ? "+" : "-"} S/{" "}
          {parseFloat(item.monto).toFixed(2)}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#ccc"
          style={{ marginTop: 5 }}
        />
      </View>
    </TouchableOpacity>
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
            onPress={() => {
              hapticFeedback.selection();
              setFilter("all");
            }}
            style={styles.chip}
            showSelectedOverlay
          >
            Todos
          </Chip>
          <Chip
            selected={filter === "ingreso"}
            onPress={() => {
              hapticFeedback.selection();
              setFilter("ingreso");
            }}
            style={styles.chip}
            showSelectedOverlay
          >
            Ingresos
          </Chip>
          <Chip
            selected={filter === "egreso"}
            onPress={() => {
              hapticFeedback.selection();
              setFilter("egreso");
            }}
            style={styles.chip}
            showSelectedOverlay
          >
            Egresos
          </Chip>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={{ padding: 20 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                marginBottom: 15,
                alignItems: "center",
              }}
            >
              <Skeleton variant="circle" width={40} height={40} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Skeleton width="60%" height={15} style={{ marginBottom: 5 }} />
                <Skeleton width="40%" height={12} />
              </View>
              <Skeleton width={60} height={15} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_transaccion.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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

export default PantallaHistorial;
