import React, { useEffect, useState } from "react";
import { noProfile } from "../assets";
import moment from "moment";
import { BiComment, BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import CommentForm from "./CommentForm";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import DialogBox from "./DialogBox";
import { apiRequest } from "../utils/apiRequest";
import ReplyCard from "./ReplyCard";

function PostCard({ post, user, deletePost, likePost }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(null);
  const [showComments, setShowComments] = useState(null);
  const getComments = async (id) => {
    setReplyComments(0);
    if (showComments !== id) {
      setLoading(true);
      try {
        const response = await apiRequest({
          url: `/posts/comments/${id}`,
          token: user.token,
        });
        if (response.success) {
          setComments(response.data);
        }
      } catch (error) {
        console.log({ success: false, message: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLikeOnComment = async (id, rid) => {
    try {
      const response = await apiRequest({
        url: `/posts/like-comment/${id}/${rid}`,
        token: user.token,
      });
      if (response.success===true) {
        const index = comments.findIndex((comment) => comment._id === id);
        const newComments = [...comments];
        newComments.splice(index, 1, response.data);
        setComments(newComments);
      }
    } catch (error) {
      console.log({ success: false, message: error.message });
    }
  };

  const handleDeletePost = async(id)=>{
    deletePost(id)
    setIsOpen(false)
  }

  return (
    <>
      <div className="mb-2 bg-primary p-4 rounded-xl">
        <div className="flex gap-3 items-center mb-2 ">
          <Link to={`/profile/${post?.userId?._id}`}>
            <img
              src={post?.userId?.profileUrl ?? noProfile}
              alt={post?.userId?.firstName}
              className="w-14 object-cover rounded-full"
            />
          </Link>
          <div className="w-full justify-between flex">
            <div>
              <Link to={`/profile/${post?.userId?._id}`}>
                <p className="font-medium text-xl text-ascent-1">
                  {post?.userId?.firstName} {post?.userId?.lastName}
                </p>
              </Link>
              <span className="text-ascent-2">{post?.userId?.location}</span>
            </div>
            <span className="text-ascent-2">
              {moment(post?.createdAt).fromNow()}
            </span>
          </div>
        </div>
        <div>
          <p className="text-ascent-2">
            {showAll === post?._id
              ? post?.description
              : post?.description.slice(0, 300)}
            {post?.description.length > 301 &&
              (showAll === post?._id ? (
                <span
                  className="text-[#065ad8] font-medium ml-2 cursor-pointer"
                  onClick={() => setShowAll(0)}
                >
                  Show Less
                </span>
              ) : (
                <span
                  className="text-[#065ad8] font-medium ml-2 cursor-pointer"
                  onClick={() => setShowAll(post?._id)}
                >
                  Show More
                </span>
              ))}
          </p>

          {post?.image && (
            <img
              src={post?.image}
              alt="Post Image"
              className="rounded-lg w-full mt-2"
            />
          )}
        </div>
        {/* like and comments */}
        <div className="mt-4 flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]">
          <p className="flex gap-2 items-center text-base cursor-pointer ">
            {post?.likes?.includes(user?._id) ? (
              <BiSolidLike
                size={20}
                className="text-[#065ad8]"
                onClick={() => likePost(post._id)}
              />
            ) : (
              <BiLike size={20} onClick={() => likePost(post._id)} />
            )}
            {post?.likes?.length} Likes
          </p>
          <p
            onClick={() => {
              setShowComments(showComments === post?._id ? null : post?._id);
              getComments(post?._id);
            }}
            className="flex gap-2 items-center text-base cursor-pointer"
          >
            <BiComment size={20} />
            {post?.comments?.length} Comments
          </p>
          {user?._id === post?.userId?._id && (
            <div
              onClick={() => setIsOpen(true)}
              className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
            >
              <MdOutlineDeleteOutline size={20} />
              <span>Delete</span>
              {isOpen && (
                <DialogBox
                  title={"Delete Post"}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  handleDelete={() => handleDeletePost(post._id)}
                />
              )}
            </div>
          )}
        </div>
        {/* comments */}
        {showComments === post?._id && (
          <div className="w-full mt-4 border-t border-[#66666645] pt-4">
            <CommentForm
                key={post?._id}
              user={user}
              id={post?._id}
              setComments={setComments}
              comments={comments}
            />
            {loading ? (
              <Loading />
            ) : comments?.length > 0 ? (
              comments.map((comment) => (
                <div className="py-2 w-full" key={comment?._id}>
                  <div className="flex gap-3 mb-1 items-center">
                    <Link to={`/profile/${comment?.userId?._id}`}>
                      <img
                        src={comment?.userId?.profileUrl}
                        alt={comment?.userId?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    </Link>
                    <div>
                      <Link to={`/profile/${comment?.userId?._id}`}>
                        <p className="font-medium text-base text-ascent-1">
                          {comment?.userId?.firstName}{" "}
                          {comment?.userId?.lastName}
                        </p>
                      </Link>
                      <span className="text-ascent-2 text-sm">
                        {moment(comment?.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-12">
                    <p className="text-ascent-2">{comment?.comment}</p>
                    <div className="flex mt-2 gap-6">
                      <p className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer">
                        {comment?.likes.includes(user?._id) ? (
                          <BiSolidLike
                            size={20}
                            className="text-[#065ad8]"
                            onClick={() =>
                              handleLikeOnComment(comment._id, "false")
                            }
                          />
                        ) : (
                          <BiLike
                            size={20}
                            onClick={() =>
                              handleLikeOnComment(comment._id, "false")
                            }
                          />
                        )}
                        {comment?.likes.length} Likes
                      </p>
                      <span
                        className="text-[#065ad8] cursor-pointer"
                        onClick={() => setReplyComments(comment?._id)}
                      >
                        reply
                      </span>
                    </div>
                    {replyComments === comment?._id && (
                      <CommentForm
                      key={comment?._id}
                        user={user}
                        id={comment?._id}
                        replyAt={comment._id}
                        comments={comments}
                        setComments={setComments}
                      />
                    )}
                  </div>
                  {/* replies */}
                  <div className="mt-6 px-8 py-2">
                    {comment?.replies?.length > 0 && (
                      <p
                        className="text-base text-ascent-1 cursor-pointer"
                        onClick={() =>
                          setShowReply(
                            showReply === comment?._id ? null : comment?._id
                          )
                        }
                      >
                        {showReply === comment?._id
                          ? `Hide Replies`
                          : `Show Replies (${comment?.replies?.length})`}
                      </p>
                    )}

                    {showReply === comment?._id &&
                      comment?.replies?.map((reply,index) => (
                        <ReplyCard
                          reply={reply}
                          user={user}
                          key={`${reply?._id}-${index}`}
                          handleLike={() =>
                            handleLikeOnComment(comment._id, reply.replyId)
                          }
                        />
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <span className="flex text-sm py-4 text-ascent-2 text-center">
                No Comments, be first to comment
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default PostCard;
