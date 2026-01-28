import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Text, Card, FAB, ProgressBar, IconButton } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { colors } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { FadeInView } from "../../components/common/FadeInView";

const PantallaMetas = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [metas, setMetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchMetas();
    }
  }, [isFocused]);

  const fetchMetas = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await api.get(`/api/metas?user_id=${user.id_usuario}`);
        if (response.data.status === "success") {
          setMetas(response.data.metas);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMetas();
  };

  const renderItem = ({ item }: { item: any }) => {
    const progress = Math.min(
      item.monto_actual / parseFloat(item.monto_objetivo),
      1,
    );
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={item.icono || "piggy-bank"}
                size={24}
                color="white"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.goalTitle}>{item.titulo}</Text>
              <Text style={styles.goalAmount}>
                S/ {parseFloat(item.monto_actual).toFixed(2)} de S/{" "}
                {parseFloat(item.monto_objetivo).toFixed(2)}
              </Text>
            </View>
          </View>
          <ProgressBar
            progress={progress}
            color={progress >= 1 ? colors.success : colors.secondary}
            style={styles.progressBar}
          />
          <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
        </Card.Content>
      </Card>
    );
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
        <Text style={styles.headerTitle}>Mis Metas</Text>
        <View style={{ width: 24 }} />
      </View>

      <FadeInView style={{ flex: 1 }}>
        <FlatList
          data={metas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_meta.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              No tienes metas de ahorro. ¡Crea una!
            </Text>
          }
        />
      </FadeInView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("CreateMeta")}
        label="Nueva Meta"
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
  list: {
    padding: 20,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textDark,
  },
  goalAmount: {
    fontSize: 14,
    color: "#666",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  percentage: {
    marginTop: 5,
    textAlign: "right",
    fontSize: 12,
    color: "#888",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
  },
});

export default PantallaMetas;
