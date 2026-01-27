import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Dimensions,
  Alert,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";

const QRScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    try {
      // Consultar API para ver de quién es el QR
      const response = await api.get(`/api/resolve-qr?code=${data}`);
      if (response.data.status === "success") {
        const user = response.data.data;
        Alert.alert("Usuario Encontrado", `¿Transferir a ${user.nombre}?`, [
          {
            text: "Cancelar",
            onPress: () => setScanned(false),
            style: "cancel",
          },
          {
            text: "Sí, Transferir",
            onPress: () => {
              // Navegar a Transfer con datos prellenados
              // Nota: Necesitamos actualizar TransferScreen para recibir params
              navigation.navigate("Transfer", {
                phone: user.telefono,
              });
              setScanned(false);
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Código QR no reconocido", [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar el código", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Solicitando permiso de cámara...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No tienes acceso a la cámara</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button
          title={"Toca para Escanear de Nuevo"}
          onPress={() => setScanned(false)}
        />
      )}
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.instruction}>Apunta al código QR de FlashPay</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
    marginBottom: 20,
  },
  instruction: {
    color: "white",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 5,
  },
});

export default QRScanScreen;
