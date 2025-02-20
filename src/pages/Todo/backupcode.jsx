import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";

const initialTasks = {
  todo: [{ id: "1", content: "Task 1" }],
  inProgress: [{ id: "2", content: "Task 2" }],
  done: [{ id: "3", content: "Task 3" }],
};

const Todo = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editContent, setEditContent] = useState("");

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
    if (newTask.trim() === "") return;
    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, { id: Date.now().toString(), content: newTask }],
    }));
    setNewTask("");
  };

  const deleteTask = (column, index) => {
    setTasks((prev) => {
      const updatedColumn = [...prev[column]];
      updatedColumn.splice(index, 1);
      return { ...prev, [column]: updatedColumn };
    });
  };

  const startEditing = (task, column) => {
    setEditingTask({ ...task, column });
    setEditContent(task.content);
  };

  const saveEdit = () => {
    if (!editingTask || editContent.trim() === "") return;
    setTasks((prev) => {
      const updatedColumn = prev[editingTask.column].map((task) =>
        task.id === editingTask.id ? { ...task, content: editContent } : task
      );
      return { ...prev, [editingTask.column]: updatedColumn };
    });
    setEditingTask(null);
    setEditContent("");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Task Management</h2>

      {/* Add Task Input */}
      <div className="flex mb-4">
        <input
          type="text"
          className="p-2 border rounded-l-md"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
          onClick={addTask}
        >
          Add
        </button>
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
                          className="p-2 my-2 bg-blue-100 rounded shadow flex justify-between items-center"
                        >
                          {editingTask && editingTask.id === task.id ? (
                            <input
                              type="text"
                              className="p-1 border rounded"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                            />
                          ) : (
                            <span>{task.content}</span>
                          )}

                          <div className="flex items-center space-x-2">
                            {editingTask && editingTask.id === task.id ? (
                              <button
                                className="text-green-500 text-sm"
                                onClick={saveEdit}
                              >
                                <IoCheckmarkDone />
                              </button>
                            ) : (
                              <button
                                className="text-yellow-500 text-sm"
                                onClick={() => startEditing(task, column)}
                              >
                                <CiEdit />
                              </button>
                            )}
                            <button
                              className="text-red-500 text-sm"
                              onClick={() => deleteTask(column, index)}
                            >
                              <MdDeleteOutline />
                            </button>
                          </div>
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
