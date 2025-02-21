import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { FiUser } from "react-icons/fi";
import { TbLogout2 } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { LuListTodo } from "react-icons/lu";
import { GoHome } from "react-icons/go";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
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
          <Link to="/" className="font-semibold text-xl">
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
            <div className="flex items-center">
              {/* <p>{user && user?.displayName}</p>
              <button
                onClick={handleLogOut}
                className="btn bg-primary text-white"
              >
                Logout
              </button> */}
              <div className="flex items-center gap-[15px]">
                <div
                  className="flex items-center gap-[10px] cursor-pointer relative"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                >
                  <div className="relative">
                    <img
                      src={user?.photoURL}
                      alt={user?.displayName}
                      title={user?.displayName}
                      className="w-[35px] h-[35px] rounded-full object-cover"
                    />
                    <div className="w-[10px] h-[10px] rounded-full bg-green-500 absolute bottom-[0px] right-0 border-2 border-white"></div>
                  </div>

                  <h1 className="text-[1rem] font-[400] text-gray-600 sm:block hidden">
                    {user?.displayName}
                  </h1>

                  <div
                    className={`${
                      accountMenuOpen
                        ? "translate-y-0 opacity-100 z-[1]"
                        : "translate-y-[10px] opacity-0 z-[-1]"
                    } bg-white w-max rounded-md absolute top-[45px] right-0 p-[10px] flex flex-col transition-all duration-300 gap-[5px]`}
                  >
                    <Link
                      to="/"
                      className="flex items-center gap-[5px] rounded-md p-[8px] pr-[45px] py-[3px] text-[1rem] text-gray-600 hover:bg-gray-50"
                    >
                      <GoHome />
                      Home
                    </Link>
                    <Link
                      to="/todo"
                      className="flex items-center gap-[5px] rounded-md p-[8px] pr-[45px] py-[3px] text-[1rem] text-gray-600 hover:bg-gray-50"
                    >
                      <LuListTodo />
                      TODO Tracker
                    </Link>

                    <div className="mt-3 border-t border-gray-200 pt-[5px]">
                      <p
                        onClick={handleLogOut}
                        className="flex items-center gap-[5px] rounded-md p-[8px] pr-[45px] py-[3px] text-[1rem] text-red-500 hover:bg-red-50"
                      >
                        <TbLogout2 />
                        Logout
                      </p>
                    </div>
                  </div>

                  <IoIosArrowUp
                    className={`${
                      accountMenuOpen ? "rotate-0" : "rotate-[180deg]"
                    } transition-all duration-300 text-gray-600 sm:block hidden`}
                  />
                </div>
              </div>
            </div>
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
