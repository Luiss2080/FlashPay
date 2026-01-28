import React, { useState, useEffect } from "react";
import { View, StyleSheet, Switch, Alert } from "react-native";
import { Text, List } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { FadeInView } from "../../components/common/FadeInView";

const PantallaPersonalizacion = () => {
  const navigation = useNavigation<any>();
  const [hideBalance, setHideBalance] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const hideVal = await AsyncStorage.getItem("setting_hideBalance");
      setHideBalance(hideVal === "true");

      const darkVal = await AsyncStorage.getItem("setting_darkMode");
      setDarkMode(darkVal === "true");
    } catch (e) {
      console.error(e);
    }
  };

  const toggleHideBalance = async (val: boolean) => {
    setHideBalance(val);
    await AsyncStorage.setItem("setting_hideBalance", String(val));
    // Could dispatch an event or rely on focus effect in Home
  };

  const toggleDarkMode = async (val: boolean) => {
    setDarkMode(val);
    await AsyncStorage.setItem("setting_darkMode", String(val));
    if (val) {
      Alert.alert(
        "Tema Oscuro",
        "El tema oscuro se aplicará en el próximo reinicio de la app (Simulado).",
      );
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
        <Text style={styles.title}>Personalización</Text>
        <View style={{ width: 24 }} />
      </View>

      <FadeInView style={styles.content}>
        <List.Section>
          <List.Subheader style={{ color: "white" }}>Privacidad</List.Subheader>
          <List.Item
            title="Ocultar Saldo al Iniciar"
            description="Muestra ***.** por defecto en el inicio"
            descriptionStyle={{ color: "#ccc" }}
            titleStyle={{ color: "white", fontWeight: "bold" }}
            right={() => (
              <Switch
                value={hideBalance}
                onValueChange={toggleHideBalance}
                trackColor={{ false: "#767577", true: colors.accent }}
                thumbColor={hideBalance ? "#ffffff" : "#f4f3f4"}
              />
            )}
            style={styles.item}
          />
        </List.Section>

        <List.Section>
          <List.Subheader style={{ color: "white" }}>Apariencia</List.Subheader>
          <List.Item
            title="Tema Oscuro"
            description="Cambiar a modo noche (Beta)"
            descriptionStyle={{ color: "#ccc" }}
            titleStyle={{ color: "white", fontWeight: "bold" }}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: "#767577", true: colors.accent }}
                thumbColor={darkMode ? "#ffffff" : "#f4f3f4"}
              />
            )}
            style={styles.item}
          />
        </List.Section>
      </FadeInView>
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
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  item: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    marginBottom: 10,
    paddingVertical: 8,
  },
});

export default PantallaPersonalizacion;
