import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Importaciones actualizadas (Español)
import PantallaLogin from "../views/autenticacion/PantallaLogin";
import PantallaInicio from "../views/inicio/PantallaInicio";
import PantallaPerfil from "../views/perfil/PantallaPerfil";
import PantallaEscanearQR from "../views/operaciones/PantallaEscanearQR";
import PantallaComprobante from "../views/operaciones/PantallaComprobante";
import PantallaTransferencia from "../views/operaciones/PantallaTransferencia";
import PantallaServicios from "../views/operaciones/PantallaServicios";
import PantallaRecargaCelular from "../views/operaciones/PantallaRecargaCelular";
import PantallaDeposito from "../views/operaciones/PantallaDeposito";
import PantallaPromociones from "../views/promociones/PantallaPromociones";
import PantallaHistorial from "../views/inicio/PantallaHistorial";
import PantallaAyuda from "../views/perfil/PantallaAyuda";
import PantallaTicketSoporte from "../views/soporte/PantallaTicketSoporte";
import PantallaFavoritos from "../views/contactos/PantallaFavoritos";
import PantallaEditarPerfil from "../views/perfil/PantallaEditarPerfil";
import PantallaSeguridad from "../views/perfil/PantallaSeguridad";
import PantallaCobrar from "../views/operaciones/PantallaCobrar";
import PantallaTerminos from "../views/perfil/PantallaTerminos";
import PantallaDetalleTransaccion from "../views/inicio/PantallaDetalleTransaccion";
import PantallaRecuperarClave from "../views/autenticacion/PantallaRecuperarClave";
import PantallaBienvenida from "../views/autenticacion/PantallaBienvenida";
import PantallaNotificaciones from "../views/inicio/PantallaNotificaciones";

import PantallaPersonalizacion from "../views/perfil/PantallaPersonalizacion";
import PantallaMetas from "../views/metas/PantallaMetas";
import PantallaCrearMeta from "../views/metas/PantallaCrearMeta";

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
      <Tab.Screen name="Inicio" component={PantallaInicio} />
      <Tab.Screen
        name="Historial"
        component={PantallaHistorial}
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
        component={PantallaEscanearQR}
        options={{ title: "Escanear" }}
      />
      <Tab.Screen name="Promos" component={PantallaPromociones} />
      <Tab.Screen name="Perfil" component={PantallaPerfil} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={PantallaLogin}
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
          component={PantallaTransferencia}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Services"
          component={PantallaServicios}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TopUp"
          component={PantallaRecargaCelular}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Deposit"
          component={PantallaDeposito}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EscanearQR"
          component={PantallaEscanearQR}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Comprobante"
          component={PantallaComprobante}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={PantallaAyuda}
          options={{ title: "Ayuda", headerTintColor: colors.primary }}
        />
        <Stack.Screen
          name="Notifications"
          component={PantallaNotificaciones}
          options={{ title: "Notificaciones", headerTintColor: colors.primary }}
        />

        {/* Customization & New Features */}
        <Stack.Screen
          name="Customization"
          component={PantallaPersonalizacion}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileEdit"
          component={PantallaEditarPerfil}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SecuritySettings"
          component={PantallaSeguridad}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReceiveMoney"
          component={PantallaCobrar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SupportTicket"
          component={PantallaTicketSoporte}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Favorites"
          component={PantallaFavoritos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Terms"
          component={PantallaTerminos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransactionDetail"
          component={PantallaDetalleTransaccion}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={PantallaRecuperarClave}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={PantallaBienvenida}
          options={{ headerShown: false }}
        />

        {/* Metas */}
        <Stack.Screen
          name="Metas"
          component={PantallaMetas}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateMeta"
          component={PantallaCrearMeta}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
