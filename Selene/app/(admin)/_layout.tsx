import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";

// Importando como componentes React
import IconHome from "../../assets/images/icone_documento.svg";
import IconSensors from "../../assets/images/icone_target.svg";
import IconCentralPie from "../../assets/images/icone_central.svg";
import IconChartBars from "../../assets/images/icone_grafico_barras.svg";
import IconProfile from "../../assets/images/icone_usuario.svg";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "#8E8E8E",
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home-admin"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <IconHome 
              width={26} 
              height={26} 
              fill={focused ? "#8bc34a" : color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sensors"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <IconSensors 
              width={26} 
              height={26} 
              fill={focused ? "#8bc34a" : color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          tabBarIcon: () => (
            <View style={styles.fabContainer}>
              <View style={styles.fab}>
                <IconCentralPie width={30} height={30} fill="#fff" />
              </View>
            </View>
          ),
        }}
      />

      {/* Repita o padrão para as outras abas... */}
      
      <Tabs.Screen name="novo-usuario" options={{ /* ... */ }} />
      <Tabs.Screen name="profile-admin" options={{ /* ... */ }} />
      
      {/* Rotas ocultas */}
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    height: 90,
    backgroundColor: "#fff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderTopWidth: 0,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingHorizontal: 10,
  },
  fabContainer: {
    top: -25,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "#8bc34a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#f2f2f7", // Deve ser a cor do background da página
    elevation: 8,
  },
});