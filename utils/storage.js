import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveReminders = async (reminders) => {
  try {
    await AsyncStorage.setItem("reminders", JSON.stringify(reminders));
  } catch (e) {
    console.log("Error saving reminders:", e);
  }
};

export const loadReminders = async () => {
  try {
    const data = await AsyncStorage.getItem("reminders");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("Error loading reminders:", e);
    return [];
  }
};
