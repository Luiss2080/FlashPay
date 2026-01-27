import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, List, Divider } from "react-native-paper";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

const HelpScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Centro de Ayuda</Text>

        <List.Section>
          <List.Subheader>Preguntas Frecuentes</List.Subheader>
          <List.Accordion
            title="¿Cómo recargar mi cuenta?"
            left={(props) => (
              <List.Icon {...props} icon="cash" color={colors.primary} />
            )}
          >
            <List.Item
              title="Puedes recargar en agentes autorizados o vía transferencia bancaria."
              titleNumberOfLines={2}
            />
          </List.Accordion>

          <List.Accordion
            title="¿Es seguro usar FlashPay?"
            left={(props) => (
              <List.Icon {...props} icon="security" color={colors.primary} />
            )}
          >
            <List.Item
              title="Sí, usamos encriptación avanzada para proteger tus datos."
              titleNumberOfLines={2}
            />
          </List.Accordion>

          <List.Accordion
            title="Olvidé mi contraseña"
            left={(props) => (
              <List.Icon {...props} icon="lock-reset" color={colors.primary} />
            )}
          >
            <List.Item
              title="Puedes restablecerla desde la pantalla de Login."
              titleNumberOfLines={2}
            />
          </List.Accordion>
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Contacto</List.Subheader>
          <List.Item
            title="Llámanos"
            description="(01) 123-4567"
            left={(props) => <List.Icon {...props} icon="phone" />}
          />
          <List.Item
            title="Escríbenos"
            description="soporte@flashpay.com"
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="Crear Ticket de Soporte"
            description="¿No encontraste lo que buscabas?"
            left={(props) => (
              <List.Icon {...props} icon="lifebuoy" color={colors.primary} />
            )}
            onPress={() => navigation.navigate("SupportTicket")}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 40 },
  content: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default HelpScreen;
