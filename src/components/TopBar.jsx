import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/features/userSlice";
import { getTheme, setTheme } from "../Redux/features/themeSlice";
import { Link } from "react-router-dom";
import { TbSocial } from "react-icons/tb";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { setAllPosts } from "../Redux/features/postSlice";

function TopBar({ setSearch }) {
  const dispatch = useDispatch();
  const theme = useSelector(getTheme);

  const { register, handleSubmit, reset } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "dark" ? "light" : "dark";

    dispatch(setTheme(themeValue));
  };

  const searchHandle = async (data) => {
    setSearch(data.search);
    reset ()
  };

  const logoutHandle = () => {
    dispatch(logout());
  };
  return (
    <div className=" w-full flex justify-between py-3 items-center px-4 md:py-6 bg-primary rounded mt-4">
      <Link to="/" className="flex gap-2 items-center">
        <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white">
          <TbSocial />
        </div>
        <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
          Social Fame
        </span>
      </Link>

      <form
        className="hidden md:flex justify-center items-center"
        onSubmit={handleSubmit(searchHandle)}
      >
        <TextInput
          type="text"
          name="search"
          placeholder="Search..."
          styles="w-[18rem] lg:w-[38rem] py-3 rounded-l-full "
          register={register("search")}
        />
        <CustomButton
          title="Search"
          type="submit"
          containerStyles="bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full"
        />
      </form>

      <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
        <button onClick={handleTheme}>
          {theme === "light" ? <BsMoon size={22} /> : <BsSunFill size={22} />}
        </button>
        <IoMdNotificationsOutline size={23} />
      </div>

      <div>
        <CustomButton
          onClick={logoutHandle}
          title="Logout"
          containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
        />
      </div>
    </div>
  );
}

export default TopBar;
