import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "../views/auth/LoginScreen";
import DashboardScreen from "../views/home/DashboardScreen";
import ProfileScreen from "../views/profile/ProfileScreen";
import QRScanScreen from "../views/operations/QRScanScreen";
import TransferScreen from "../views/operations/TransferScreen";
import { colors } from "../utils/theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "QR") {
            iconName = focused ? "qr-code" : "qr-code-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Inicio" }}
      />
      <Tab.Screen
        name="QR"
        component={QRScanScreen}
        options={{ title: "Escanear" }}
      />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />

        {/* Pantallas secundarias fuera del Tab (stack) */}
        <Stack.Screen
          name="Transfer"
          component={TransferScreen}
          options={{ title: "Transferir", headerTintColor: colors.primary }}
        />
        <Stack.Screen
          name="QRScan"
          component={QRScanScreen}
          options={{ title: "Escanear QR", headerTintColor: colors.primary }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
