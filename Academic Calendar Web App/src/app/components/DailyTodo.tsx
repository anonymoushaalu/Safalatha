import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

export function DailyTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  const saveTodos = (updatedTodos: Todo[]) => {
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        date: today,
      };
      saveTodos([...todos, todo]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    saveTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    saveTodos(todos.filter((todo) => todo.id !== id));
  };

  const todayTodos = todos.filter((todo) => todo.date === today);
  const completedCount = todayTodos.filter((t) => t.completed).length;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Daily To-Do List</h1>

      <Card>
        <CardHeader>
          <CardTitle>
            Today's Tasks ({completedCount}/{todayTodos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
            />
            <Button onClick={addTodo}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {todayTodos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No tasks for today. Add one to get started!
              </p>
            ) : (
              todayTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
