import React from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

export default function ReminderList({ reminders, deleteReminder, darkMode }) {
  return (
    <FlatList
      data={reminders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View
          style={[
            styles.reminder,
            { backgroundColor: darkMode ? "#333" : "#eee" },
          ]}
        >
          <Text style={{ color: darkMode ? "#fff" : "#000", fontSize: 16 }}>
            {item.title} ({item.date}) [{item.recurring}]
          </Text>
          <Button title="Delete" onPress={() => deleteReminder(item.id)} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  reminder: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
