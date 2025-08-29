import React from "react";
import { View, Switch, Text, StyleSheet } from "react-native";

export default function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <View style={styles.container}>
      <Text style={{ color: darkMode ? "#fff" : "#000" }}>
        {darkMode ? "Dark Mode" : "Light Mode"}
      </Text>
      <Switch value={darkMode} onValueChange={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
