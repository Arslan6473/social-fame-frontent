import React from "react";
import { MdClose } from "react-icons/md";
import CustomButton from "./CustomButton";

function DialogBox({ title, setIsOpen,handleDelete }) {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto mt-56 shadow-lg">
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
              {title}
            </label>
            <button className="text-ascent-1" onClick={handleClose}>
              <MdClose size={22} />
            </button>
          </div>
     
            <p className="flex justify-between px-6 pt-2 pb-2 text-white">
                Do You really want to delete the post?
            </p>
    

          <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645s] gap-4 px-4">
            <CustomButton
              title="Delete"
              onClick={() => handleDelete()}
              containerStyles="inline-flex justify-center rounded-md bg-[red] px-6 py-3 text-sm font-medium text-white outline-none"
            />

            <CustomButton
              title="Cancel"
              containerStyles="inline-flex justify-center rounded-md bg-transparent border border-2-white px-6 py-3 text-sm font-medium text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DialogBox;
