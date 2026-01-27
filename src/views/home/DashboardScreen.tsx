import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { Text, Button, Card, Avatar, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);

        // Fetch updated balance and transactions
        const response = await api.get(
          `/home_data.php?id_usuario=${user.id_usuario}`,
        );
        if (response.data.status === "success") {
          setUserData((prev) => ({
            ...prev,
            saldo: response.data.data.user.saldo,
          }));
          setTransactions(response.data.data.transactions);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={{
              uri:
                "https://ui-avatars.com/api/?name=" +
                (userData?.nombre || "User") +
                "&background=random",
            }}
            style={styles.avatar}
          />
          <Text style={styles.greeting}>
            Hola, {userData?.nombre?.split(" ")[0]}
          </Text>
          <IconButton
            icon="bell-outline"
            iconColor="white"
            size={24}
            onPress={() => {}}
          />
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.currencySymbol}>S/ </Text>
            <Text style={styles.balanceAmount}>
              {showBalance
                ? parseFloat(userData?.saldo || 0).toFixed(2)
                : "***.**"}
            </Text>
            <IconButton
              icon={showBalance ? "eye-off" : "eye"}
              iconColor="white"
              size={20}
              onPress={() => setShowBalance(!showBalance)}
            />
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("QRScan")}
        >
          <View style={styles.qrButton}>
            <Ionicons name="scan-outline" size={32} color="white" />
            <Text style={styles.qrText}>Escanear QR</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate("Transfer")}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#e0f2f1" }]}>
              <Ionicons name="send" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.actionText}>Transferir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <View style={[styles.iconCircle, { backgroundColor: "#f3e5f5" }]}>
              <Ionicons
                name="phone-portrait-outline"
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={styles.actionText}>Recargar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Últimos movimientos</Text>
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>No tienes movimientos recientes.</Text>
        ) : (
          transactions.map((tx, index) => (
            <Card key={index} style={styles.transactionCard}>
              <Card.Content style={styles.transactionRow}>
                <View style={styles.transactionIcon}>
                  <Ionicons
                    name={
                      tx.direccion === "ingreso"
                        ? "arrow-down-circle"
                        : "arrow-up-circle"
                    }
                    size={24}
                    color={
                      tx.direccion === "ingreso" ? colors.success : colors.error
                    }
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>
                    {tx.otro_usuario_nombre}
                  </Text>
                  <Text style={styles.transactionType}>
                    {tx.tipo} - {new Date(tx.fecha).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color:
                        tx.direccion === "ingreso"
                          ? colors.success
                          : colors.error,
                    },
                  ]}
                >
                  {tx.direccion === "ingreso" ? "+" : "-"} S/{" "}
                  {parseFloat(tx.monto).toFixed(2)}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  greeting: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 10,
  },
  balanceContainer: {
    alignItems: "center",
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  balanceAmount: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  actionsContainer: {
    marginTop: -30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  actionButton: {
    marginBottom: 20,
  },
  qrButton: {
    backgroundColor: colors.secondary,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  qrText: {
    color: "white",
    fontSize: 8,
    marginTop: 2,
    fontWeight: "bold",
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  secondaryBtn: {
    alignItems: "center",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  actionText: {
    color: colors.text,
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
    marginTop: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  transactionCard: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  transactionIcon: {
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.text,
  },
  transactionType: {
    color: "#888",
    fontSize: 12,
    textTransform: "capitalize",
  },
  transactionAmount: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DashboardScreen;
