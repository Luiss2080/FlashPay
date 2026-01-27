import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "../../utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    navigation.replace("Login");
  };

  return (
    <View style={styles.center}>
      <Text style={styles.text}>Perfil de Usuario</Text>
      <Button
        mode="contained"
        onPress={logout}
        style={{ marginTop: 20, backgroundColor: colors.error }}
      >
        Cerrar Sesión
      </Button>
    </View>
  );
};

export const TransferScreen = () => (
  <View style={styles.center}>
    <Text style={styles.text}>Transferir Dinero</Text>
    <Text style={{ color: "#888" }}>Próximamente...</Text>
  </View>
);

export const QRScanScreen = () => (
  <View style={styles.center}>
    <Text style={styles.text}>Escáner QR</Text>
    <Text style={{ color: "#888" }}>Cámara desactivada por defecto</Text>
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  text: { fontSize: 20, fontWeight: "bold", color: colors.text },
});
