import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import SuccessReceipt from "../../components/SuccessReceipt";

const TransferScreen = () => {
  const navigation = useNavigation<any>();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleTransfer = async () => {
    if (!phone || !amount) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);

      const response = await api.post("/transfer.php", {
        id_emisor: user.id_usuario,
        telefono: phone,
        monto: parseFloat(amount),
      });

      if (response.data.status === "success") {
        setShowReceipt(true);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error: any) {
      let msg = "Error de conexión";
      if (error.response && error.response.data) {
        msg = error.response.data.message || msg;
      }
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SuccessReceipt
        visible={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          navigation.navigate("Inicio");
        }}
        amount={amount}
        receiver={phone}
        message="Transferencia FlashPay"
      />
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Transferir a contacto</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Número de celular</Text>
        <TextInput
          mode="outlined"
          placeholder="Ej. 987654321"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          left={<TextInput.Icon icon="phone" />}
        />

        <Text style={styles.label}>Monto a enviar</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.currency}>S/</Text>
          <TextInput
            mode="flat"
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.amountInput}
            contentStyle={{
              fontSize: 30,
              fontWeight: "bold",
              color: colors.primary,
            }}
            underlineColor="transparent"
          />
        </View>

        <Button
          mode="contained"
          onPress={handleTransfer}
          loading={loading}
          disabled={loading || !phone || !amount}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
        >
          Transferir
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
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "white",
    marginBottom: 20,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  currency: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    elevation: 4,
  },
});

export default TransferScreen;
