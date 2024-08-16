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

function Register() {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandle = async (data) => {
    const { firstName, lastName, email, password } = data;

    try {
      setIsSubmitting(true);
      setErrorMessage("")
      const response = await apiRequest({
        url: "/users/register",
        data: { firstName, lastName, email, password },
        method: "POST",
      });
      setErrorMessage({ success: response.success, message: response.message });
      reset();
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="bg-bgColor w-full h-[100vh] flex justify-center items-center p-6">
        <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-xl ">
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
              Create your account
            </p>

            <form
              className="py-8 flex flex-col gap-5"
              onSubmit={handleSubmit(submitHandle)}
            >
              <div className="w-full flex flex-col lg:flex-row gap-2 md:gap-2">
                <TextInput
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  label="First Name"
                  styles="w-full "
                  labelStyles="ml-2"
                  register={register("firstName", {
                    required: "First name is required",
                  })}
                  error={errors.firstName && errors.firstName.message}
                />

                <TextInput
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  label="Last Name"
                  styles="w-full "
                  labelStyles="ml-2"
                  register={register("lastName", {
                    required: "Last name is required",
                  })}
                  error={errors.lastName && errors.lastName.message}
                />
              </div>
              <TextInput
                name="email"
                type="email"
                placeholder="example@email.com"
                label="Email Address"
                styles="w-full "
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
              <div className="w-full flex flex-col lg:flex-row gap-2 md:gap-2">
                <TextInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  label="Password"
                  styles="w-full "
                  labelStyles="ml-2"
                  register={register("password", {
                    required: "Password is required",
                  })}
                  error={errors.password && errors.password.message}
                />

                <TextInput
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  label="Confirm Password"
                  styles="w-full "
                  labelStyles="ml-2"
                  register={register("confirmPassword", {
                    validate: (value) => {
                      const { password } = getValues();
                      if (password !== value) {
                        return "Password does not match";
                      }
                    },
                  })}
                  error={
                    errors.confirmPassword && errors.confirmPassword.message
                  }
                />
              </div>

              {errorMessage?.message && (
                <span
                  className={`text-sm ${
                    errorMessage.success === "failed"
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
                  title="Create account "
                  containerStyles="inline-flex justify-center rounded-md bg-[#065ad8] px-8 py-3 text-sm font-medium text-white outline-none"
                />
              )}
            </form>

            <p className="text-ascent-2 text-sm text-center">
              Already have an account?
              <Link
                to="/login"
                className="text-sm font-semibold ml-2 cursor-pointer text-[#065ad8]"
              >
                Login
              </Link>
            </p>
          </div>
          {/* Right */}
          <div className="hidden w-1/2  h-full items-center lg:flex flex-col justify-center bg-[#065ad8]">
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

export default Register;
