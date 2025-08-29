import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { describeRecurrence } from "../utils/recurrence";

export default function ReminderCard({ item, onToggleDone, onDelete }) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  const priorityColor =
    item.priority === "high" ? "#EF4444" :
    item.priority === "low" ? "#10B981" : "#F59E0B";

  return (
    <Animated.View style={{ opacity: fade }}>
      <View style={styles.card}>
        <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, item.done && styles.done]} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.meta}>
            {describeRecurrence(item)}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onToggleDone}>
            <Text style={[styles.actionText, { color: "#10B981" }]}>{item.done ? "Undo" : "Done"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
            <Text style={[styles.actionText, { color: "#EF4444" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
    alignItems: "center",
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  done: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  meta: {
    color: "#6B7280",
    fontSize: 13,
  },
  actions: {
    flexDirection: "column",
    gap: 10,
    marginLeft: 8,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  actionText: {
    fontWeight: "700",
  },
});
