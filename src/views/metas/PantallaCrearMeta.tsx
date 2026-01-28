import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput, Button, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";

const ICONS = [
  "piggy-bank",
  "airplane",
  "car",
  "home",
  "laptop",
  "cart",
  "gift",
  "beer",
];

const PantallaCrearMeta = () => {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("piggy-bank");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !amount) {
      Alert.alert("Error", "Completa el nombre y el monto");
      return;
    }

    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await api.post("/api/metas", {
          user_id: user.id_usuario,
          title,
          target_amount: parseFloat(amount),
          icon: selectedIcon,
        });

        if (response.data.status === "success") {
          navigation.goBack();
        } else {
          Alert.alert("Error", "No se pudo crear la meta");
        }
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Ocurrió un problema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="close"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Nueva Meta</Text>
        <Ionicons
          name="checkmark"
          size={24}
          color="white"
          onPress={handleCreate}
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Nombre de la meta</Text>
        <TextInput
          mode="outlined"
          placeholder="Ej. Viaje a Cancún"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <Text style={styles.label}>Monto objetivo</Text>
        <TextInput
          mode="outlined"
          placeholder="0.00"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          left={<TextInput.Affix text="S/ " />}
          style={styles.input}
        />

        <Text style={styles.label}>Icono</Text>
        <View style={styles.iconGrid}>
          {ICONS.map((icon) => (
            <TouchableOpacity
              key={icon}
              style={[
                styles.iconItem,
                selectedIcon === icon && styles.selectedIcon,
              ]}
              onPress={() => setSelectedIcon(icon)}
            >
              <Ionicons
                name={icon as any}
                size={24}
                color={selectedIcon === icon ? "white" : colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={loading}
          style={styles.button}
        >
          Crear Meta
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
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: "white",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  iconItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedIcon: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  button: {
    marginTop: 40,
    backgroundColor: colors.secondary,
    paddingVertical: 5,
  },
});

export default PantallaCrearMeta;
