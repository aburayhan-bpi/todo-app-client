import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { RiCalendarTodoLine, RiProgress1Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";
import { useForm } from "react-hook-form";
import Loader from "../../components/Loader";

const Todo = () => {
  document.title = "TODO | Task Dashboard";
  const [editableTask, setEditableTask] = useState({});
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: editableTask?.id,
      title: editableTask?.title || "",
      description: editableTask?.description || "",
      category: editableTask?.category || "todo", // Default to 'todo'
    },
  });

  const { user } = useAuth();
  const currentTime = moment().utc().format();
  // const currentTime = moment().format("MMMM Do YYYY, h:mm:ss a");

  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `https://todo-task-management-server-omega.vercel.app/tasks?email=${user?.email}`
        );
        return res.data || []; // Ensure an array is returned, even if data is empty
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return []; // Return empty array in case of error
      }
    },
  });

  const handleMoveToCategory = (taskId, category) => {
    axios
      .put(
        `https://todo-task-management-server-omega.vercel.app/tasks/${taskId}?category=${category}`
      )
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          toast.success(`Task moved to ${category}.`);
          refetch();
        }
      });
  };

  const handleDelete = (taskId) => {
    axios
      .delete(
        `https://todo-task-management-server-omega.vercel.app/tasks/${taskId}`
      )
      .then((res) => {
        if (res.data.deletedCount > 0) {
          toast.success("Task deleted.");
          refetch();
        }
      });
  };

  const handleEditModal = (taskId) => {
    document.getElementById("my_modal_5").showModal();
    const task = tasks.find((task) => task.id === taskId);
    setEditableTask(task);
  };
  useEffect(() => {
    if (editableTask) {
      setValue("id", editableTask?.id);
      setValue("title", editableTask?.title || "");
      setValue("description", editableTask?.description || "");
      setValue("category", editableTask?.category || "todo");
    }
  }, [editableTask, setValue]);

  const handleClose = () => {
    document.getElementById("my_modal_5").close();
    // reset();
  };

  const onSubmit = (data) => {
    const updatedTask = {
      title: data?.title,
      description: data?.description,
      category: data?.category,
      timestamp: currentTime,
    };

    axios
      .put(
        `https://todo-task-management-server-omega.vercel.app/tasks/${editableTask?.id}`,
        updatedTask
      )
      .then((res) => {
        if (res.data.matchedCount > 0 || res.data.modifiedCount > 0) {
          toast.success("Task updated.");
          refetch();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    document.getElementById("my_modal_5").close();
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const formElement = e.target;
    const title = formElement.title.value;
    const description = formElement.description.value;

    const newTask = {
      id: new Date().getTime(),
      title,
      description,
      category: "todo",
      taskUser: user?.email,
      timestamp: currentTime,
    };

    axios
      .post(
        "https://todo-task-management-server-omega.vercel.app/tasks",
        newTask
      )
      .then((res) => {
        if (res.data?.insertedId) {
          toast.success("Task added");
          refetch();
        }
      })
      .catch((err) => {
        console.log(err.message);
      });

    formElement.reset();
  };

  // Drag & Drop Functions
  const handleDragStart = (e, taskId, currentCategory) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("currentCategory", currentCategory); // Store current category
  };

  const handleDrop = (e, newCategory) => {
    const taskId = e.dataTransfer.getData("taskId");
    const currentCategory = e.dataTransfer.getData("currentCategory");

    if (newCategory !== currentCategory) {
      // Update only if category changes
      handleMoveToCategory(taskId, newCategory);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Task Management</h1>

      <form
        onSubmit={handleAddTask}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add New Task
        </h2>
        <input
          type="text"
          name="title"
          placeholder="Task Title (max 50 characters)"
          className="w-full p-2 mb-4 border border-gray-200 rounded-md"
          maxLength={50}
          required
        />
        <textarea
          placeholder="Task Description (optional, max 200 characters)"
          name="description"
          className="w-full p-2 mb-4 border border-gray-200 rounded-md"
          maxLength={200}
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
        >
          Add Task
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Todo Column */}
        <div
          onDrop={(e) => handleDrop(e, "todo")}
          onDragOver={handleDragOver}
          className="bg-gray-50 p-4 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">To-Do</h2>
          {isLoading && (
            <div className="flex items-center justify-center">
              <span className="loading loading-ring loading-xl "></span>
            </div>
          )}
          {tasks
            .filter((task) => task.category === "todo")
            .map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id, task.category)}
                className="bg-white p-4 rounded-lg shadow-sm mb-4 cursor-grab"
              >
                <h3 className="text-lg font-semibold text-gray-800 overflow-hidden">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Timestamp:{" "}
                  {moment
                    .utc(task.timestamp)
                    .local()
                    .format("MMMM Do YYYY, h:mm:ss a")}
                </p>
                <p className="text-blue-600 bg-blue-200 capitalize text-xs w-fit px-2 py-1 rounded-lg my-1">
                  {task?.category}
                </p>
                <div className="mt-4 flex justify-between space-x-2">
                  <button
                    onClick={() => handleMoveToCategory(task.id, "in-progress")}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <RiProgress1Line />
                  </button>
                  <button
                    onClick={() => handleMoveToCategory(task.id, "done")}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <IoCheckmarkDone />
                  </button>
                  <button
                    onClick={() => handleEditModal(task.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <CiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* In Progress Column */}
        <div
          onDrop={(e) => handleDrop(e, "in-progress")}
          onDragOver={handleDragOver}
          className="bg-gray-50 p-4 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            In Progress
          </h2>
          {isLoading && (
            <div className="flex items-center justify-center">
              <span className="loading loading-ring loading-xl "></span>
            </div>
          )}
          {tasks
            .filter((task) => task.category === "in-progress")
            .map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id, task.category)}
                className="bg-white p-4 rounded-lg shadow-sm mb-4 cursor-grab"
              >
                <h3 className="text-lg font-semibold text-gray-800 overflow-hidden">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Timestamp:{" "}
                  {moment
                    .utc(task.timestamp)
                    .local()
                    .format("MMMM Do YYYY, h:mm:ss a")}
                </p>
                <p className="text-blue-600 bg-blue-200 capitalize text-xs w-fit px-2 py-1 rounded-lg my-1">
                  {task?.category}
                </p>
                <div className="mt-4 flex justify-between space-x-2">
                  <button
                    onClick={() => handleMoveToCategory(task.id, "todo")}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <RiCalendarTodoLine />
                  </button>
                  <button
                    onClick={() => handleMoveToCategory(task.id, "done")}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <IoCheckmarkDone />
                  </button>
                  <button
                    onClick={() => handleEditModal(task.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <CiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Done Column */}
        <div
          onDrop={(e) => handleDrop(e, "done")}
          onDragOver={handleDragOver}
          className="bg-gray-50 p-4 rounded-lg shadow-md "
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Done</h2>
          {isLoading && (
            <div className="flex items-center justify-center">
              <span className="loading loading-ring loading-xl "></span>
            </div>
          )}
          {tasks
            .filter((task) => task.category === "done")
            .map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id, task.category)}
                className="bg-white p-4 rounded-lg shadow-sm mb-4 cursor-grab"
              >
                <h3 className="text-lg font-semibold text-gray-800 overflow-hidden">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Timestamp:{" "}
                  {moment
                    .utc(task.timestamp)
                    .local()
                    .format("MMMM Do YYYY, h:mm:ss a")}
                </p>
                <p className="text-blue-600 bg-blue-200 capitalize text-xs w-fit px-2 py-1 rounded-lg my-1">
                  {task?.category}
                </p>
                <div className="mt-4 flex justify-between space-x-2">
                  <button
                    onClick={() => handleMoveToCategory(task.id, "todo")}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <RiCalendarTodoLine />
                  </button>
                  <button
                    onClick={() => handleMoveToCategory(task.id, "in-progress")}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <RiProgress1Line />
                  </button>
                  <button
                    onClick={() => handleEditModal(task.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <CiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
        </div>
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box relative">
            {/* Close Button in the Top Right Corner */}
            <button
              className="absolute top-2 right-2 pr-2 cursor-pointer text-gray-600 hover:text-gray-900 transition"
              onClick={handleClose}
            >
              ✕
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="title" className="block font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  {...register("title", { required: true })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter title"
                  defaultValue={editableTask?.title}
                />
                {errors.title && (
                  <span className="text-red-600 text-xs">
                    This field is required
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  {...register("description", { required: true })}
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter description"
                  defaultValue={editableTask?.description}
                ></textarea>
                {errors.description && (
                  <span className="text-red-600 text-xs">
                    This field is required
                  </span>
                )}
              </div>
              <div>
                <select
                  className="w-full p-2 mb-4 border border-gray-200 rounded-md"
                  {...register("category", { required: true })}
                  // defaultValue={defaultValues?.category}
                >
                  <option value="todo">To-Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                {errors.category && (
                  <span className="text-red-600 text-xs">
                    This field is required
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Update Task
              </button>
            </form>

            {/* <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div> */}
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Todo;
