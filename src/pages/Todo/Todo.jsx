import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment/moment";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { RiCalendarTodoLine, RiProgress1Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";

const Todo = () => {
  const { user } = useAuth();

  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/tasks?email=${user?.email}`
        );
        return res.data || []; // Ensure an array is returned, even if data is empty
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return []; // Return empty array in case of error
      }
    },
  });

  console.log(tasks);

  // const [allTasks, allSetTasks] = useState({});

  const handleMoveToInProgress = (taskId) => {
    // Logic to move task to In Progress
  };

  const handleMoveToDone = (taskId) => {
    // Logic to move task to Done
  };
  const handleMoveToDo = (taskId) => {
    // Logic to move task to Done
  };

  const handleDelete = (taskId) => {
    // Logic to delete task
    console.log(taskId);

    axios.delete(`http://localhost:5000/tasks/${taskId}`).then((res) => {
      console.log(res.data);
      if (res.data.deletedCount > 0) {
        toast.success("Task deleted.");
        refetch();
      }
    });
  };

  const handleEdit = (taskId) => {
    // Logic to edit task, can open a modal or a form
    console.log("Edit task with ID:", taskId);
  };

  const handleAddTask = (e) => {
    e.preventDefault(); // Prevent form submission

    const formElement = e.target;
    const title = formElement.title.value; // Accessing the title input
    const description = formElement.description.value; // Accessing the description textarea
    const category = formElement.category.value; // Accessing the category select

    const newTask = {
      id: new Date().getTime(), // Generate a unique ID (you can replace this with a backend-generated ID)
      title: title,
      description: description,
      category: category,
      taskUser: user?.email,
      timestamp: moment().format("MMMM Do YYYY, h:mm:ss a"), // You can adjust this format as per your requirement
    };
    console.log(newTask);

    axios
      .post("http://localhost:5000/tasks", newTask)
      .then((res) => {
        console.log(res.data);
        if (res.data?.insertedId) {
          toast.success("Task added");
          refetch();
        }
      })
      .catch((err) => {
        console.log(err.message);
      });

    // Reset form
    formElement.reset();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Task Management</h1>

      {/* Add Task Form */}
      <form
        onSubmit={handleAddTask}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add New Task
        </h2>
        <input
          type="text"
          name="title" // Add name attribute for title
          placeholder="Task Title"
          className="w-full p-2 mb-4 border rounded-md"
          required
        />
        <textarea
          placeholder="Task Description"
          name="description" // Add name attribute for description
          className="w-full p-2 mb-4 border rounded-md"
          required
        />
        <select
          className="w-full p-2 mb-4 border rounded-md"
          name="category" // Add name attribute for category
        >
          <option value="todo">To-Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
        >
          Add Task
        </button>
      </form>

      {/* Task Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* To-Do Column */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">To-Do</h2>
          {tasks
            .filter((task) => task.category === "todo")
            .map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow-sm mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Timestamp: {task.timestamp}
                </p>
                <div className="mt-4 flex justify-between space-x-2">
                  <button
                    onClick={() => handleMoveToInProgress(task.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    <RiProgress1Line />
                  </button>
                  <button
                    onClick={() => handleMoveToDone(task.id)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                  >
                    <IoCheckmarkDone />
                  </button>
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
                  >
                    <CiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* In Progress Column */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            In Progress
          </h2>
          {tasks
            .filter((task) => task.category === "in-progress")
            .map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow-sm mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Timestamp: {task.timestamp}
                </p>
                <div className="mt-4 flex justify-between space-x-2">
                  <button
                    onClick={() => handleMoveToDo(task.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    <RiCalendarTodoLine />
                  </button>
                  <button
                    onClick={() => handleMoveToDone(task.id)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                  >
                    <IoCheckmarkDone />
                  </button>
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
                  >
                    <CiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Done Column */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Done</h2>
          {tasks
            .filter((task) => task.category === "done")
            .map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow-sm mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Timestamp: {task.timestamp}
                </p>
                <div className="mt-4 flex justify-between space-x-2">
                  <button
                    onClick={() => handleMoveToDo(task.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    <RiCalendarTodoLine />
                  </button>
                  <button
                    onClick={() => handleMoveToInProgress(task.id)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                  >
                    <RiProgress1Line />
                  </button>
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
                  >
                    <CiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;
