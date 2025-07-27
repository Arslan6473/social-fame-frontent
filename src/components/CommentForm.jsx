import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { noProfile } from "../assets";
import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { apiRequest } from "../utils/apiRequest";

function CommentForm({ id, user, replyAt ,setComments,comments}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const commentHandle = async (data) => {
    const { comment } = data;
    setLoading(true);
    try {
      const url = replyAt 
        ? `/posts/reply-comment/${replyAt}` 
        : `/posts/comment/${id}`;
      
      const response = await apiRequest({
        url,
        token: user.token,
        data: replyAt 
          ? { comment, from: user._id, replyAt } 
          : { comment, from: user._id },
        method: "POST",
      });
  
      if (response.success) {
        const newComment = response.data;
        const newComments = [newComment, ...comments];
        setComments(newComments);
        reset();
      }
    } catch (error) {
      console.log({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <form
        onSubmit={handleSubmit(commentHandle)}
        className="w-full border-b border-[#6666645]"
      >
        <div className="w-full flex pb-3 pt-2 items-center gap-2">
          <img
            src={user?.profileUrl ?? noProfile}
            alt="User Profile"
            className="w-10 h-10 object-cover rounded-full"
          />
          <TextInput
            name="comment"
            styles="w-full rounded-full py-3"
            placeholder={replyAt ? `Reply` : "Comment on this post"}
            register={register("comment", {
              required: "Comment can't be empty",
            })}
            error={errors.comment ? errors.comment.message : ""}
          />
         {loading ? (
                <Loading />
              ) : (
                <CustomButton
                  type="submit"
                  title="Submit"
                  containerStyles="rounded-full bg-[#0444a4] px-3 py-2.5 mt-2 text-sm font-semibold text-white outline-none"
                />
              )}
        </div>
       
              
      </form>
    </div>
  );
}

export default CommentForm;
