import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Switch,
  List,
  Divider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

const PantallaSeguridad = () => {
  const navigation = useNavigation<any>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [limit, setLimit] = useState("500");

  useEffect(() => {
    loadUser();
    checkBiometrics();
    loadLimits();
  }, []);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("userData");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id_usuario);
    }
    const bio = await AsyncStorage.getItem("biometricsEnabled");
    setBiometricsEnabled(bio === "true");
  };

  const loadLimits = async () => {
    try {
      const response = await api.get("/api/user/limits");
      if (response.data.status === "success") {
        setLimit(response.data.limits.daily_transfer.toString());
      }
    } catch (error) {
      console.error(error);
    }
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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "las nuevas contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/user/password", {
        user_id: userId,
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (response.data.status === "success") {
        Alert.alert("Éxito", "Contraseña actualizada correctamente", [
          {
            text: "OK",
            onPress: () => {
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const updateLimit = async () => {
    // Mock update
    Alert.alert("Límites", "Límite actualizado correctamente (Simulado).");
    // In real app: await api.post("/api/user/limits", { limit });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Seguridad</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biometría</Text>
          {hasBiometrics ? (
            <List.Item
              title="Ingreso con Biometría"
              description="Usar Huella o FaceID"
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
          ) : (
            <Text style={{ padding: 15, color: "#666" }}>
              Este dispositivo no soporta biometría.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Límites de Transacción</Text>
          <View style={{ paddingHorizontal: 15, paddingBottom: 15 }}>
            <Text style={{ marginBottom: 10, color: "#555" }}>
              Límite Diario (S/)
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                value={limit}
                onChangeText={setLimit}
                mode="outlined"
                style={{ flex: 1, backgroundColor: "white", height: 40 }}
                keyboardType="numeric"
              />
              <Button
                mode="contained"
                style={{ marginLeft: 10, backgroundColor: colors.secondary }}
                onPress={updateLimit}
              >
                Guardar
              </Button>
            </View>
          </View>
        </View>

        <Divider style={{ marginVertical: 20 }} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
          <TextInput
            label="Contraseña Actual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="Nueva Contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="Confirmar Nueva Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleChangePassword}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Actualizar Contraseña
          </Button>
        </View>
      </View>
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
    padding: 20,
  },
  section: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 1,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.secondary,
    paddingVertical: 6,
  },
});

export default PantallaSeguridad;
