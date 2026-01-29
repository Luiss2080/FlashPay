import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Share,
  Platform,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing"; // Use * as Sharing to avoid default export issues

interface ComprobanteParams {
  amount: number;
  date: string;
  transactionId: string;
  recipient: string;
  serviceName?: string;
  type: "DEPOSITO" | "SERVICIO" | "RECARGA" | "TRANSFERENCIA";
  status: "EXITOSO" | "PENDIENTE";
}

const PantallaComprobante = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as ComprobanteParams;
  const viewRef = useRef(null);

  const {
    amount = 0.0,
    date = new Date().toLocaleString(),
    transactionId = "TX-000000",
    recipient = "Usuario",
    serviceName = "",
    type = "OPERACIÓN",
    status = "EXITOSO",
  } = params || {};

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });

      if (Platform.OS === "web") {
        Alert.alert(
          "Compartir",
          "La función de compartir no está disponible en web.",
        );
        return;
      }

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error sharing receipt:", error);
      Alert.alert("Error", "No se pudo compartir el comprobante");
    }
  };

  const handleClose = () => {
    navigation.navigate("Dashboard"); // Or 'Inicio' depending on your route name
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View ref={viewRef} style={styles.receiptContainer} collapsable={false}>
          <View style={styles.successIconHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={50} color="white" />
            </View>
          </View>

          <Text style={styles.statusText}>
            ¡{type} {status}!
          </Text>
          <Text style={styles.dateText}>{date}</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.currency}>S/</Text>
            <Text style={styles.amount}>{Number(amount).toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Destino / Servicio</Text>
            <Text style={styles.detailValue}>{serviceName || recipient}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>N° de Operación</Text>
            <Text style={styles.detailValue}>{transactionId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Origen</Text>
            <Text style={styles.detailValue}>Mi Billetera FlashPay</Text>
          </View>

          <View style={styles.footer}>
            <ImageBackground
              source={require("../../../assets/icon.png")} // Make sure this exists or use a fallback
              style={styles.logoWatermark}
              imageStyle={{ opacity: 0.1 }}
            />
            <Text style={styles.footerText}>FlashPay</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={handleShare}
          style={styles.shareButton}
          icon="share-variant"
        >
          Compartir Comprobante
        </Button>
        <Button
          mode="outlined"
          onPress={handleClose}
          style={styles.closeButton}
          textColor={colors.primary}
        >
          Volver al Inicio
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  receiptContainer: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  successIconHeader: {
    marginBottom: 15,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50", // Success Green
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: 5,
    textAlign: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 25,
  },
  currency: {
    fontSize: 24,
    fontWeight: "500",
    color: colors.textDark,
    marginRight: 5,
  },
  amount: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.textDark,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#EEEEEE",
    marginBottom: 20,
  },
  detailRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: "#888",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textDark,
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  logoWatermark: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  footerText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  actionButtons: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  shareButton: {
    backgroundColor: colors.primary,
    marginBottom: 15,
    paddingVertical: 6,
  },
  closeButton: {
    borderColor: colors.primary,
    paddingVertical: 6,
  },
});

export default PantallaComprobante;
