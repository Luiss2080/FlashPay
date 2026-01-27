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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);

        const response = await api.get(
          `/api/home-data?id_usuario=${user.id_usuario}`,
        );
        if (response.data.status === "success") {
          setUserData((prev: any) => ({
            ...prev,
            saldo: response.data.data.user.saldo,
          }));
          setTransactions(response.data.data.transactions || []);
          setNotifications(response.data.data.notifications || []);
          setContacts(response.data.data.contacts || []);
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

  const promos = notifications.filter((n) => n.tipo === "promo");

  return (
    <View style={styles.container}>
      {/* Header Gradient Style */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{
                uri:
                  "https://ui-avatars.com/api/?name=" +
                  (userData?.nombre || "User") +
                  "&background=random",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.greeting}>
            Hola, {userData?.nombre?.split(" ")[0]}
          </Text>
          <View>
            <IconButton
              icon="bell-outline"
              iconColor="white"
              size={24}
              onPress={() => navigation.navigate("Notifications")}
            />
            {notifications.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notifications.length}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <TouchableOpacity
            style={styles.balanceRow}
            onPress={() => setShowBalance(!showBalance)}
          >
            <Text style={styles.currencySymbol}>S/ </Text>
            <Text style={styles.balanceAmount}>
              {showBalance
                ? parseFloat(userData?.saldo || 0).toFixed(2)
                : "***.**"}
            </Text>
            <Ionicons
              name={showBalance ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="rgba(255,255,255,0.8)"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions Floating Card */}
      <View style={styles.actionsCard}>
        <View style={styles.qrSection}>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => navigation.navigate("QRScan")}
          >
            <Ionicons name="scan" size={30} color="white" />
            <Text style={styles.qrText}>Escanear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.gridAction}
            onPress={() => navigation.navigate("Transfer")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#E0F2F1" }]}>
              <Ionicons name="send" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.gridLabel}>Transferir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridAction}
            onPress={() => navigation.navigate("TopUp")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#F3E5F5" }]}>
              <Ionicons
                name="phone-portrait"
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={styles.gridLabel}>Recargar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridAction}
            onPress={() => navigation.navigate("Services")}
          >
            <View style={[styles.iconBox, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="bulb" size={24} color="#F57C00" />
            </View>
            <Text style={styles.gridLabel}>Servicios</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Promos Section */}
        {promos.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Promociones para ti</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {promos.map((promo, index) => (
                <Card key={index} style={styles.promoCard}>
                  <Card.Cover
                    source={{
                      uri: "https://via.placeholder.com/300x150/742384/ffffff?text=Promo",
                    }}
                    style={{ height: 100 }}
                  />
                  <Card.Content>
                    <Text style={styles.promoTitle}>{promo.titulo}</Text>
                    <Text style={styles.promoText} numberOfLines={2}>
                      {promo.mensaje}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Favorites / Contacts Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Transferir a...</Text>
          {contacts.length === 0 ? (
            <View style={styles.emptyContacts}>
              <Text style={{ color: "#999" }}>No tienes favoritos aún</Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate("Transfer")}
              >
                Agregar
              </Button>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingBottom: 10 }}
            >
              <TouchableOpacity
                style={styles.addContactBtn}
                onPress={() => navigation.navigate("Transfer")}
              >
                <View style={styles.addContactIcon}>
                  <Ionicons name="add" size={24} color={colors.primary} />
                </View>
                <Text style={styles.contactName}>Nuevo</Text>
              </TouchableOpacity>
              {contacts.map((contact, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.contactItem}
                  onPress={() =>
                    navigation.navigate("Transfer", { phone: contact.telefono })
                  }
                >
                  <Avatar.Text
                    size={45}
                    label={contact.alias.substring(0, 2).toUpperCase()}
                    style={{ backgroundColor: colors.secondary }}
                    color="white"
                  />
                  <Text style={styles.contactName} numberOfLines={1}>
                    {contact.alias}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <Text style={styles.sectionTitle}>Últimos movimientos</Text>
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>No tienes movimientos recientes.</Text>
        ) : (
          transactions.map((tx, index) => (
            <TouchableOpacity key={index} style={styles.transactionItem}>
              <View
                style={[
                  styles.txIconCtx,
                  {
                    backgroundColor:
                      tx.direccion === "ingreso" ? "#E8F5E9" : "#FFEBEE",
                  },
                ]}
              >
                <Ionicons
                  name={tx.direccion === "ingreso" ? "arrow-down" : "arrow-up"}
                  size={20}
                  color={
                    tx.direccion === "ingreso" ? colors.success : colors.error
                  }
                />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.txName}>{tx.otro_usuario_nombre}</Text>
                <Text style={styles.txDate}>
                  {tx.tipo} • {new Date(tx.fecha).toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
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
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 100 }} />
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
    paddingBottom: 90, // More space for the floating card
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary, // Blend with header
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  balanceContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  currencySymbol: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  balanceAmount: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  actionsCard: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: -60, // Overlap header
    borderRadius: 15,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrSection: {
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#eee",
    paddingRight: 15,
    marginRight: 15,
  },
  qrButton: {
    backgroundColor: colors.secondary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  qrText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
    position: "absolute",
    bottom: -18,
    width: 80,
    textAlign: "center",
  },
  actionGrid: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridAction: {
    alignItems: "center",
    width: 60,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  gridLabel: {
    fontSize: 10,
    color: "#555",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 15,
  },
  promoCard: {
    width: 250,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  promoTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 5,
  },
  promoText: {
    fontSize: 12,
    color: "#666",
  },
  contactItem: {
    alignItems: "center",
    marginRight: 15,
    width: 60,
  },
  contactName: {
    fontSize: 11,
    marginTop: 5,
    color: colors.text,
    textAlign: "center",
  },
  addContactBtn: {
    alignItems: "center",
    marginRight: 15,
    width: 60,
  },
  addContactIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContacts: {
    alignItems: "center",
    padding: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  txIconCtx: {
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
});

export default DashboardScreen;
