import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  Searchbar,
  Modal,
  Portal,
  Provider,
  ActivityIndicator,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/theme";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const ServicesScreen = () => {
  const navigation = useNavigation<any>();
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/services.php");
      if (response.data.status === "success") {
        setServices(response.data.services);
        setFilteredServices(response.data.services);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      Alert.alert("Error", "No se pudieron cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = services.filter(
        (service) =>
          service.nombre.toLowerCase().includes(query.toLowerCase()) ||
          service.categoria.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  };

  const handlePayService = async () => {
    if (!reference || !amount) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setPaymentLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await api.post("/services.php", {
          user_id: user.id_usuario,
          service_id: selectedService.id_servicio,
          amount: parseFloat(amount),
          reference: reference,
        });

        if (response.data.status === "success") {
          Alert.alert("¡Pago Exitoso!", response.data.message, [
            {
              text: "OK",
              onPress: () => {
                setSelectedService(null);
                setReference("");
                setAmount("");
                navigation.navigate("Dashboard");
              },
            },
          ]);
        } else {
          Alert.alert("Error", response.data.message);
        }
      }
    } catch (error: any) {
      let msg = "Error de conexión";
      if (error.response?.data?.message) msg = error.response.data.message;
      Alert.alert("Error", msg);
    } finally {
      setPaymentLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "luz":
        return "flash";
      case "agua":
        return "water";
      case "telefonia":
        return "call";
      case "internet":
        return "wifi";
      default:
        return "receipt";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "luz":
        return "#FFC107"; // Amber
      case "agua":
        return "#03A9F4"; // Light Blue
      case "telefonia":
        return "#E91E63"; // Pink
      case "internet":
        return "#9C27B0"; // Purple
      default:
        return "#607D8B"; // Grey
    }
  };

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
          <Text style={styles.title}>Pago de Servicios</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar empresa o servicio"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={{ fontSize: 14 }}
          />
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 50 }}
          />
        ) : (
          <ScrollView style={styles.content}>
            {filteredServices.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceItem}
                onPress={() => setSelectedService(item)}
              >
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: getCategoryColor(item.categoria) + "20",
                    },
                  ]}
                >
                  <Ionicons
                    name={getCategoryIcon(item.categoria) as any}
                    size={24}
                    color={getCategoryColor(item.categoria)}
                  />
                </View>
                <View style={{ marginLeft: 15, flex: 1 }}>
                  <Text style={styles.serviceName}>{item.nombre}</Text>
                  <Text style={styles.serviceCategory}>
                    {item.categoria.toUpperCase()}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
            <View style={{ height: 50 }} />
          </ScrollView>
        )}

        {/* Payment Modal */}
        <Portal>
          <Modal
            visible={!!selectedService}
            onDismiss={() => setSelectedService(null)}
            contentContainerStyle={styles.modalContent}
          >
            {selectedService && (
              <View>
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor:
                          getCategoryColor(selectedService.categoria) + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={getCategoryIcon(selectedService.categoria) as any}
                      size={24}
                      color={getCategoryColor(selectedService.categoria)}
                    />
                  </View>
                  <Text style={styles.modalTitle}>
                    {selectedService.nombre}
                  </Text>
                </View>

                <Text style={styles.label}>
                  Código de suministro / Referencia
                </Text>
                <TextInput
                  mode="outlined"
                  value={reference}
                  onChangeText={setReference}
                  placeholder="Ej. 12345678"
                  style={styles.input}
                />

                <Text style={styles.label}>Monto a pagar</Text>
                <TextInput
                  mode="outlined"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="S/ 0.00"
                  left={<TextInput.Affix text="S/ " />}
                  style={styles.input}
                />

                <Button
                  mode="contained"
                  onPress={handlePayService}
                  loading={paymentLoading}
                  disabled={paymentLoading}
                  style={styles.payButton}
                >
                  Pagar Servicio
                </Button>
                <Button
                  mode="text"
                  onPress={() => setSelectedService(null)}
                  style={{ marginTop: 10 }}
                  textColor="#666"
                >
                  Cancelar
                </Button>
              </View>
            )}
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "white", fontSize: 18, fontWeight: "bold" },
  searchContainer: {
    padding: 15,
    backgroundColor: colors.primary,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchBar: {
    borderRadius: 10,
    height: 45,
    backgroundColor: "white",
  },
  content: { padding: 20 },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 1,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  serviceCategory: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    margin: 20,
    borderRadius: 15,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    color: colors.text,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "white",
    height: 45,
  },
  payButton: {
    marginTop: 25,
    backgroundColor: colors.secondary,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

export default ServicesScreen;
