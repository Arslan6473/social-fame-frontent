import React, { useState } from "react";
import { TextInput, Loading, CustomButton } from "../components";
import { useForm } from "react-hook-form";
import { TbSocial } from "react-icons/tb";
import { apiRequest } from "../utils/apiRequest";

function ResetPassword() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const submitHandle = async (data) => {
    const {email } = data;

    try {
      setIsSubmitting(true);
      setErrorMessage("")
      const response = await apiRequest({
        url: "/users/verify/reset-password",
        data: {email },
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
    <div className="w-full h-[100vh] flex justify-center items-center p-6 bg-bgColor">
      <div className="bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg ">
      <div className="flex w-full gap-2 items-center mb-6">
            <div className="p-2 bg-[#065ad8] rounded text-white">
              <TbSocial />
            </div>
            <span className="text-xl text-[#065ad8] font-semibold">
              Social Fame
            </span>
          </div>
        <p className="text-ascent-1 text-lg font-semibold">Email Address</p>
        <span className="text-sm text-ascent-2">
          Enter email address used during registration
        </span>
        <form
          onSubmit={handleSubmit(submitHandle)}
          className="py-8 flex flex-col gap-5"
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

          {errorMessage?.message && (
            <span
              className={`text-sm ${
                errorMessage.status === "failed"
                  ? "text-[#f64949fe]"
                  : "text-[#2ba150fe]"
              } mt-0.5`}
            >
              {errorMessage?.message}
            </span>
          )}

          {isSubmitting ? (
            <Loading />
          ) : (
            <CustomButton
              type="submit"
              title="Submit"
              containerStyles="inline-flex justify-center rounded-md bg-[#065ad8] px-8 py-3 text-sm mt-4 font-medium text-white outline-none"
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
