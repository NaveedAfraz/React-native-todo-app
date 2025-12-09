import { useTheme } from "@/context/themeContext";
import { Todo, useTodos } from "@/context/todoContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { getTodo, updateTodo, deleteTodo } = useTodos();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");

  const priorityLevels = [
    { key: "high", label: "High", color: "#FF3B30" },
    { key: "medium", label: "Medium", color: "#FF9500" },
    { key: "low", label: "Low", color: "#34C759" },
  ];

  useEffect(() => {
    const foundTodo = getTodo(id as string);
    console.log("Found todo:", foundTodo);
    if (foundTodo && !todo) {
      setTodo(foundTodo);
      setTitle(foundTodo.title);
      setPriority(foundTodo.priority || "medium");
    }
  }, [id, getTodo, todo]);

  const handleUpdateTodo = async () => {
    console.log("Updating todo with:", { title, priority });
    const updated = await updateTodo(id as string, { title, priority });
    console.log("Updated todo:", updated);
    router.back();
  };

  const handleDeleteTodo = async () => {
    await deleteTodo(id as string);
    router.back();
  };

  if (!todo) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>
          Todo not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.text}
          />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Edit Todo
        </Text>
        <Pressable onPress={handleDeleteTodo}>
          <MaterialCommunityIcons name="trash-can" size={24} color="#FF3B30" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.text }]}>Title</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={title}
          onChangeText={(text) => {
            console.log("Text changed:", text);
            setTitle(text);
          }}
          placeholder="Enter todo title..."
          placeholderTextColor={colors.icon}
          editable={true}
          multiline={false}
        />

        <Text style={[styles.label, { color: colors.text, marginTop: 20 }]}>
          Priority
        </Text>
        <View style={styles.priorityContainer}>
          {priorityLevels.map((level) => (
            <Pressable
              key={level.key}
              style={[
                styles.priorityButton,
                {
                  backgroundColor:
                    priority === level.key ? level.color : colors.card,
                  borderColor:
                    priority === level.key ? level.color : colors.border,
                },
              ]}
              onPress={() => setPriority(level.key)}
            >
              <Text
                style={[
                  styles.priorityText,
                  { color: priority === level.key ? "white" : colors.text },
                ]}
              >
                {level.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleUpdateTodo}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  priorityText: {
    fontWeight: "600",
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  text: {
    fontSize: 16,
  },
});
