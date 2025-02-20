import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import moment from "moment";
import { FiTrash } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";

const initialTasks = {
  todo: [
    {
      id: "1",
      title: "Task 1",
      description: "First task",
      timestamp: moment().format("LLL"),
    },
  ],
  inProgress: [
    {
      id: "2",
      title: "Task 2",
      description: "Second task",
      timestamp: moment().format("LLL"),
    },
  ],
  done: [
    {
      id: "3",
      title: "Task 3",
      description: "Completed task",
      timestamp: moment().format("LLL"),
    },
  ],
};

const Todo = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editing, setEditing] = useState(null);
  console.log("tasks: ", tasks);
  console.log("new task", newTask);
  console.log("editing", editing);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    const updatedTasks = { ...tasks };
    const movedTask = updatedTasks[sourceColumn].splice(source.index, 1)[0];

    updatedTasks[destinationColumn].splice(destination.index, 0, movedTask);
    setTasks(updatedTasks);
  };

  const addTask = () => {
    if (newTask.title.trim() === "" || newTask.title.length > 50) return;

    const taskToAdd = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description.slice(0, 200),
      timestamp: moment().format("LLL"),
    };

    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, taskToAdd],
    }));
    setNewTask({ title: "", description: "" });
  };

  const deleteTask = (column, index) => {
    setTasks((prev) => {
      const updatedColumn = [...prev[column]];
      updatedColumn.splice(index, 1);
      return { ...prev, [column]: updatedColumn };
    });
  };

  const startEditing = (column, index) => {
    if (editing && editing.column === column && editing.index === index) {
      // If clicking the same task again, reset to add mode
      setEditing(null);
      setNewTask({ title: "", description: "" });
    } else {
      // Start editing a new task
      const task = tasks[column][index];
      setEditing({ column, index, task });
      setNewTask({ title: task.title, description: task.description });
    }
  };

  const updateTask = () => {
    if (newTask.title.trim() === "" || newTask.title.length > 50) return;

    setTasks((prev) => {
      const updatedColumn = [...prev[editing.column]];
      updatedColumn[editing.index] = {
        ...updatedColumn[editing.index],
        title: newTask.title,
        description: newTask.description.slice(0, 200),
        timestamp: moment().format("LLL"), // Update timestamp
      };
      return { ...prev, [editing.column]: updatedColumn };
    });

    setEditing(null);
    setNewTask({ title: "", description: "" });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Task Management</h2>

      {/* Add/Edit Task Input */}
      <div className="flex flex-col mb-4 w-full max-w-md bg-white p-4 rounded-md shadow">
        <input
          type="text"
          className="p-2 border rounded mb-2"
          placeholder="Task Title (Max 50 chars)"
          value={newTask.title}
          maxLength={50}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          className="p-2 border rounded mb-2"
          placeholder="Description (Optional, Max 200 chars)"
          value={newTask.description}
          maxLength={200}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        {editing ? (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={updateTask}
          >
            Update Task
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={addTask}
          >
            Add Task
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
          {["todo", "inProgress", "done"].map((column) => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 rounded-md shadow-md min-h-[300px] flex flex-col"
                >
                  <h3 className="font-semibold text-lg capitalize mb-2">
                    {column.replace(/([A-Z])/g, " $1")}
                  </h3>

                  {tasks[column].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 my-2 bg-blue-100 rounded shadow flex flex-col"
                        >
                          <div className="flex justify-between">
                            <strong>{task.title}</strong>
                            <div>
                              <button
                                className="text-yellow-500 text-sm mr-2"
                                onClick={() => startEditing(column, index)}
                              >
                                <FaRegEdit />
                              </button>
                              <button
                                className="text-red-500 text-sm"
                                onClick={() => deleteTask(column, index)}
                              >
                                <FiTrash />
                              </button>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-gray-700 text-sm mt-1">
                              {task.description}
                            </p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            📅 {task.timestamp}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Todo;
