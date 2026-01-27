import React, { useState, useEffect } from "react";
import { View, StyleSheet, Share } from "react-native";
import { Text, Card, Button, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { hapticFeedback } from "../../utils/haptics";
import { getAvatarColor, getInitials } from "../../utils/avatarUtils";

const ReceiveMoneyScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const handleShare = async () => {
    if (!user) return;
    hapticFeedback.selection();
    try {
      await Share.share({
        message: `¡Hola! Puedes yapearme usando mi código QR de FlashPay.\n\nMi ID de usuario es: ${user.id_usuario}`,
        title: "Recibir Dinero - FlashPay",
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  const qrValue = `flashpay://transfer?to=${user.id_usuario}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Cobrar con QR</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <Avatar.Text
              size={60}
              label={getInitials(user.nombre)}
              style={{
                backgroundColor: getAvatarColor(user.nombre),
                marginBottom: 10,
              }}
              color="white"
            />
            <Text style={styles.name}>{user.nombre}</Text>
            <Text style={styles.phone}>{user.telefono}</Text>
          </View>

          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={200}
              color="black"
              backgroundColor="white"
            />
          </View>

          <Text style={styles.instruction}>
            Muestra este código para recibir dinero al instante
          </Text>
        </View>

        <Button
          mode="contained"
          icon="share-variant"
          onPress={handleShare}
          style={styles.shareButton}
          contentStyle={{ height: 50 }}
        >
          Compartir mi código
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
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
    flex: 1,
    backgroundColor: "#F5F6FA",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  phone: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: "white",
  },
  instruction: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
  shareButton: {
    marginTop: 30,
    width: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 12,
  },
});

export default ReceiveMoneyScreen;
