import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="border-b border-gray-300 ">
      <div className="navbar container mx-auto px-4">
        <div className="navbar-start">
          <Link to="/" className=" text-xl">
            TODO
          </Link>
        </div>
        {/* hidden lg:flex */}
        <div className="navbar-center ">
          <ul className="flex items-center justify-center gap-4">
            <NavLink to="/">
              <li className="  rounded-sm ">Home</li>
            </NavLink>
            <NavLink to="/todo">
              <li className="rounded-sm ">TODO</li>
            </NavLink>
          </ul>
        </div>
        <div className="navbar-end">
          {user && user?.email ? (
            <button
              onClick={handleLogOut}
              className="btn bg-primary text-white"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn bg-green-600 text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
