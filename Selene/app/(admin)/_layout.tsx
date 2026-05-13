import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";

import {
  Feather,
  MaterialIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarActiveTintColor: "#8bc34a",
        tabBarInactiveTintColor: "#8E8E8E",

        // TABBAR TRANSPARENTE
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,

          height: 90,

          backgroundColor: "transparent",

          borderTopWidth: 0,

          elevation: 0,
        },

        // FUNDO CUSTOMIZADO COM RECORTE
        tabBarBackground: () => (
          <View style={styles.tabBackground}>
            <View style={styles.notch} />
          </View>
        ),
      }}
    >
      {/* RELATÓRIOS */}
      <Tabs.Screen
        name="reports"
        options={{
          title: "Relatórios",
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="file-text"
              size={26}
              color={focused ? "#8bc34a" : color}
            />
          ),
        }}
      />

      {/* MONITORAMENTO */}
      <Tabs.Screen
        name="monitoring"
        options={{
          title: "Monitoramento",
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons
              name="signal-cellular-alt"
              size={26}
              color={focused ? "#8bc34a" : color}
            />
          ),
        }}
      />

      {/* BOTÃO CENTRAL */}
      <Tabs.Screen
        name="home-admin"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <View style={styles.fabContainer}>
              <View style={styles.fab}>
                <Ionicons name="pie-chart" size={30} color="#FFFFFF" />
              </View>
            </View>
          ),
        }}
      />

      {/* ESTATÍSTICAS */}
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Estatísticas",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="bar-chart"
              size={26}
              color={focused ? "#8bc34a" : color}
            />
          ),
        }}
      />

      {/* USUÁRIOS */}
      <Tabs.Screen
        name="users"
        options={{
          title: "Usuários",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome5
              name="user-alt"
              size={24}
              color={focused ? "#8bc34a" : color}
            />
          ),
        }}
      />

      {/* ROTAS OCULTAS */}
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="edit-profile-admin"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="edit-profile-register"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="novo-usuario"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile-admin"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="sensors"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="detalhes-sensor"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="detalhes-camera"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // FUNDO DA TABBAR
  tabBackground: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    elevation: 15,

    overflow: "visible",
  },

  // RECORTE CENTRAL
  notch: {
    position: "absolute",

    alignSelf: "center",

    top: -38,

    width: 90,
    height: 90,

    borderRadius: 45,

    backgroundColor: "#FFFFFF",
  },

  // CONTAINER DO FAB
  fabContainer: {
    top: -30,

    justifyContent: "center",
    alignItems: "center",
  },

  // BOTÃO CENTRAL
  fab: {
    width: 68,
    height: 68,

    borderRadius: 999,

    backgroundColor: "#7D7D7D",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 5,
    borderColor: "#FFFFFF",

    elevation: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
});
