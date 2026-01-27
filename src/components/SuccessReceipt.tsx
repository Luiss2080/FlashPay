import React, { useState } from "react";
import { View, StyleSheet, Modal, Share, Alert } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import { colors } from "../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

interface SuccessReceiptProps {
  visible: boolean;
  onClose: () => void;
  amount: string;
  receiver: string;
  message?: string;
  transactionId?: string; // Optional ID for credibility
  date?: string;
}

const SuccessReceipt = ({
  visible,
  onClose,
  amount,
  receiver,
  message,
  transactionId = "TX-" + Math.floor(Math.random() * 1000000),
  date = new Date().toLocaleString(),
}: SuccessReceiptProps) => {
  const [sharing, setSharing] = useState(false);

  const generateAndSharePDF = async () => {
    setSharing(true);
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 30px; font-weight: bold; color: ${colors.primary}; margin-bottom: 10px; }
              .success { color: ${colors.success}; font-size: 18px; font-weight: bold; }
              .amount-box { background: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
              .amount { font-size: 40px; font-weight: bold; color: ${colors.primary}; }
              .label { color: #888; font-size: 14px; margin-bottom: 5px; }
              .value { font-size: 18px; margin-bottom: 15px; font-weight: 500; }
              .footer { margin-top: 50px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #aaa; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">FlashPay</div>
              <div class="success">¡Transferencia Exitosa!</div>
            </div>
            
            <div class="amount-box">
              <div class="label">Monto Enviado</div>
              <div class="amount">S/ ${parseFloat(amount).toFixed(2)}</div>
            </div>

            <div class="details">
              <div class="label">Destinatario</div>
              <div class="value">${receiver}</div>

              <div class="label">Fecha y Hora</div>
              <div class="value">${date}</div>

              <div class="label">Nro. Operación</div>
              <div class="value">${transactionId}</div>
              
              ${message ? `<div class="label">Mensaje</div><div class="value">${message}</div>` : ""}
            </div>

            <div class="footer">
              Este comprobante es válido para confirmar la operación realizada a través de FlashPay.
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo generar el comprobante");
      console.error(error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <Surface style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="checkmark-circle"
              size={80}
              color={colors.success}
            />
          </View>
          <Text style={styles.title}>¡Yapeo Exitoso!</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.currency}>S/</Text>
            <Text style={styles.amount}>{parseFloat(amount).toFixed(2)}</Text>
          </View>

          <Text style={styles.receiverLabel}>Enviado a:</Text>
          <Text style={styles.receiverName}>{receiver}</Text>

          <Button
            mode="outlined"
            onPress={generateAndSharePDF}
            loading={sharing}
            icon="share-variant"
            style={[
              styles.button,
              { marginBottom: 10, borderColor: colors.secondary },
            ]}
            textColor={colors.secondary}
          >
            Compartir Comprobante
          </Button>

          <Button mode="contained" onPress={onClose} style={styles.button}>
            Volver al Inicio
          </Button>
        </Surface>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  currency: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 5,
    marginRight: 2,
  },
  amount: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.text,
  },
  receiverLabel: {
    color: "#888",
    marginTop: 10,
    fontSize: 14,
  },
  receiverName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 30,
  },
  button: {
    width: "100%",
    paddingVertical: 5,
    backgroundColor: colors.secondary,
  },
});

export default SuccessReceipt;
