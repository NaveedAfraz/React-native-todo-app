import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import {
    FlatList,
    Text as RNText,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { data } from "../data/todos";

type PriorityLevel = {
  key: string;
  label: string;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

function Index() {
  const [todos, setTodos] = useState(data);
  const [newTodo, setNewTodo] = useState({
    id: "",
    title: "",
    priority: "",
    completed: "",
  });
  console.log(todos);
  const addTodo = () => {
    if (newTodo.title.trim() != "") {
      const newID = todos.length + 1;

      setTodos([
        ...todos,
        {
          id: newID.toString(),
          title: newTodo.title,
          priority: newTodo.priority,
          completed: false,
        },
      ]);
      setNewTodo({ id: "", title: "", priority: "", completed: "" });
    }
  };
  const priorityLevels: PriorityLevel[] = [
    { key: "high", label: "High", color: "#FF3B30", icon: "alert-circle" },
    { key: "medium", label: "Medium", color: "#FF9500", icon: "alert" },
    { key: "low", label: "Low", color: "#34C759", icon: "check-circle" },
  ];

  const getPriorityColor = (priority: string) => {
    const level = priorityLevels.find(p => p.key === priority);
    return level ? level.color : "#8E8E93";
  };
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id != id));
  };
  const EditTodo = (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      setNewTodo({
        id: todo.id,
        title: todo.title,
        priority: todo.priority,
        completed: todo.completed.toString(),
      });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <RNText style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Todo List
      </RNText>

      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginRight: 10,
              borderRadius: 5,
            }}
            value={newTodo.title}
            onChangeText={(text) => setNewTodo({ ...newTodo, title: text })}
            placeholder="Add a new todo..."
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              padding: 10,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              height: 40,
            }}
            onPress={addTodo}
          >
            <MaterialCommunityIcons name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RNText style={{ marginRight: 10, fontSize: 16 }}>Priority:</RNText>
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
                  borderColor: newTodo.priority === item.key ? item.color : "#ccc",
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
                    fontWeight: newTodo.priority === item.key ? "bold" : "normal",
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

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
              backgroundColor: "white",
            }}
          >
            <View style={{ flex: 1 }}>
              <RNText style={{ fontSize: 16 }}>{item.title}</RNText>
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
              </View>
            </View>
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
              onPress={() => EditTodo(item.id)}
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
              <MaterialCommunityIcons name="trash-can" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default Index;
