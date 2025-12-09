import { useTheme } from "@/context/themeContext";
import { useTodos } from "@/context/todoContext";
import {
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text as RNText,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

type PriorityLevel = {
  key: string;
  label: string;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

function Index() {
  const router = useRouter();
  const {
    todos,
    loading,
    addTodo: addTodoHook,
    toggleTodo,
    deleteTodo,
  } = useTodos();
  const [newTodo, setNewTodo] = useState({
    title: "",
    priority: "medium",
  });
  const { theme, colors, toggleTheme } = useTheme();
  const [loaded, error] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if ((!loaded && error) || loading) {
    return null;
  }

  const handleAddTodo = async () => {
    if (newTodo.title.trim()) {
      await addTodoHook(newTodo.title, newTodo.priority);
      setNewTodo({ title: "", priority: "medium" });
    }
  };

  const priorityLevels: PriorityLevel[] = [
    { key: "high", label: "High", color: "#FF3B30", icon: "alert-circle" },
    { key: "medium", label: "Medium", color: "#FF9500", icon: "alert" },
    { key: "low", label: "Low", color: "#34C759", icon: "check-circle" },
  ];

  const getPriorityColor = (priority: string) => {
    const level = priorityLevels.find((p) => p.key === priority);
    return level ? level.color : "#8E8E93";
  };

  return (
    <View
      style={{
        height: "100%",
        padding: 20,
        backgroundColor: colors.background,
      }}
    >
      <StatusBar
        backgroundColor={colors.background}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <RNText
          style={{
            fontSize: 24,
            fontWeight: "bold",
            fontFamily: "Inter_700Bold",
            color: colors.text,
          }}
        >
          React Native Todo
        </RNText>
        <Pressable onPress={toggleTheme}>
          {theme === "dark" ? (
            <Octicons name="moon" size={20} color={colors.text} />
          ) : (
            <Octicons name="sun" size={20} color={colors.text} />
          )}
        </Pressable>
      </View>
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 10,
              marginRight: 10,
              borderRadius: 5,
              backgroundColor: colors.card,
              color: colors.text,
            }}
            value={newTodo.title}
            onChangeText={(text) => setNewTodo({ ...newTodo, title: text })}
            placeholder="Add a new todo..."
            placeholderTextColor={colors.icon}
          />
          <Pressable
            style={{
              backgroundColor: colors.primary,
              padding: 10,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              height: 40,
            }}
            onPress={handleAddTodo}
          >
            <MaterialCommunityIcons name="plus" size={20} color="white" />
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RNText style={{ marginRight: 10, fontSize: 16, color: colors.text }}>
            Priority:
          </RNText>
          <FlatList
            data={priorityLevels}
            keyExtractor={(item) => item.key}
            horizontal
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 5 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 10,
                  borderWidth: 1,
                  borderColor:
                    newTodo.priority === item.key ? item.color : "#ccc",
                  borderRadius: 5,
                  backgroundColor:
                    newTodo.priority === item.key ? item.color : "#f9f9f9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setNewTodo({ ...newTodo, priority: item.key })}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={16}
                  color={newTodo.priority === item.key ? "white" : item.color}
                />
                <RNText
                  style={{
                    color: newTodo.priority === item.key ? "white" : item.color,
                    fontWeight:
                      newTodo.priority === item.key ? "bold" : "normal",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {item.label}
                </RNText>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <Animated.FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        itemLayoutAnimation={LinearTransition.duration(300)}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              backgroundColor: colors.card,
            }}
            entering={FadeInDown.duration(400).delay(index * 100)}
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={() => router.push(`/todos/${item.id}` as any)}
              onLongPress={() => toggleTodo(item.id)}
            >
              <View style={{ flex: 1 }}>
                <RNText
                  style={{
                    fontSize: 16,
                    color: colors.text,
                    textDecorationLine: item.completed
                      ? "line-through"
                      : "none",
                    opacity: item.completed ? 0.6 : 1,
                  }}
                >
                  {item.title}
                </RNText>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <RNText
                    style={{
                      fontSize: 12,
                      color: getPriorityColor(item.priority),
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.priority || "no priority"}
                  </RNText>
                  {item.completed && (
                    <RNText
                      style={{
                        fontSize: 12,
                        color: colors.success,
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      ✓ Completed
                    </RNText>
                  )}
                </View>
              </View>
            </Pressable>
            <TouchableOpacity
              style={{
                backgroundColor: "#34C759",
                padding: 8,
                marginRight: 10,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
              }}
              onPress={() => router.push(`/todos/${item.id}` as any)}
            >
              <MaterialCommunityIcons name="pencil" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#FF3B30",
                padding: 8,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
              }}
              onPress={() => deleteTodo(item.id)}
            >
              <MaterialCommunityIcons
                name="trash-can"
                size={16}
                color="white"
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </View>
  );
}

export default Index;
