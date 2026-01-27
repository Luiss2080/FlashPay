import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";

const PantallaRecuperarClave = () => {
  // ...
  export default PantallaRecuperarClave;
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Revisa tu correo",
        "Hemos enviado las instrucciones para restablecer tu contraseña.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="arrow-back"
        size={24}
        color={colors.primary}
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />

      <Title style={styles.title}>Recuperar Contraseña</Title>
      <Text style={styles.subtitle}>
        Ingresa tu correo electrónico y te enviaremos un enlace para crear una
        nueva contraseña.
      </Text>

      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleReset}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Enviar Instrucciones
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 6,
    backgroundColor: colors.primary,
  },
});

export default ForgotPasswordScreen;
