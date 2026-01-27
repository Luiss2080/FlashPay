import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Text, Card, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";

const NotificationsScreen = () => {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await api.get(
          `/notifications.php?user_id=${user.id_usuario}`,
        );
        if (response.data.status === "success") {
          setNotifications(response.data.notifications);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card style={[styles.card, !item.leido && styles.unreadCard]}>
      <Card.Content style={styles.cardContent}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: item.tipo === "promo" ? "#FCE4EC" : "#E3F2FD" },
          ]}
        >
          <Ionicons
            name={item.tipo === "promo" ? "pricetag" : "notifications"}
            size={24}
            color={item.tipo === "promo" ? colors.accent : colors.primary}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.message}>{item.mensaje}</Text>
          <Text style={styles.date}>
            {new Date(item.fecha).toLocaleString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} color={colors.primary} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_notificacion.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No tienes notificaciones.</Text>
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
    paddingTop: 40,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {
    padding: 20,
  },
  card: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 12,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.text,
  },
  message: {
    color: "#555",
    marginTop: 2,
    fontSize: 14,
  },
  date: {
    color: "#999",
    fontSize: 11,
    marginTop: 5,
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
  },
});

export default NotificationsScreen;
