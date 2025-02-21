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

const Todo = () => {
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
  const currentTime = moment().format("MMMM Do YYYY, h:mm:ss a");

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

  // console.log(tasks);

  // const [allTasks, allSetTasks] = useState({});

  const handleMoveToInProgress = (taskId) => {
    // Logic to move task to In Progress
    console.log(taskId);

    axios
      .put(`http://localhost:5000/tasks/${taskId}?category=in-progress`)
      .then((res) => {
        console.log(res.data);
        if (res.data.modifiedCount > 0) {
          toast.success("Task marks as Progress.");
          refetch();
        }
      });
  };

  const handleMoveToDone = (taskId) => {
    // Logic to move task to Done
    axios
      .put(`http://localhost:5000/tasks/${taskId}?category=done`)
      .then((res) => {
        console.log(res.data);
        if (res.data.modifiedCount > 0) {
          toast.success("Task marks as Done.");
          refetch();
        }
      });
  };
  const handleMoveToDo = (taskId) => {
    // Logic to move task to Done
    axios
      .put(`http://localhost:5000/tasks/${taskId}?category=todo`)
      .then((res) => {
        console.log(res.data);
        if (res.data.modifiedCount > 0) {
          toast.success("Task marks as Todo.");
          refetch();
        }
      });
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

  const handleEditModal = (taskId) => {
    // Logic to edit task, can open a modal or a form
    console.log(taskId);
    document.getElementById("my_modal_5").showModal();
    const task = tasks.find((task) => task.id === taskId);
    setEditableTask(task);
    console.log(task);
  };
  useEffect(() => {
    if (editableTask) {
      setValue("id", editableTask?.id);
      setValue("title", editableTask?.title || "");
      setValue("description", editableTask?.description || "");
      setValue("category", editableTask?.category || "todo");
    }
  }, [editableTask, setValue]);
  // const handleUpdateTask = (e) => {
  //   // console.log(id);
  //   e.preventDefault(); // Prevent form submission

  //   const formElement = e.target;
  //   const title = formElement.title.value; // Accessing the title input
  //   const description = formElement.description.value;
  //   const updateTaskInfo = {
  //     title,
  //     description,
  //     currentTime,
  //   };
  //   console.log(updateTaskInfo);
  // };
  const handleClose = () => {
    document.getElementById("my_modal_5").close();
    reset();
  };
  const onSubmit = (data) => {
    const updatedTask = {
      title: data?.title,
      description: data?.description,
      category: data?.category,
      timestamp: currentTime,
    };

    axios
      .put(`http://localhost:5000/tasks/${editableTask?.id}`, updatedTask)
      .then((res) => {
        console.log(res.data);
        if (res.data.matchedCount > 0 || res.data.modifiedCount > 0) {
          toast.success("Task updated.");
          refetch();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log(updatedTask);

    // reset();
    document.getElementById("my_modal_5").close();
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
      timestamp: currentTime, // You can adjust this format as per your requirement
    };
    // console.log(newTask);

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
          className="w-full p-2 mb-4 border border-gray-200 rounded-md"
          required
        />
        <textarea
          placeholder="Task Description"
          name="description" // Add name attribute for description
          className="w-full p-2 mb-4 border border-gray-200 rounded-md"
          required
        />
        <select
          className="w-full p-2 mb-4 border border-gray-200 rounded-md"
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
                    onClick={() => handleEditModal(task.id)}
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
                    onClick={() => handleEditModal(task.id)}
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
                    onClick={() => handleEditModal(task.id)}
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
        {/* modal */}
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        {/* <button
          className="btn"
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          open modal
        </button> */}
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
