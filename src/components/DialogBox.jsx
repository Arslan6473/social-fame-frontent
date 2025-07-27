import React from "react";
import { MdClose } from "react-icons/md";
import CustomButton from "./CustomButton";

function DialogBox({ title, handleClose, handleDelete }) {
  // Prevent click propagation
  const handleDialogClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose} // Close when clicking outside
    >
      <div 
        className="bg-primary rounded-lg w-full max-w-md mx-4"
        onClick={handleDialogClick} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center p-4 border-b border-[#66666645]">
          <h2 className="text-xl font-medium text-ascent-1">{title}</h2>
          <button 
            onClick={handleClose}
            className="text-ascent-1 hover:text-ascent-2"
          >
            <MdClose size={22} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-ascent-1">
            Do you really want to delete the post?
          </p>
        </div>

        <div className="flex justify-end gap-4 p-4 border-t border-[#66666645]">
          <CustomButton
            title="Cancel"
            onClick={handleClose}
            containerStyles="px-4 py-2 text-sm text-ascent-1 hover:bg-[#333] rounded-md"
          />
          <CustomButton
            title="Delete"
            onClick={handleDelete}
            containerStyles="px-4 py-2 text-sm bg-[red] hover:opacity-[50%] text-white rounded-md "
          />
        </div>
      </div>
    </div>
  );
}

export default DialogBox;