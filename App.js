import React, { useEffect, useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Alert, Button, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import HomeScreen from "./components/Homescreen";
import AddReminder from "./components/AddReminder";

const Stack = createStackNavigator();
const STORAGE_KEY = "reminders_v3";

// Expo notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [reminders, setReminders] = useState([]);

  // ✅ Ask for notification permissions on first load
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          Alert.alert("Permission required", "Enable notifications in settings.");
        }
      }
    })();
  }, []);

  // Load reminders once
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setReminders(raw ? JSON.parse(raw) : []);
      } catch (e) {
        console.log("Load error", e);
      }
    })();
  }, []);

  // Persist whenever reminders change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders)).catch(() => {});
  }, [reminders]);

  // Schedules notification based on recurrence payload
  const scheduleNotification = async (rem) => {
    try {
      let trigger = null;

      if (rem.mode === "none") {
        trigger = new Date(rem.time);
      } else if (rem.mode === "every_x_minutes") {
        trigger = { seconds: rem.interval * 60, repeats: true };
      } else if (rem.mode === "every_x_hours") {
        trigger = { seconds: rem.interval * 3600, repeats: true };
      } else if (rem.mode === "daily") {
        trigger = {
          hour: new Date(rem.time).getHours(),
          minute: new Date(rem.time).getMinutes(),
          repeats: true,
        };
      } else if (rem.mode === "weekly") {
        for (const d of rem.selectedDays) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `🔔 ${rem.priority.toUpperCase()} Reminder`,
              body: rem.title,
              sound: true,
            },
            trigger: {
              weekday: d,
              hour: new Date(rem.time).getHours(),
              minute: new Date(rem.time).getMinutes(),
              repeats: true,
            },
          });
        }
        return;
      }

      if (trigger) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `🔔 ${rem.priority.toUpperCase()} Reminder`,
            body: rem.title,
            sound: true,
          },
          trigger,
        });
      }
    } catch (e) {
      console.log("Notification error", e);
    }
  };

  const addReminder = useCallback((rem) => {
    const newRem = { ...rem, id: String(Date.now()), done: false };
    setReminders((prev) => [newRem, ...prev]);
    scheduleNotification(newRem);
  }, []);

  const toggleDone = useCallback((id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    );
  }, []);

  const deleteReminder = useCallback((id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const confirmDelete = (id) => {
    Alert.alert("Delete reminder?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteReminder(id) },
    ]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerTitleAlign: "center" }}
      >
        <Stack.Screen name="Home" options={{ title: "Friendly Reminders" }}>
          {(props) => (
            <View style={{ flex: 1 }}>
              <HomeScreen
                {...props}
                reminders={reminders}
                onToggleDone={toggleDone}
                onDelete={confirmDelete}
              />
              {/* ✅ Test button to verify notifications */}
              <Button
                title="Test Notification"
                onPress={() =>
                  Notifications.scheduleNotificationAsync({
                    content: {
                      title: "🔔 Test Reminder",
                      body: "This is a test notification!",
                      sound: true,
                    },
                    trigger: { seconds: 5 }, // pops after 5s
                  })
                }
              />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="AddReminder" options={{ title: "Add Reminder" }}>
          {(props) => <AddReminder {...props} onSave={addReminder} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
