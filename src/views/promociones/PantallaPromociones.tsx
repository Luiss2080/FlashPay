import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import api from "../../services/api";
import { colors } from "../../utils/theme";

const PantallaPromociones = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await api.get("/api/promos");
        if (response.data.status === "success") {
          setPromos(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  const renderItem = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.imagen_url }} />
      <Card.Content>
        <Title>{item.titulo}</Title>
        <Paragraph>{item.descripcion}</Paragraph>
        <Text style={styles.discount}>Descuento: {item.descuento}</Text>
      </Card.Content>
      <Card.Actions>
        <Button textColor={colors.primary}>Ir ahora</Button>
      </Card.Actions>
    </Card>
  );

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Beneficios FlashPay</Text>
      <FlatList
        data={promos}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id_promo.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
    paddingTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  discount: {
    color: colors.secondary,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default PantallaPromociones;
