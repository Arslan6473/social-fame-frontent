import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login, updateProfile} from "../Redux/features/userSlice";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { uploadFile } from "../utils/cloudinaryUpload";
import { apiRequest } from "../utils/apiRequest";

function EditProfile() {
  const { user } = useSelector(getUser);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picture, setPicture] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { ...user } });

  const updateHandle = async (data) => {
    const { firstName, lastName, profession, location } = data;
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const profileUrl = picture && (await uploadFile(picture));
      const response = await apiRequest({
        url: "/users/update-user",
        token:user.token,
        data: { firstName, lastName, profession, location, profileUrl },
        method: "PUT",
      });
      if (response.success) {
        const token = user.token;
        dispatch(login({ token, ...response.data }));
          dispatch(updateProfile(false))
     
      }
      setErrorMessage({ success: response.success, message: response.message });
    } catch (error) {
      setErrorMessage({ success: false, message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    dispatch(updateProfile(false));
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="min-h-screen flex justify-center items-center pt-4 px-4 pb-20 text-center sm:block sm:pb-0">
        <div
          className="inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="flex justify-between px-6 pt-5 pb-0">
            <label
              htmlFor="editProfile"
              className="block font-medium text-xl text-ascent-1 text-left"
            >
              Edit Profile
            </label>
            <button className="text-ascent-1" onClick={handleClose}>
              <MdClose size={22} />
            </button>
          </div>
          <form
            className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
            onSubmit={handleSubmit(updateHandle)}
          >
            <TextInput
              label="First Name"
              type="text"
              placeholder="First Name"
              styles="w-full"
              register={register("firstName", {
                required: "First Name is required",
              })}
              error={errors.firstName ? errors.firstName.message : ""}
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              styles="w-full"
              type="text"
              register={register("lastName", {
                required: "Last Name is required",
              })}
              error={errors.lastName ? errors.lastName.message : ""}
            />
            <TextInput
              label="Profession"
              placeholder="Profession"
              styles="w-full"
              type="text"
              register={register("profession", {
                required: "Profession is required",
              })}
              error={errors.profession ? errors.profession.message : ""}
            />
            <TextInput
              label="Location"
              placeholder="Location"
              styles="w-full"
              type="text"
              register={register("location", {
                required: "Location does not match",
              })}
              error={errors.location ? errors.location.message : ""}
            />

            <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4">
              <input
                type="file"
                className=""
                id="imgUpload"
                onChange={(e) => setPicture(e.target.files[0])}
                accept=".jpg, .jpeg, .png"
              />
            </label>

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

            <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645s]">
              {isSubmitting ? (
                <Loading />
              ) : (
                <CustomButton
                  type="submit"
                  title="Submit"
                  containerStyles="inline-flex justify-center rounded-md bg-[#065ad8] px-8 py-3 text-sm font-medium text-white outline-none"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
