import useAuth from "../../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();
  console.log("from home user", user);
  return (
    <div>
      <h2 className="text-red-500">Home</h2>
      <div>
        <button className="bg-green-400 btn">
          Click me {user?.displayName}
        </button>
      </div>
    </div>
  );
};

export default Home;
