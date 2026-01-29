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
import { Skeleton } from "../../components/common/Skeleton";

const PantallaServicios = () => {
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
      const response = await api.get("/api/services");
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
        const response = await api.post("/api/services", {
          user_id: user.id_usuario,
          service_id: selectedService.id_servicio,
          amount: parseFloat(amount),
          reference: reference,
        });

        if (response.data.status === "success") {
          setSelectedService(null);
          setReference("");
          setAmount("");

          navigation.navigate("Comprobante", {
            amount: parseFloat(amount),
            date: new Date().toLocaleString(),
            transactionId: "SERV-" + Math.floor(Math.random() * 1000000),
            serviceName: selectedService.nombre,
            recipient: selectedService.nombre,
            type: "PAGO SERVICIO",
            status: "EXITOSO",
          });
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

  const getCategoryIcon = (category: string, name: string) => {
    const n = name.toLowerCase();
    if (n.includes("luz") || n.includes("enel")) return "flash";
    if (n.includes("agua") || n.includes("sedapal")) return "water";
    if (
      n.includes("movistar") ||
      n.includes("claro") ||
      n.includes("entel") ||
      n.includes("bitel")
    )
      return "phone-portrait";
    if (n.includes("internet") || n.includes("win") || n.includes("nubyx"))
      return "wifi";
    return "receipt";
  };

  const getBrandColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("luz del sur")) return "#FF9800"; // Orange
    if (n.includes("enel")) return "#0055A4"; // Blue Enel
    if (n.includes("sedapal")) return "#03A9F4"; // Light Blue
    if (n.includes("movistar")) return "#003399"; // Movistar Blue
    if (n.includes("claro")) return "#DA291C"; // Claro Red
    if (n.includes("entel")) return "#FF5722"; // Entel Orange
    if (n.includes("bitel")) return "#FFEB3B"; // Bitel Yellow
    if (n.includes("win")) return "#FF5722"; // Win Orange
    return "#607D8B"; // Default Grey
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
          <View style={{ padding: 20 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  marginBottom: 15,
                  alignItems: "center",
                }}
              >
                <Skeleton width={45} height={45} style={{ borderRadius: 10 }} />
                <View style={{ marginLeft: 15, flex: 1 }}>
                  <Skeleton
                    width="50%"
                    height={16}
                    style={{ marginBottom: 5 }}
                  />
                  <Skeleton width="30%" height={12} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <ScrollView style={styles.content}>
            {filteredServices.map((item, index) => {
              const brandColor = getBrandColor(item.nombre);
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.serviceItem}
                  onPress={() => setSelectedService(item)}
                >
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: brandColor + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={getCategoryIcon(item.categoria, item.nombre) as any}
                      size={24}
                      color={brandColor}
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
              );
            })}
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
                          getBrandColor(selectedService.nombre) + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        getCategoryIcon(
                          selectedService.categoria,
                          selectedService.nombre,
                        ) as any
                      }
                      size={24}
                      color={getBrandColor(selectedService.nombre)}
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
    color: colors.textDark,
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
    color: colors.textDark,
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

export default PantallaServicios;
