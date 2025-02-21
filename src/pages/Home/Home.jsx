const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Welcome to Todo Tracker
        </h2>
        <p className="text-lg text-gray-600 text-center mb-6">
          Manage your tasks effortlessly. Stay organized and productive with our
          easy-to-use Todo app.
        </p>
        <div className="text-center">
          <a
            href="/todo" // Replace with your actual route
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
          >
            Start Managing Tasks
          </a>
        </div>
        {/* <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help? Check our <a href="/faq" className="text-blue-500 hover:underline">FAQ</a>.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
