import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/theme";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const TopUpScreen = () => {
  const navigation = useNavigation<any>();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("Claro");
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    if (!phone || !amount) {
      Alert.alert("Error", "Completa los campos");
      return;
    }
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await api.post("/topup.php", {
          id_usuario: user.id_usuario,
          telefono: phone,
          operador: operator,
          monto: parseFloat(amount),
        });

        if (response.data.status === "success") {
          Alert.alert("¡Recarga Exitosa!", response.data.message, [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("Error", response.data.message);
        }
      }
    } catch (error: any) {
      Alert.alert("Error", error.toString());
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
        <Text style={styles.title}>Recargas Móviles</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Operador</Text>
        <RadioButton.Group onValueChange={setOperator} value={operator}>
          <View style={styles.radioRow}>
            <View style={styles.radioItem}>
              <RadioButton value="Claro" />
              <Text>Claro</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="Movistar" />
              <Text>Movistar</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="Entel" />
              <Text>Entel</Text>
            </View>
          </View>
        </RadioButton.Group>

        <TextInput
          label="Número de Celular"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          mode="outlined"
          style={styles.input}
          right={<TextInput.Icon icon="contacts" />}
        />

        <Text style={styles.label}>Monto</Text>
        <View style={styles.amountOptions}>
          {[5, 10, 20, 30].map((val) => (
            <TouchableOpacity
              key={val}
              onPress={() => setAmount(val.toString())}
              style={[
                styles.amountChip,
                amount === val.toString() && styles.activeChip,
              ]}
            >
              <Text
                style={[
                  styles.amountText,
                  amount === val.toString() && styles.activeText,
                ]}
              >
                S/ {val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          label="Otro monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleTopUp}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Recargar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "white", fontSize: 18, fontWeight: "bold" },
  content: { padding: 20 },
  label: { fontSize: 16, color: "#555", marginBottom: 10, marginTop: 10 },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  radioItem: { flexDirection: "row", alignItems: "center" },
  input: { backgroundColor: "white", marginBottom: 15 },
  amountOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  amountChip: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    width: "22%",
    alignItems: "center",
  },
  activeChip: { backgroundColor: colors.primary },
  amountText: { color: colors.primary, fontWeight: "bold" },
  activeText: { color: "white" },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 5,
  },
});

export default TopUpScreen;
