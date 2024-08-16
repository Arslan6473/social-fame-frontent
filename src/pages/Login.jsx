import React, { useState } from "react";
import { TbSocial } from "react-icons/tb";
import { TextInput, Loading, CustomButton } from "../components";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { bgImage } from "../assets";
import { BsShare } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { AiOutlineInteraction } from "react-icons/ai";
import { apiRequest } from "../utils/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../Redux/features/userSlice";

function Login() {
  const dispatch = useDispatch();
  const { user } = useSelector(getUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandle = async (data) => {
    const { email, password } = data;

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const response = await apiRequest({
        url: "/users/login",
        data: { email, password },
        method: "POST",
      });
      if (response.success === true) {
        const token = response.token
        dispatch(login({token, ...response.data}));
        reset();
      }
      setErrorMessage({ success: response.success, message: response.message });
    } catch (error) {
      setErrorMessage({ success: error.success, message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {user && <Navigate to="/" replace={true} />}
      <div className="bg-bgColor w-full h-[100vh] flex justify-center items-center p-6">
        <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl ">
          {/* Left */}
          <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
            <div className="flex w-full gap-2 items-center mb-6">
              <div className="p-2 bg-[#065ad8] rounded text-white">
                <TbSocial />
              </div>
              <span className="text-xl text-[#065ad8] font-semibold">
                Social Fame
              </span>
            </div>
            <p className="text-ascent-1 font-semibold text-lg ">
              Login to your account
            </p>
            <span className="text-lg mt-2 text-ascent-2">Welcome back 👋</span>

            <form
              className="py-8 flex flex-col gap-5"
              onSubmit={handleSubmit(submitHandle)}
            >
              <TextInput
                name="email"
                type="email"
                placeholder="example@email.com"
                label="Email Address"
                styles="w-full rounded-full"
                labelStyles="ml-2"
                register={register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                    message: "Must be a valid email",
                  },
                })}
                error={errors.email && errors.email.message}
              />

              <TextInput
                name="password"
                type="password"
                placeholder="Password"
                label="Password"
                styles="w-full rounded-full"
                labelStyles="ml-2"
                register={register("password", {
                  required: "Password is required",
                })}
                error={errors.password && errors.password.message}
              />

              <Link
                to="/reset-password"
                className="text-right text-sm text-[#065ad8] font-semibold"
              >
                Forget password
              </Link>

              {errorMessage && (
                <span
                  className={`text-sm ${
                    errorMessage.success === false
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errorMessage.message}
                </span>
              )}

              {isSubmitting ? (
                <Loading />
              ) : (
                <CustomButton
                  type="submit"
                  title="Login"
                  containerStyles="inline-flex justify-center rounded-md bg-[#065ad8] px-8 py-3 text-sm font-medium text-white outline-none"
                />
              )}
            </form>

            <p className="text-ascent-2 text-sm text-center">
              Don't have an account?
              <Link
                to="/register"
                className="text-sm font-semibold ml-2 cursor-pointer text-[#065ad8]"
              >
                Create Account
              </Link>
            </p>
          </div>
          {/* Right */}
          <div className="hidden w-1/2 h-full items-center lg:flex flex-col justify-center bg-[#065ad8]">
            <div className="relative w-full flex items-center justify-center">
              <img
                src={bgImage}
                alt="Background Image"
                className="w-56 2xl:w-64 h-56 rounded-full 2xl:h-64 object-cover"
              />
              <div className="absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full">
                <BsShare size={14} />
                <span className="text-xs font-medium">share</span>
              </div>
              <div className="absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full">
                <ImConnection size={14} />
                <span className="text-xs font-medium">share</span>
              </div>
              <div className="absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full">
                <AiOutlineInteraction size={14} />
                <span className="text-xs font-medium">share</span>
              </div>
            </div>
            <div className="mt-16 text-center">
              <p className="text-white text-base">
                Connect with friends & have share for fun
              </p>
              <span className="text-sm text-white/80">
                Share memories with friends and world.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
