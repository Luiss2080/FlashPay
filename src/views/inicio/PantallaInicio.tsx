import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Button, Card, Avatar, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { getAvatarColor, getInitials } from "../../utils/avatarUtils";
import { Skeleton } from "../../components/common/Skeleton";
import { hapticFeedback } from "../../utils/haptics";
import { FadeInView } from "../../components/common/FadeInView";

const PantallaInicio = () => {
  // ...
  const navigation = useNavigation<any>();
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  // ... (keep state)
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
      // Small delay to show smooth loading
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    hapticFeedback.light();
    setRefreshing(true);
    fetchDashboardData();
  };

  const toggleBalance = () => {
    hapticFeedback.selection();
    setShowBalance(!showBalance);
  };

  const promos = notifications.filter((n) => n.tipo === "promo");

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { height: 280 }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Skeleton variant="circle" width={40} height={40} />
            <Skeleton width={150} height={20} style={{ marginLeft: 10 }} />
          </View>
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Skeleton width={100} height={14} style={{ marginBottom: 10 }} />
            <Skeleton width={180} height={40} />
          </View>
        </View>
        <View style={[styles.actionsContainer, { marginTop: -60 }]}>
          <Skeleton width={80} height={80} variant="circle" />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              marginLeft: 15,
            }}
          >
            <Skeleton width={50} height={50} style={{ borderRadius: 12 }} />
            <Skeleton width={50} height={50} style={{ borderRadius: 12 }} />
            <Skeleton width={50} height={50} style={{ borderRadius: 12 }} />
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <Skeleton width={200} height={20} style={{ marginBottom: 15 }} />
          <View style={{ flexDirection: "row" }}>
            <Skeleton width={60} height={80} style={{ marginRight: 10 }} />
            <Skeleton width={60} height={80} style={{ marginRight: 10 }} />
            <Skeleton width={60} height={80} />
          </View>
          <Skeleton
            width={200}
            height={20}
            style={{ marginTop: 30, marginBottom: 15 }}
          />
          <Skeleton
            width="100%"
            height={70}
            style={{ marginBottom: 10, borderRadius: 12 }}
          />
          <Skeleton width="100%" height={70} style={{ borderRadius: 12 }} />
        </View>
      </View>
    );
  }

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header Gradient Style */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
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
          <TouchableOpacity style={styles.balanceRow} onPress={toggleBalance}>
            <Text style={styles.currencySymbol}>S/ </Text>
            <Text style={styles.balanceAmount}>
              {showBalance
                ? parseFloat(userData?.saldo || 0).toFixed(2)
                : "***.**"}
            </Text>
            <Ionicons
              name={showBalance ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="rgba(255,255,255,0.8)"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions Floating Card */}
      <FadeInView delay={100} style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.yapearButton}
          activeOpacity={0.8}
          onPress={() => {
            hapticFeedback.medium();
            navigation.navigate("QR");
          }}
        >
          <View style={styles.qrIconContainer}>
            <Ionicons name="qr-code" size={32} color="white" />
          </View>
          <Text style={styles.yapearText}>YAPEAR</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => {
              hapticFeedback.selection();
              navigation.navigate("Transfer");
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#E0F2F1" }]}>
              <Ionicons name="send" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.actionLabel}>Transferir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => {
              hapticFeedback.selection();
              navigation.navigate("Deposit");
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="wallet-outline" size={24} color="#F57C00" />
            </View>
            <Text style={styles.actionLabel}>Recargar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => {
              hapticFeedback.selection();
              navigation.navigate("Services");
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#E1F5FE" }]}>
              <Ionicons name="bulb-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Servicios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => {
              hapticFeedback.selection();
              navigation.navigate("Promos");
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FCE4EC" }]}>
              <Ionicons name="gift-outline" size={24} color={colors.accent} />
            </View>
            <Text style={styles.actionLabel}>Promos</Text>
          </TouchableOpacity>
        </View>
      </FadeInView>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <FadeInView delay={200}>
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
                    <Ionicons name="add" size={24} color="white" />
                  </View>
                  <Text style={styles.contactName}>Nuevo</Text>
                </TouchableOpacity>
                {contacts.map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.contactItem}
                    onPress={() =>
                      navigation.navigate("Transfer", {
                        phone: contact.telefono,
                      })
                    }
                  >
                    <Avatar.Text
                      size={45}
                      label={getInitials(contact.alias)}
                      style={{ backgroundColor: getAvatarColor(contact.alias) }}
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
            <Text style={styles.emptyText}>
              No tienes movimientos recientes.
            </Text>
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
                    name={
                      tx.direccion === "ingreso" ? "arrow-down" : "arrow-up"
                    }
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
        </FadeInView>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  // ... (keep avatar etc if needed, but we'll overwrite styles below)
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  greeting: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
    borderColor: colors.primary,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  balanceContainer: {
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
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
  actionsContainer: {
    marginTop: -55,
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  yapearButton: {
    backgroundColor: colors.accent, // A prominent pink/purple color
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 20,
  },
  qrIconContainer: {
    marginBottom: -5,
  },
  yapearText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 2,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)", // Glass-ish
    borderRadius: 20, // More rounded
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  actionItem: {
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 11,
    color: "#555",
    fontWeight: "500",
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
    borderColor: "white",
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
    color: colors.textDark,
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

export default PantallaInicio;
