import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { Text, Button, Avatar, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import api from "../../services/api";
import { colors } from "../../utils/theme";

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Actualizar datos frescos
        const response = await api.get(
          `/home_data.php?id_usuario=${parsedUser.id_usuario}`,
        );
        if (response.data.status === "success") {
          setUser(response.data.data.user);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri:
              "https://ui-avatars.com/api/?name=" +
              (user?.nombre || "User") +
              "&background=random&size=200",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.nombre}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.phone}>{user?.telefono}</Text>
      </View>

      <Card style={styles.qrCard}>
        <Card.Content style={styles.qrContent}>
          <Text style={styles.qrLabel}>Mi Código QR</Text>
          {user?.codigo_qr ? (
            <QRCode value={user.codigo_qr} size={200} />
          ) : (
            <Text>Cargando QR...</Text>
          )}
          <Text style={styles.qrHint}>
            Muestra este código para recibir dinero
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={logout}
        style={styles.logoutButton}
        icon="logout"
      >
        Cerrar Sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  phone: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
    marginTop: 5,
  },
  qrCard: {
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 4,
    marginBottom: 30,
  },
  qrContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  qrLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
  },
  qrHint: {
    color: "#888",
    marginTop: 15,
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: colors.error,
  },
});

export default ProfileScreen;
