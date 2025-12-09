import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type Todo = {
  id: string;
  title: string;
  priority: string;
  completed: boolean;
};

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  addTodo: (title: string, priority: string) => Promise<Todo>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<Todo | undefined>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<Todo | undefined>;
  getTodo: (id: string) => Todo | undefined;
  refreshTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem("todos");
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error("Error loading todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshTodos = async () => {
    await loadTodos();
  };

  const saveTodos = async (updatedTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  const addTodo = async (title: string, priority: string): Promise<Todo> => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      priority,
      completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    await saveTodos(updatedTodos);
    return newTodo;
  };

  const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo | undefined> => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    await saveTodos(updatedTodos);
    return updatedTodos.find((todo) => todo.id === id);
  };

  const deleteTodo = async (id: string): Promise<void> => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    await saveTodos(updatedTodos);
  };

  const toggleTodo = async (id: string): Promise<Todo | undefined> => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      return await updateTodo(id, { completed: !todo.completed });
    }
    return undefined;
  };

  const getTodo = (id: string): Todo | undefined => {
    return todos.find((todo) => todo.id === id);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        getTodo,
        refreshTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
