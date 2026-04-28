import React from "react";
import { Tabs } from "expo-router";
import { SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      // ==========================================
      // CONFIGURAÇÕES VISUAIS DA TAB BAR
      // ==========================================
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#95C159", // Verde Selene
        tabBarInactiveTintColor: "#8E8E8E",
        tabBarStyle: {
          height: 85,
          paddingBottom: 15,
          paddingTop: 10,
          backgroundColor: "#FFF",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      {/* ---------------------------------------------------------
          ROTAS VISÍVEIS NA TAB BAR (MENU INFERIOR)
      ---------------------------------------------------------- */}

      {/* TELA DE INÍCIO */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* TELA DE LISTAGEM DE ESTUFAS */}
      <Tabs.Screen
        name="estufas"
        options={{
          title: "Estufas",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="greenhouse" size={28} color={color} />
          ),
        }}
      />

      {/* TELA DE RELATÓRIOS/DETECÇÕES */}
      <Tabs.Screen
        name="relatorios"
        options={{
          title: "Relatórios",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="file-eye-outline"
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* TELA DE CONFIGURAÇÕES GERAIS */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="settings" size={24} color={color} />
          ),
        }}
      />

      {/* ---------------------------------------------------------
          ROTAS OCULTAS (ACESSÍVEIS APENAS POR LINK/ROUTER)
          O 'href: null' faz com que elas não criem um botão na barra
      ---------------------------------------------------------- */}

      {/* TELA DE PERFIL */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />

      {/* TELA DE EDIÇÃO DE PERFIL */}
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
