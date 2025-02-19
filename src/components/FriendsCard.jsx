import React from "react";
import { Link } from "react-router-dom";
import { noProfile } from "../assets";

function FriendsCard({ friends }) {
  return (
    <div className="w-full bg-primary  shadow-sm rounded-lg px-6 py-4">
      <div className="border-b pb-5 flex w-full justify-between text-ascent-1 items-center border-[#66666645]">
        <span>Friends</span>
        <span>{friends.length}</span>
      </div>
      <div className="mt-4">
        {friends?.map((friend) => (
          <Link
            to={`/profile/${friend?._id}`}
            key={`${friend?._id}`}
            className="w-full flex gap-4 items-center cursor-pointer"
          >
            <img
              src={friend?.profileUrl ?? noProfile}
              alt={friend?.firstName}
              className="w-10 h-10 object-cover rounded-full"
            />

            <div className="flex-1">
              <p className="text-base font-medium text-ascent-1">
                {friend?.firstName} {friend?.lastName}
              </p>
              <span className="text-sm text-ascent-2">
                {friend?.profession ?? "No profession"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FriendsCard;
