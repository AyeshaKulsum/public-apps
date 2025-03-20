"use client"

import React, { useState } from "react";
import { Flex, Text, Heading, Button, Input } from "@sparrowengg/twigs-react";

export default function Main() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false }]);
      setTask("");
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column" gap="$3" css={{ width: "100%", height: "100vh" }}>
      <Heading size="h4" weight="medium">Simple To-Do App</Heading>
      <Flex gap="$2">
        <Input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <Button onClick={addTask} color="primary">Add</Button>
      </Flex>
      <Flex flexDirection="column" gap="$2" css={{ width: "100%", maxWidth: "400px" }}>
        {tasks.length === 0 ? (
          <Text css={{ textAlign: "center", color: "gray" }}>No tasks yet. Add one above!</Text>
        ) : (
          tasks.map((task) => (
            <Flex key={task.id} justifyContent="space-between" alignItems="center" css={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
              <Text css={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.text}
              </Text>
              <Flex gap="$2">
                <Button onClick={() => toggleTaskCompletion(task.id)} color={task.completed ? "secondary" : "success"} size="sm">
                  {task.completed ? "Undo" : "Complete"}
                </Button>
                <Button onClick={() => removeTask(task.id)} color="danger" size="sm">Remove</Button>
              </Flex>
            </Flex>
          ))
        )}
      </Flex>
    </Flex>
  );
}
