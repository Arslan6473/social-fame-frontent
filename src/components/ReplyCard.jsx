import React from "react";
import { Link } from "react-router-dom";
import { noProfile } from "../assets";
import moment from "moment";
import { BiLike, BiSolidLike } from "react-icons/bi";

function ReplyCard({ user, reply, handleLike }) {
  return (
    <div className="w-full py-3">
      <div className="flex items-center gap-3 mb-1">
        <Link to={`/profile/${reply?.userId?._id}`}>
          <img
            src={reply?.userId?.profileUrl ?? noProfile}
            alt={reply?.userId?.firstName}
            className="w-10 h-10 object-cover rounded-full"
          />
        </Link>
        <div>
          <Link to={`/profile/${reply?.userId?._id}`}>
            <p className="font-medium text-base text-ascent-1">
              {reply?.userId?.firstName} {reply?.userId?.lastName}
            </p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(reply?.createdAt).fromNow()}
          </span>
        </div>
      </div>
      <div className="ml-12">
        <p className="text-ascent-2">{reply?.comment}</p>
        <div className="flex mt-2 gap-6">
          <p className="flex gap-2 items-center text-base text-ascent-2 cursor-pointer" onClick={handleLike}>
            {reply?.likes.includes(user?._id) ? (
              <BiSolidLike size={20} className="text-[#065ad8]" onClick={()=>handleLike()} />
            ) : (
              <BiLike size={20} onClick={()=>handleLike()}/>
            )}
            {reply?.likes.length} Likes
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReplyCard;
