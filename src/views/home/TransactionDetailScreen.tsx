import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Button, Surface, List, Divider } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const TransactionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { transaction } = route.params || {};
  const [sharing, setSharing] = useState(false);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text>No se encontró la transacción</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  const isIngreso = transaction.direccion === "ingreso";

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
              <div class="success">Comprobante de Operación</div>
            </div>
            
            <div class="amount-box">
              <div class="label">Monto</div>
              <div class="amount">S/ ${parseFloat(transaction.monto).toFixed(2)}</div>
            </div>

            <div class="details">
              <div class="label">Tipo de Movimiento</div>
              <div class="value">${transaction.tipo.toUpperCase()}</div>

              <div class="label">${isIngreso ? "De" : "Para"}</div>
              <div class="value">${transaction.otro_usuario_nombre || "Sistema"}</div>

              <div class="label">Fecha y Hora</div>
              <div class="value">${new Date(transaction.fecha).toLocaleString()}</div>

              <div class="label">Nro. Operación</div>
              <div class="value">Tx-${transaction.id_transaccion}</div>
              
              <div class="label">Descripción</div>
              <div class="value">${transaction.descripcion || "Sin descripción"}</div>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Detalle del Movimiento</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.card}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: isIngreso ? "#E8F5E9" : "#FFEBEE" },
            ]}
          >
            <Ionicons
              name={isIngreso ? "arrow-down" : "arrow-up"}
              size={40}
              color={isIngreso ? colors.success : colors.error}
            />
          </View>

          <Text style={styles.amount}>
            {isIngreso ? "+" : "-"} S/{" "}
            {parseFloat(transaction.monto).toFixed(2)}
          </Text>
          <Text style={styles.status}>Operación Exitosa</Text>

          <Divider style={{ width: "100%", marginVertical: 20 }} />

          <View style={styles.row}>
            <Text style={styles.label}>Fecha</Text>
            <Text style={styles.value}>
              {new Date(transaction.fecha).toLocaleString()}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{isIngreso ? "Origen" : "Destino"}</Text>
            <Text style={styles.value}>
              {transaction.otro_usuario_nombre || "Sistema"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo</Text>
            <Text style={styles.value}>{transaction.tipo}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>ID Transacción</Text>
            <Text style={styles.value}>{transaction.id_transaccion}</Text>
          </View>
        </Surface>

        <Button
          mode="contained"
          icon="share-variant"
          onPress={generateAndSharePDF}
          loading={sharing}
          style={styles.shareButton}
        >
          Compartir Comprobante
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate("SupportTicket")}
          textColor={colors.error}
          style={{ marginTop: 10 }}
        >
          Reportar un problema
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
    padding: 20,
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    alignItems: "center",
    elevation: 2,
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
  },
  status: {
    color: colors.success,
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  label: {
    color: "#888",
    fontSize: 14,
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
    maxWidth: "60%",
    textAlign: "right",
  },
  shareButton: {
    backgroundColor: colors.secondary,
    width: "100%",
    paddingVertical: 5,
  },
});

export default TransactionDetailScreen;
