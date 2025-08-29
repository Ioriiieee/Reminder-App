import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { weekdayLabels, buildRecurrencePayload } from "../utils/recurrence";

export default function AddReminder({ navigation, onSave }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium"); // low | medium | high

  // Recurrence controls
  const [mode, setMode] = useState("none"); // none | every_x_minutes | every_x_hours | daily | weekly
  const [interval, setInterval] = useState("30"); // for minutes/hours
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri default (1=Mon..7=Sun)
  const [time, setTime] = useState(new Date());
  const [showTime, setShowTime] = useState(false);

  const canSave = useMemo(() => {
    if (!title.trim()) return false;
    if (mode === "every_x_minutes" || mode === "every_x_hours") {
      const n = Number(interval);
      return Number.isFinite(n) && n > 0;
    }
    if (mode === "weekly") return selectedDays.length > 0;
    return true;
  }, [title, mode, interval, selectedDays.length]);

  const toggleDay = (d) => {
    setSelectedDays((prev) =>
      prev.includes(d)
        ? prev.filter((x) => x !== d)
        : [...prev, d].sort((a, b) => a - b)
    );
  };

  const handleSave = () => {
    if (!canSave) return;

    const payload = buildRecurrencePayload({
      title: title.trim(),
      priority,
      mode,
      interval: Number(interval),
      selectedDays,
      time,
    });

    if (onSave) onSave(payload);
    if (navigation) navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        style={styles.screen}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- DETAILS CARD --- */}
        <View style={styles.card}>
          <Text style={styles.heading}>Details</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Drink water 💧"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Priority</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={priority}
              onValueChange={setPriority}
              style={styles.picker}
            >
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="High" value="high" />
            </Picker>
          </View>
        </View>

        {/* --- REPEAT CARD --- */}
        <View style={styles.card}>
          <Text style={styles.heading}>Repeat</Text>

          <Text style={styles.label}>Recurrence</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={mode}
              onValueChange={(v) => setMode(v)}
              style={styles.picker}
            >
              <Picker.Item label="Does not repeat" value="none" />
              <Picker.Item label="Every X Minutes" value="every_x_minutes" />
              <Picker.Item label="Every X Hours" value="every_x_hours" />
              <Picker.Item label="Daily at time" value="daily" />
              <Picker.Item label="Weekly on selected days" value="weekly" />
            </Picker>
          </View>

          {(mode === "every_x_minutes" || mode === "every_x_hours") && (
            <>
              <Text style={styles.label}>
                {mode === "every_x_minutes"
                  ? "Every how many minutes?"
                  : "Every how many hours?"}
              </Text>
              <TextInput
                style={styles.input}
                inputMode="numeric"
                placeholder={mode === "every_x_minutes" ? "e.g., 30" : "e.g., 2"}
                placeholderTextColor="#9CA3AF"
                value={interval}
                onChangeText={setInterval}
              />
            </>
          )}

          {(mode === "daily" || mode === "weekly") && (
            <>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                onPress={() => setShowTime(true)}
                style={styles.timeBtn}
              >
                <Text style={styles.timeBtnText}>
                  🕑{" "}
                  {time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>

              {showTime && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(e, d) => {
                    setShowTime(false);
                    if (d) setTime(d);
                  }}
                />
              )}
            </>
          )}

          {mode === "weekly" && (
            <>
              <Text style={[styles.label, { marginTop: 8 }]}>Days</Text>
              <View style={styles.daysRow}>
                {weekdayLabels.map(({ label, value }) => {
                  const active = selectedDays.includes(value);
                  return (
                    <TouchableOpacity
                      key={value}
                      style={[styles.dayChip, active && styles.dayChipActive]}
                      onPress={() => toggleDay(value)}
                    >
                      <Text
                        style={[
                          styles.dayChipText,
                          active && styles.dayChipTextActive,
                        ]}
                      >
                        {label.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* --- SAVE BUTTON --- */}
        <TouchableOpacity
          disabled={!canSave}
          onPress={handleSave}
          style={[styles.saveBtn, !canSave && { opacity: 0.5 }]}
        >
          <Text style={styles.saveBtnText}>Save Reminder</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    fontSize: 16,
  },
  label: {
    color: "#4B5563",
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#111827",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  timeBtn: {
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginTop: 4,
  },
  timeBtnText: {
    fontWeight: "700",
    color: "#1E3A8A",
    fontSize: 16,
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  dayChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    marginRight: 6,
    marginBottom: 6,
  },
  dayChipActive: {
    backgroundColor: "#4F46E5",
  },
  dayChipText: {
    color: "#374151",
    fontWeight: "700",
  },
  dayChipTextActive: {
    color: "#fff",
  },
  saveBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  saveBtnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
