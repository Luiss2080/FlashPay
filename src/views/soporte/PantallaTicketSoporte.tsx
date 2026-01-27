import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";

const SupportTicketScreen = () => {
  const navigation = useNavigation<any>();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const hasSubjectErrors = () => {
    return subject.length > 0 && subject.length < 5;
  };

  const hasMessageErrors = () => {
    return message.length > 0 && message.length < 10;
  };

  const handleSubmit = async () => {
    if (!subject || !message || hasSubjectErrors() || hasMessageErrors()) {
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Mensaje Enviado",
        "Gracias por contactarnos. Te responderemos pronto.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    }, 1500);
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
        <Text style={styles.headerTitle}>Crear Ticket</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Asunto</Text>
        <TextInput
          mode="outlined"
          value={subject}
          onChangeText={setSubject}
          placeholder="Ej. Problema con transferencia"
          error={hasSubjectErrors()}
          style={styles.input}
        />
        <HelperText type="error" visible={hasSubjectErrors()}>
          El asunto es muy corto.
        </HelperText>

        <Text style={styles.label}>Mensaje</Text>
        <TextInput
          mode="outlined"
          value={message}
          onChangeText={setMessage}
          placeholder="Describe tu problema..."
          multiline
          numberOfLines={6}
          error={hasMessageErrors()}
          style={styles.input}
        />
        <HelperText type="error" visible={hasMessageErrors()}>
          Por favor detalla más tu problema.
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !subject || !message}
          style={styles.button}
        >
          Enviar Ticket
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
    marginBottom: 5,
    color: colors.text,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.secondary,
    paddingVertical: 6,
  },
});

export default SupportTicketScreen;
