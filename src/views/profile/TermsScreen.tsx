import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Title, Paragraph } from "react-native-paper";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TermsScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Title style={styles.title}>Términos de Uso de FlashPay</Title>
        <Paragraph style={styles.paragraph}>
          Bienvenido a FlashPay. Al utilizar nuestra aplicación, aceptas los
          siguientes términos y condiciones.
        </Paragraph>

        <Title style={styles.subtitle}>1. Uso del Servicio</Title>
        <Paragraph style={styles.paragraph}>
          FlashPay es una billetera digital que permite realizar transferencias
          y pagos de servicios. El usuario es responsable de mantener la
          confidencialidad de su cuenta.
        </Paragraph>

        <Title style={styles.subtitle}>2. Tarifas y Comisiones</Title>
        <Paragraph style={styles.paragraph}>
          FlashPay puede cobrar comisiones por ciertos servicios, las cuales
          serán notificadas previamente al usuario.
        </Paragraph>

        <Title style={styles.subtitle}>3. Privacidad</Title>
        <Paragraph style={styles.paragraph}>
          Respetamos tu privacidad y protegemos tus datos personales conforme a
          la ley vigente.
        </Paragraph>

        <Title style={styles.subtitle}>4. Modificaciones</Title>
        <Paragraph style={styles.paragraph}>
          Nos reservamos el derecho de modificar estos términos en cualquier
          momento. El uso continuo de la app implica la aceptación de los
          cambios.
        </Paragraph>

        <View style={{ height: 50 }} />
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: colors.text,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
    textAlign: "justify",
  },
});

export default TermsScreen;
