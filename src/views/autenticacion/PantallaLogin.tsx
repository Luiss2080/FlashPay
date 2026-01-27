import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hapticFeedback } from "../../utils/haptics";
import * as LocalAuthentication from "expo-local-authentication";

const PantallaLogin = () => {
  // ... (content implied, just changing declaration line)
  // ...
  export default PantallaLogin;
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  useEffect(() => {
    checkOnboarding();
    checkBiometrics();
  }, []);

  const checkOnboarding = async () => {
    const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
    if (!hasSeen) {
      navigation.replace("Onboarding");
    }
  };

  const checkBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometrics(compatible && enrolled);
  };
  const handleBiometricLogin = async () => {
    hapticFeedback.light();
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Ingresa a FlashPay",
      fallbackLabel: "Usar contraseña",
    });

    if (result.success) {
      hapticFeedback.success();
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        navigation.replace("Home");
      } else {
        hapticFeedback.warning();
        Alert.alert("Aviso", "Inicia sesión primero para habilitar biometría");
      }
    } else {
      hapticFeedback.error();
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email inválido")
        .required("El email es obligatorio"),
      password: Yup.string().required("La contraseña es obligatoria"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      hapticFeedback.light();
      try {
        const response = await api.post("/auth/login", values);
        if (response.data.status === "success") {
          hapticFeedback.success();
          await AsyncStorage.setItem("userToken", response.data.token);
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify(response.data.user),
          );
          Alert.alert("Éxito", "Bienvenido a FlashPay");
          navigation.replace("Home");
        } else {
          hapticFeedback.error();
          Alert.alert(
            "Error",
            response.data.message || "Credenciales incorrectas",
          );
        }
      } catch (error: any) {
        console.error("Login Error:", error);
        let errorMessage = "Error de conexión";
        if (error.response) {
          errorMessage =
            error.response.data.message || `Error ${error.response.status}`;
        }
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <View style={styles.container}>
      <Title style={styles.title}>FlashPay Login</Title>

      <TextInput
        label="Email"
        value={formik.values.email}
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        error={formik.touched.email && Boolean(formik.errors.email)}
      />
      {formik.touched.email && formik.errors.email && (
        <Text style={styles.errorText}>{formik.errors.email}</Text>
      )}

      <TextInput
        label="Contraseña"
        value={formik.values.password}
        onChangeText={formik.handleChange("password")}
        onBlur={formik.handleBlur("password")}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        error={formik.touched.password && Boolean(formik.errors.password)}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text
          style={{
            textAlign: "right",
            color: "#666",
            marginBottom: 20,
            marginTop: 5,
          }}
        >
          ¿Olvidaste tu contraseña?
        </Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        onPress={() => formik.handleSubmit()}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Ingresar
      </Button>

      {hasBiometrics && (
        <Button
          icon="fingerprint"
          mode="outlined"
          onPress={handleBiometricLogin}
          style={{ marginTop: 10, borderColor: "#6200ee" }}
        >
          Ingresar con Huella/FaceID
        </Button>
      )}

      <Button
        mode="text"
        onPress={() => navigation.navigate("Register")}
        style={styles.linkButton}
      >
        ¿No tienes cuenta? Regístrate
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#6200ee",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  linkButton: {
    marginTop: 15,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
});

export default LoginScreen;
