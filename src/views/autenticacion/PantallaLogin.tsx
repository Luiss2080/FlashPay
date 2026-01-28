import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hapticFeedback } from "../../utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../utils/theme";
import * as LocalAuthentication from "expo-local-authentication";

const PantallaLogin = () => {
  // ... (content implied, just changing declaration line)
  // ...
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
      <View style={styles.logoContainer}>
        <Ionicons name="wallet" size={120} color="white" />
        <Text style={styles.appName}>FlashPay</Text>
        <Text style={styles.appTagline}>Tu billetera digital</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Email"
          value={formik.values.email}
          onChangeText={formik.handleChange("email")}
          onBlur={formik.handleBlur("email")}
          mode="flat"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          textColor="#333"
          underlineColor="transparent"
          activeUnderlineColor={colors.secondary}
          error={formik.touched.email && Boolean(formik.errors.email)}
          left={<TextInput.Icon icon="email" color="#777" />}
        />
        {formik.touched.email && formik.errors.email && (
          <Text style={styles.errorText}>{formik.errors.email}</Text>
        )}

        <TextInput
          label="Contraseña"
          value={formik.values.password}
          onChangeText={formik.handleChange("password")}
          onBlur={formik.handleBlur("password")}
          mode="flat"
          style={styles.input}
          secureTextEntry
          textColor="#333"
          underlineColor="transparent"
          activeUnderlineColor={colors.secondary}
          error={formik.touched.password && Boolean(formik.errors.password)}
          left={<TextInput.Icon icon="lock" color="#777" />}
        />
        {formik.touched.password && formik.errors.password && (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <Button
          mode="contained"
          onPress={() => formik.handleSubmit()}
          loading={loading}
          disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          INGRESAR
        </Button>

        {hasBiometrics && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricLogin}
          >
            <Ionicons name="finger-print" size={35} color="white" />
            <Text style={styles.biometricText}>Ingresar con Huella/Rostro</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // MORADO INTENSO
  },
  logoContainer: {
    flex: 0.45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  appName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    letterSpacing: 0.5,
  },
  formContainer: {
    flex: 0.55,
    paddingHorizontal: 30,
    justifyContent: "flex-start",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 55,
    justifyContent: "center",
    elevation: 2,
  },
  errorText: {
    color: "#ffcdd2", // Light red for visibility on purple (though inputs are white, checking context)
    // Wait, errors are usually below inputs. If background is purple, red might be hard to see?
    // Actually inputs are white background. Errors below inputs...
    // Let's make error text white/yellow for contrast on purple background?
    // User requested "all views purple".
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
    fontWeight: "bold",
  },
  forgotPassword: {
    textAlign: "right",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 25,
    marginTop: 5,
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.secondary, // Turquesa/Greenish contrasting with Purple
    paddingVertical: 6,
    borderRadius: 30, // Highly rounded buttons like Yape
    elevation: 4,
    width: "100%",
  },
  buttonLabel: {
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  biometricText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 15,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    color: "rgba(255,255,255,0.7)",
    marginRight: 5,
  },
  registerText: {
    color: colors.secondary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default PantallaLogin;
