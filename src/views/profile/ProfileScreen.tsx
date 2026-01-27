import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import {
  Text,
  Avatar,
  List,
  Switch,
  Button,
  Divider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  useEffect(() => {
    loadProfile();
    checkBiometrics();
  }, []);

  const loadProfile = async () => {
    const storedUser = await AsyncStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const bio = await AsyncStorage.getItem("biometricsEnabled");
    setBiometricsEnabled(bio === "true");
  };

  const checkBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setHasBiometrics(compatible);
  };

  const toggleBiometrics = async () => {
    const newValue = !biometricsEnabled;
    setBiometricsEnabled(newValue);
    await AsyncStorage.setItem("biometricsEnabled", newValue.toString());
  };

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        onPress: async () => {
          await AsyncStorage.removeItem("userToken");
          await AsyncStorage.removeItem("userData");
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <Ionicons
          name="settings-outline"
          size={24}
          color="white"
          onPress={() => {}}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Avatar.Text
            size={80}
            label={user.nombre.substring(0, 2).toUpperCase()}
            style={{ backgroundColor: colors.secondary, marginBottom: 10 }}
            color="white"
          />
          <Text style={styles.name}>{user.nombre}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.phone}>{user.telefono}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          {hasBiometrics && (
            <List.Item
              title="Ingreso con Biometría"
              description="Usar Huella o FaceID para entrar"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="fingerprint"
                  color={colors.primary}
                />
              )}
              right={() => (
                <Switch
                  value={biometricsEnabled}
                  onValueChange={toggleBiometrics}
                  color={colors.secondary}
                />
              )}
            />
          )}
          <Divider />
          <List.Item
            title="Cambiar Contraseña"
            left={(props) => (
              <List.Icon {...props} icon="lock-reset" color={colors.primary} />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayuda</Text>
          <List.Item
            title="Centro de Ayuda"
            left={(props) => (
              <List.Icon
                {...props}
                icon="help-circle-outline"
                color={colors.primary}
              />
            )}
            onPress={() => navigation.navigate("Help")} // Assuming Help exists or we create it
          />
          <List.Item
            title="Términos y Condiciones"
            left={(props) => (
              <List.Icon
                {...props}
                icon="file-document-outline"
                color={colors.primary}
              />
            )}
            onPress={() => {}}
          />
        </View>

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={colors.error}
        >
          Cerrar Sesión
        </Button>
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
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "white",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
  },
  email: {
    color: "#666",
    fontSize: 14,
  },
  phone: {
    color: "#888",
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    backgroundColor: "white",
    marginBottom: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    marginLeft: 15,
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  logoutButton: {
    margin: 20,
    borderColor: colors.error,
    borderWidth: 1,
  },
});

export default ProfileScreen;
