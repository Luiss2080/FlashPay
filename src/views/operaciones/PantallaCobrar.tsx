import React, { useState, useEffect } from "react";
import { View, StyleSheet, Share, Alert } from "react-native";
import { Text, TextInput, Button, Card, IconButton } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { FadeInView } from "../../components/common/FadeInView";

const PantallaCobrar = () => {
  const navigation = useNavigation<any>();
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState<any>(null);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const stored = await AsyncStorage.getItem("userData");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      updateQR(u, "");
    }
  };

  const updateQR = (u: any, amt: string) => {
    // Format: "flashpay:USER_ID:AMOUNT:NAME"
    // Or JSON? Let's use a simple format "flashpayv1|ID|AMOUNT|NAME"
    // To be safe and handling names with spaces, JSON is better but takes more space.
    // Let's use JSON for robustness.
    const payload = {
      app: "flashpay",
      id: u.id_usuario,
      name: u.nombre,
      amount: amt ? parseFloat(amt) : 0,
    };
    setQrValue(JSON.stringify(payload));
  };

  const handleChangeAmount = (text: string) => {
    setAmount(text);
    if (user) {
      updateQR(user, text);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `¡Págame S/ ${amount || "0.00"} con FlashPay! Escanea mi QR.`,
      });
    } catch (error) {
      console.log(error);
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
        <Text style={styles.title}>Cobrar con QR</Text>
        <Ionicons
          name="share-social-outline"
          size={24}
          color="white"
          onPress={handleShare}
        />
      </View>

      <FadeInView style={styles.content}>
        <Card style={styles.qrCard}>
          <View style={styles.qrContainer}>
            {qrValue ? (
              <QRCode value={qrValue} size={200} />
            ) : (
              <View style={{ width: 200, height: 200 }} />
            )}
            <Text style={styles.qrLabel}>Escanea para pagar</Text>
            <Text style={styles.userName}>{user?.nombre}</Text>
          </View>
        </Card>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Monto a cobrar (Opcional)</Text>
          <TextInput
            mode="outlined"
            value={amount}
            onChangeText={handleChangeAmount}
            keyboardType="numeric"
            placeholder="0.00"
            left={<TextInput.Affix text="S/ " />}
            style={styles.input}
            contentStyle={{ fontSize: 24, fontWeight: "bold" }}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleShare}
          style={styles.shareButton}
          icon="share-variant"
        >
          Compartir Enlace de Cobro
        </Button>
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
    flex: 1,
    alignItems: "center",
  },
  qrCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    elevation: 4,
    width: "100%",
    maxWidth: 320,
    marginBottom: 30,
  },
  qrContainer: {
    alignItems: "center",
    padding: 10,
  },
  qrLabel: {
    marginTop: 15,
    color: "#666",
    fontSize: 14,
  },
  userName: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: "white",
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
  },
  shareButton: {
    backgroundColor: colors.accent,
    width: "100%",
    paddingVertical: 5,
  },
});

export default PantallaCobrar;
