import React, { useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import ReminderCard from "./ReminderCard";

export default function HomeScreen({ navigation, reminders, onToggleDone, onDelete }) {
  const [filter, setFilter] = useState("all"); // all | active | done

  const data = useMemo(() => {
    if (filter === "active") return reminders.filter((r) => !r.done);
    if (filter === "done") return reminders.filter((r) => r.done);
    return reminders;
  }, [reminders, filter]);

  return (
    <View style={styles.screen}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <FilterChip label="All" active={filter === "all"} onPress={() => setFilter("all")} />
          <FilterChip label="Active" active={filter === "active"} onPress={() => setFilter("active")} />
          <FilterChip label="Done" active={filter === "done"} onPress={() => setFilter("done")} />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddReminder")}
        >
          <Text style={styles.addButtonText}>＋ Add</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No reminders yet. Tap “＋ Add”.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ReminderCard
            item={item}
            onToggleDone={() => onToggleDone(item.id)}
            onDelete={() => onDelete(item.id)}
          />
        )}
      />
    </View>
  );
}

function FilterChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        active ? styles.chipActive : null,
      ]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#f6f7fb",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e7e9f5",
  },
  chipActive: {
    backgroundColor: "#4F46E5",
  },
  chipText: {
    color: "#3b3d4a",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#fff",
  },
  emptyBox: {
    marginTop: 40,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
  },
});
