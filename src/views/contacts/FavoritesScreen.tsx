import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Avatar,
  IconButton,
  ActivityIndicator,
  FAB,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { getAvatarColor, getInitials } from "../../utils/avatarUtils";
import { hapticFeedback } from "../../utils/haptics";

const FavoritesScreen = () => {
  const navigation = useNavigation<any>();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (contactId: number, alias: string) => {
    hapticFeedback.warning();
    Alert.alert(
      "Eliminar Contacto",
      `¿Seguro que deseas eliminar a ${alias}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            // Call backend to delete (Needs endpoint)
            // For MVP, just update state simulation or assume endpoint exists
            // We haven't built delete contact endpoint yet in Phase 3 plan, but let's simulate
            const updated = contacts.filter((c) => c.id_contacto !== contactId);
            setContacts(updated);
            // await api.delete(`/api/contacts/${contactId}`);
            hapticFeedback.success();
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itmeContainer}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Avatar.Text
          size={45}
          label={getInitials(item.alias)}
          style={{
            backgroundColor: getAvatarColor(item.alias),
            marginRight: 15,
          }}
          color="white"
        />
        <View>
          <Text style={styles.name}>{item.alias}</Text>
          <Text style={styles.phone}>{item.telefono || item.email}</Text>
        </View>
      </View>
      <IconButton
        icon="trash-can-outline"
        iconColor={colors.error}
        onPress={() => handleDelete(item.id_contacto, item.alias)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Mis Contactos</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} color={colors.primary} />
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_contacto.toString()}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No tienes contactos guardados.</Text>
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("Transfer")} // Logic to add contact is in Transfer flow currently
        color="white"
      />
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
  itmeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  phone: {
    fontSize: 12,
    color: "#888",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.secondary,
  },
});

export default FavoritesScreen;
