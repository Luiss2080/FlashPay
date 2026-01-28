import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Avatar,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import SuccessReceipt from "../../components/SuccessReceipt";

const PantallaTransferencia = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // Contact Selection
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.phone) {
      setPhone(route.params.phone);
    }
  }, [route.params]);

  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await api.get(
          `/api/contacts?user_id=${user.id_usuario}`,
        );
        if (response.data.status === "success") {
          setContacts(response.data.contacts);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleOpenContacts = () => {
    setShowContacts(true);
    fetchContacts();
  };

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

      const response = await api.post("/api/transfer", {
        id_emisor: user.id_usuario,
        telefono: phone,
        monto: parseFloat(amount),
      });

      if (response.data.status === "success") {
        setShowReceipt(true);
        // Add to contacts automatically if successful?
        // For now, let's keep it simple.
        saveContactIfNeeded(user.id_usuario, phone);
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

  const saveContactIfNeeded = async (userId: number, contactPhone: string) => {
    try {
      await api.post("/api/contacts", {
        user_id: userId,
        contact_phone: contactPhone,
        alias: "Nuevo Contacto", // Backend defaults to name if empty, but we send something
      });
    } catch (e) {
      // Ignore error if contact save fails, transfer was success
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
        <Text style={styles.headerTitle}>Yapear a...</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Número de celular</Text>
          <View style={styles.phoneInputContainer}>
            <TextInput
              mode="outlined"
              placeholder="Ej. 987654321"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={[styles.input, { flex: 1 }]}
            />
            <IconButton
              icon="account-box-outline"
              size={30}
              iconColor={colors.secondary}
              onPress={handleOpenContacts}
              style={{ marginBottom: 20 }}
            />
          </View>

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
            Yapear
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Contacts Modal */}
      <Modal
        visible={showContacts}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Contacto</Text>
            <TouchableOpacity onPress={() => setShowContacts(false)}>
              <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
          {contactsLoading ? (
            <ActivityIndicator
              style={{ marginTop: 50 }}
              color={colors.primary}
            />
          ) : (
            <ScrollView style={{ padding: 20 }}>
              {contacts.map((c, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.contactRow}
                  onPress={() => {
                    setPhone(c.telefono);
                    setShowContacts(false);
                  }}
                >
                  <Avatar.Text
                    size={40}
                    label={c.alias.substring(0, 2)}
                    style={{ backgroundColor: colors.secondary }}
                    color="white"
                  />
                  <View style={{ marginLeft: 15 }}>
                    <Text style={styles.contactName}>{c.alias}</Text>
                    <Text style={styles.contactPhone}>{c.telefono}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {contacts.length === 0 && (
                <Text
                  style={{ textAlign: "center", marginTop: 30, color: "#888" }}
                >
                  No tienes contactos guardados.
                </Text>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
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
    color: "white", // White on Purple
    marginBottom: 8,
    marginTop: 10,
  },
  // ...
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textDark, // Dark on White Modal
  },
  // ...
  contactName: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.textDark, // Dark on White Row
  },
  contactPhone: {
    color: "#888",
  },
});

export default PantallaTransferencia;
