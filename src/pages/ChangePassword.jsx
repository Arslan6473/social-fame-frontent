import React, { useState } from "react";
import { TextInput, Loading, CustomButton } from "../components";
import { useForm } from "react-hook-form";
import { TbSocial } from "react-icons/tb";
import { useParams } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { apiRequest } from "../utils/apiRequest";

function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();
  const { id, token } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandle = async (data) => {
    const { password } = data;
    try {
      setIsSubmitting(true);
      setErrorMessage("")
      const response = await apiRequest({
        url: `/users/reset-password/${id}/${token}`,
        data: { password },
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
        <p className="text-ascent-1 text-lg font-semibold">Change Password</p>
        <form
          onSubmit={handleSubmit(submitHandle)}
          className="py-8 flex flex-col gap-5"
        >
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

          <TextInput
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            label="Confirm Password"
            styles="w-full rounded-full "
            labelStyles="ml-2"
            register={register("confirmPassword", {
              validate: (value) => {
                const { password } = getValues();
                if (password !== value) {
                  return "Password does not match";
                }
              },
            })}
            error={errors.confirmPassword && errors.confirmPassword.message}
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
              title="Change password"
              containerStyles="inline-flex justify-center rounded-md bg-[#065ad8] px-8 py-3 text-sm font-medium text-white outline-none mt-4"
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
