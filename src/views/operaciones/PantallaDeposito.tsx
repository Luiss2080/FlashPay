import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { Text, TextInput, Button, Card, RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/theme";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const PantallaDeposito = () => {
  const navigation = useNavigation<any>();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Card details state (mock)
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Ingresa un monto válido");
      return;
    }

    if (method === "card" && (!cardNumber || !expiry || !cvv)) {
      Alert.alert("Error", "Completa los datos de la tarjeta");
      return;
    }

    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);

        // Only 'card' method executes immediately. 'code' would generate a code.
        if (method === "code") {
          setLoading(false);
          Alert.alert(
            "Código Generado",
            "Tu código CIP es: 12345678. Paga en cualquier agente bancario.",
            [{ text: "Entendido", onPress: () => navigation.goBack() }],
          );
          return;
        }

        const response = await api.post("/api/deposit", {
          id_usuario: user.id_usuario,
          monto: parseFloat(amount),
          metodo: method,
        });

        if (response.data.status === "success") {
          Alert.alert(
            "¡Depósito Exitoso!",
            `Has ingresado S/ ${parseFloat(amount).toFixed(2)} a tu cuenta.`,
            [{ text: "Genial", onPress: () => navigation.navigate("Inicio") }],
          );
        } else {
          Alert.alert("Error", response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo procesar el depósito");
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>Ingresar Dinero</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>¿Cuánto deseas ingresar?</Text>
        <TextInput
          mode="outlined"
          label="Monto (S/)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          left={<TextInput.Icon icon="cash" />}
        />

        <Text style={styles.label}>Método de Pago</Text>
        <View style={styles.methodContainer}>
          <TouchableOpacity
            style={[
              styles.methodOption,
              method === "card" && styles.methodActive,
            ]}
            onPress={() => setMethod("card")}
          >
            <Ionicons
              name="card"
              size={24}
              color={method === "card" ? colors.primary : "#888"}
            />
            <Text
              style={[
                styles.methodText,
                method === "card" && styles.textActive,
              ]}
            >
              Tarjeta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodOption,
              method === "code" && styles.methodActive,
            ]}
            onPress={() => setMethod("code")}
          >
            <Ionicons
              name="qr-code"
              size={24}
              color={method === "code" ? colors.primary : "#888"}
            />
            <Text
              style={[
                styles.methodText,
                method === "code" && styles.textActive,
              ]}
            >
              Código Pago
            </Text>
          </TouchableOpacity>
        </View>

        {method === "card" && (
          <Card style={styles.cardForm}>
            <Card.Content>
              <TextInput
                label="Número de Tarjeta"
                mode="flat"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={16}
                style={styles.cardInput}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  label="MM/AA"
                  mode="flat"
                  value={expiry}
                  onChangeText={setExpiry}
                  style={[styles.cardInput, { width: "48%" }]}
                />
                <TextInput
                  label="CVV"
                  mode="flat"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  style={[styles.cardInput, { width: "48%" }]}
                />
              </View>
            </Card.Content>
          </Card>
        )}

        {method === "code" && (
          <View style={styles.infoBox}>
            <Text style={{ color: "#666" }}>
              Generaremos un código de pago (CIP) que podrás pagar en agentes
              BCP, Interbank, BBVA y más.
            </Text>
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleDeposit}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          {method === "card" ? "Pagar e Ingresar" : "Generar Código"}
        </Button>
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: colors.text,
  },
  input: {
    backgroundColor: "white",
    marginBottom: 20,
  },
  methodContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  methodOption: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "white",
  },
  methodActive: {
    borderColor: colors.primary,
    backgroundColor: "#F0F4FF",
  },
  methodText: {
    marginTop: 5,
    color: "#888",
    fontWeight: "600",
  },
  textActive: {
    color: colors.primary,
  },
  cardForm: {
    marginBottom: 20,
    backgroundColor: "white",
  },
  cardInput: {
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  infoBox: {
    padding: 15,
    backgroundColor: "#E3E3E3",
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 6,
    marginTop: 10,
  },
});

export default PantallaDeposito;
