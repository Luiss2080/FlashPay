import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { Text, Button, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../utils/theme";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Envía dinero al instante",
    description:
      "Transfiere a tus amigos y familiares en segundos, sin comisiones.",
    image:
      "https://img.freepik.com/free-vector/wallet-concept-illustration_114360-1017.jpg", // Placeholder
    icon: "paper-plane",
  },
  {
    id: "2",
    title: "Paga tus servicios",
    description:
      "Olvídate de las colas. Luz, agua, teléfono y más, desde tu celular.",
    image:
      "https://img.freepik.com/free-vector/digital-marketing-concept-illustration_114360-1236.jpg",
    icon: "flash",
  },
  {
    id: "3",
    title: "Seguridad Total",
    description:
      "Tus transacciones protegidas con la mejor tecnología de encriptación.",
    image:
      "https://img.freepik.com/free-vector/security-concept-illustration_114360-1498.jpg",
    icon: "shield-checkmark",
  },
];

const PantallaBienvenida = () => {
  // ...
  export default PantallaBienvenida;
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const handleFinish = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("Login");
  };

  const RenderItem = ({ item }: any) => {
    return (
      <View style={styles.slide}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: width * 0.8,
            height: width * 0.6,
            resizeMode: "contain",
            marginBottom: 50,
          }}
        />
        <Title style={styles.title}>{item.title}</Title>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={({ item }) => <RenderItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        <Button
          mode="contained"
          onPress={
            currentIndex === slides.length - 1
              ? handleFinish
              : () => {
                  //@ts-ignore
                  slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
                }
          }
          style={styles.button}
          contentStyle={{ paddingVertical: 5 }}
        >
          {currentIndex === slides.length - 1 ? "Empezar" : "Siguiente"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  slide: {
    width,
    height: height * 0.75, // Occupy top 75%
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  footer: {
    height: height * 0.25,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    height: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
  },
});

export default OnboardingScreen;
