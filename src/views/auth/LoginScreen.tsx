import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email inválido")
      .required("El email es requerido"),
    password: Yup.string()
      .min(6, "Mínimo 6 caracteres")
      .required("La contraseña es requerida"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await api.post("/login.php", values);
        if (response.data.status === "success") {
          await AsyncStorage.setItem("userToken", response.data.token);
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify(response.data.user),
          ); // Guardar datos de usuario
          Alert.alert("Éxito", "Bienvenido a FlashPay");
          navigation.replace("Home"); // Ir al Home y no poder volver atrás con back
        } else {
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

      <Button
        mode="contained"
        onPress={() => formik.handleSubmit()}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Ingresar
      </Button>

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
