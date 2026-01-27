import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
import { colors } from "../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface SuccessReceiptProps {
  visible: boolean;
  onClose: () => void;
  amount: string;
  receiver: string;
  message?: string;
}

const SuccessReceipt = ({
  visible,
  onClose,
  amount,
  receiver,
  message,
}: SuccessReceiptProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
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

          {message && <Text style={styles.message}>"{message}"</Text>}

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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
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
    marginTop: 20,
    fontSize: 14,
  },
  receiverName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
  },
  message: {
    fontStyle: "italic",
    color: "#666",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    backgroundColor: colors.secondary,
    paddingVertical: 5,
  },
});

export default SuccessReceipt;
