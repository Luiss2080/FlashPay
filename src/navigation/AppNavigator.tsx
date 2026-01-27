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
import ServicesScreen from "../views/operations/ServicesScreen";
import TopUpScreen from "../views/operations/TopUpScreen";
import PromosScreen from "../views/promos/PromosScreen";
import HistoryScreen from "../views/home/HistoryScreen";
import HelpScreen from "../views/profile/HelpScreen";
import SupportTicketScreen from "../views/support/SupportTicketScreen";
import FavoritesScreen from "../views/contacts/FavoritesScreen";
import ProfileEditScreen from "../views/profile/ProfileEditScreen";
import SecuritySettingsScreen from "../views/profile/SecuritySettingsScreen";
import ReceiveMoneyScreen from "../views/operations/ReceiveMoneyScreen";
import TermsScreen from "../views/profile/TermsScreen";
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
          if (route.name === "Inicio")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "QR")
            iconName = focused ? "qr-code" : "qr-code-outline";
          else if (route.name === "Promos")
            iconName = focused ? "gift" : "gift-outline";
          else if (route.name === "Perfil")
            iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen
        name="Historial"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="QR"
        component={QRScanScreen}
        options={{ title: "Escanear" }}
      />
      <Tab.Screen name="Promos" component={PromosScreen} />
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

        {/* Pantallas de Operaciones (Fuera del Tab) */}
        <Stack.Screen
          name="Transfer"
          component={TransferScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Services"
          component={ServicesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TopUp"
          component={TopUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QRScan"
          component={QRScanScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ title: "Ayuda", headerTintColor: colors.primary }}
        />

        {/* Customization & New Features */}
        <Stack.Screen
          name="ProfileEdit"
          component={ProfileEditScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SecuritySettings"
          component={SecuritySettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReceiveMoney"
          component={ReceiveMoneyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SupportTicket"
          component={SupportTicketScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
