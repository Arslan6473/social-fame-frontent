import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login, updateProfile } from "../Redux/features/userSlice";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
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
  const [picturePreview, setPicturePreview] = useState(user?.profileUrl || null);
  const fileInputRef = useRef(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { ...user } });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPicture(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPicturePreview(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };



  const updateHandle = async (data) => {
    const { firstName, lastName, profession, location } = data;
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const profileUrl = picture && (await uploadFile(picture));
      const response = await apiRequest({
        url: "/users/update-user",
        token: user.token,
        data: { firstName, lastName, profession, location, profileUrl },
        method: "PUT",
      });
      if (response.success) {
        const token = user.token;
        dispatch(login({ token, ...response.data }));
        dispatch(updateProfile(false));
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
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {picturePreview ? (
                  <>
                    <img
                      src={picturePreview}
                      alt="Profile Preview"
                      className="w-32 h-32 rounded-full object-cover border-2 border-ascent-1"
                    />
                 
                  </>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-inputBg flex items-center justify-center">
                    <BiImageAdd size={32} className="text-ascent-2" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 text-ascent-2 hover:text-ascent-1 px-4 py-2 rounded-lg bg-inputBg"
                >
                  <BiImageAdd size={20} />
                  <span>{picture ? "Change Photo" : "Add Photo"}</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".jpg, .jpeg, .png"
                />
                <p className="text-xs text-ascent-2 mt-1">
                  JPG, JPEG or PNG (Max 5MB)
                </p>
              </div>
            </div>

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
                required: "Location is required",
              })}
              error={errors.location ? errors.location.message : ""}
            />

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

            <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
              {isSubmitting ? (
                <Loading />
              ) : (
                <CustomButton
                  type="submit"
                  title="Save Changes"
                  containerStyles="inline-flex justify-center rounded-md bg-[#065ad8] px-8 py-3 text-sm font-medium text-white outline-none hover:bg-[#0548b0] transition-colors"
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