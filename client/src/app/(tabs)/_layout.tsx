import { Tabs } from "expo-router";
import { Image } from "react-native";
import { useUserStore } from "@/store/userStore";

export default function _layout() {
  const { user } = useUserStore();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false, // Removes the top tab bar (header)
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === "home") {
            iconSource = require("@/assets/icons/lock.png");
          } else if (route.name === "services/index") {
            iconSource = require("@/assets/icons/person.png");
          } else if (route.name === "history/index") {
            iconSource = require("@/assets/icons/list.png");
          } else if (route.name === "profile/index") {
            iconSource = require("@/assets/icons/person.png");
          }

          return (
            <Image
              source={iconSource}
              style={{ width: 24, height: 24, opacity: 0.5 }} // Adjust opacity
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name="home"
        redirect
        options={{
          href: user === "customer" ? "/customer/home" : "/captain/home",
          headerShown: false,
        }}
      />
      <Tabs.Screen name="services/index" options={{ headerShown: false }} />
      <Tabs.Screen name="history/index" options={{ headerShown: false }} />
      <Tabs.Screen name="profile/index" options={{ headerShown: false }} />
    </Tabs>
  );
}
