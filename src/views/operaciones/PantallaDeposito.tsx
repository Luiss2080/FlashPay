import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  RadioButton,
  ActivityIndicator,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/theme";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";

const PantallaDeposito = () => {
  const navigation = useNavigation<any>();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card"); // card, code, agent, receipt
  const [loading, setLoading] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Receipt upload state
  const [image, setImage] = useState<string | null>(null);

  // Agent/Code state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const copyToClipboard = async () => {
    if (generatedCode) {
      await Clipboard.setStringAsync(generatedCode);
      Alert.alert("Copiado", "Código copiado al portapapeles");
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Ingresa un monto válido");
      return;
    }

    if (method === "card" && (!cardNumber || !expiry || !cvv)) {
      Alert.alert("Error", "Completa los datos de la tarjeta");
      return;
    }

    if (method === "receipt" && !image) {
      Alert.alert("Error", "Debes adjuntar una foto del comprobante");
      return;
    }

    setLoading(true);

    try {
      // Mocking API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const storedUser = await AsyncStorage.getItem("userData");
      // In a real app we would use user data here

      if (method === "code") {
        setLoading(false);
        setGeneratedCode("12345678"); // Mock code
        return;
      }

      // For agents, we just show map/info, maybe no action needed other than "Find Agent"
      if (method === "agent") {
        setLoading(false);
        Alert.alert("Agentes", "Mostrando agentes cercanos (Simulado)");
        return;
      }

      // Success for Card or Receipt Upload
      // In real app, receipt upload would be a multipart/form-data request

      navigation.navigate("Comprobante", {
        amount: parseFloat(amount),
        date: new Date().toLocaleString(),
        transactionId: "DEP-" + Math.floor(Math.random() * 1000000),
        recipient: "Mi Billetera",
        type: "DEPOSITO",
        status: method === "receipt" ? "PENDIENTE" : "EXITOSO", // Receipts need manual review usually
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo procesar el depósito");
    } finally {
      setLoading(false);
    }
  };

  const renderMethodIcon = (id: string, icon: any, label: string) => (
    <TouchableOpacity
      style={[styles.methodOption, method === id && styles.methodActive]}
      onPress={() => {
        setMethod(id);
        setGeneratedCode(null);
      }}
    >
      <Ionicons
        name={icon}
        size={24}
        color={method === id ? colors.primary : "#888"}
      />
      <Text style={[styles.methodText, method === id && styles.textActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Provider>
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

        <ScrollView contentContainerStyle={styles.content}>
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
          <View style={styles.methodsGrid}>
            {renderMethodIcon("card", "card", "Tarjeta")}
            {renderMethodIcon("code", "qr-code", "Código")}
            {renderMethodIcon("receipt", "image", "Comprobante")}
            {renderMethodIcon("agent", "map", "Agente")}
          </View>

          {/* CARD FORM */}
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
                <View style={styles.row}>
                  <TextInput
                    label="MM/AA"
                    mode="flat"
                    value={expiry}
                    onChangeText={setExpiry}
                    style={[styles.cardInput, styles.halfInput]}
                  />
                  <TextInput
                    label="CVV"
                    mode="flat"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                    style={[styles.cardInput, styles.halfInput]}
                  />
                </View>
              </Card.Content>
            </Card>
          )}

          {/* CODE GENERATION */}
          {method === "code" && (
            <View>
              {!generatedCode ? (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    Genera un código CIP único para pagar en efectivo en
                    cualquier agente bancario (BCP, Interbank, BBVA, etc).
                  </Text>
                </View>
              ) : (
                <View style={styles.ticket}>
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketTitle}>CÓDIGO DE PAGO</Text>
                  </View>
                  <View style={styles.ticketBody}>
                    <Text style={styles.ticketCode}>{generatedCode}</Text>
                    <TouchableOpacity onPress={copyToClipboard}>
                      <Text style={styles.copyLink}>Copiar Código</Text>
                    </TouchableOpacity>
                    <View style={styles.ticketRow}>
                      <Text>Monto:</Text>
                      <Text style={styles.ticketValue}>
                        S/ {parseFloat(amount || "0").toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.ticketRow}>
                      <Text>Empresa:</Text>
                      <Text style={styles.ticketValue}>FlashPay</Text>
                    </View>
                    <Text style={styles.ticketFooter}>
                      Muestra este código al cajero
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* RECEIPT UPLOAD */}
          {method === "receipt" && (
            <View style={styles.uploadContainer}>
              <Text style={styles.infoText}>
                Si ya realizaste una transferencia bancaria a nuestras cuentas,
                adjunta la captura aquí.
              </Text>

              <TouchableOpacity onPress={pickImage} style={styles.uploadBox}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <>
                    <Ionicons
                      name="cloud-upload"
                      size={40}
                      color={colors.primary}
                    />
                    <Text style={styles.uploadText}>
                      Toca para subir imagen
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* AGENT MAP MOCK */}
          {method === "agent" && (
            <View style={styles.agentContainer}>
              <Image
                source={{
                  uri: "https://developers.google.com/static/maps/documentation/android-sdk/images/google_map_minimal.png",
                }}
                style={styles.mockMap}
              />
              <Text style={styles.mapLabel}>
                Mostrando agentes FlashPay cercanos
              </Text>
            </View>
          )}

          <Button
            mode="contained"
            onPress={handleDeposit}
            loading={loading}
            disabled={loading || (method === "code" && !!generatedCode)}
            style={styles.button}
          >
            {method === "card"
              ? "Pagar e Ingresar"
              : method === "code"
                ? generatedCode
                  ? "Código Generado"
                  : "Generar Código"
                : method === "receipt"
                  ? "Enviar Comprobante"
                  : "Buscar Agentes"}
          </Button>
        </ScrollView>
      </View>
    </Provider>
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
    paddingBottom: 50,
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
  methodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  methodOption: {
    width: "48%",
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 10,
  },
  methodActive: {
    borderColor: colors.secondary,
    backgroundColor: "white",
  },
  methodText: {
    marginTop: 5,
    color: "rgba(255,255,255,0.7)",
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  infoBox: {
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    color: "white",
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 6,
    marginTop: 10,
  },
  // Ticket Styles
  ticket: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  ticketHeader: {
    backgroundColor: colors.primaryDark,
    padding: 10,
    alignItems: "center",
  },
  ticketTitle: {
    color: "white",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  ticketBody: {
    padding: 20,
    alignItems: "center",
  },
  ticketCode: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 5,
  },
  copyLink: {
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 20,
  },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  ticketValue: {
    fontWeight: "bold",
  },
  ticketFooter: {
    marginTop: 15,
    fontSize: 12,
    color: "#888",
  },
  // Upload Styles
  uploadContainer: {
    marginBottom: 20,
  },
  uploadBox: {
    height: 150,
    borderWidth: 2,
    borderColor: "white",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  uploadText: {
    color: "white",
    marginTop: 10,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  // Map Styles
  agentContainer: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  mockMap: {
    width: "100%",
    height: "100%",
  },
  mapLabel: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
});

export default PantallaDeposito;
