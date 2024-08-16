import React, { useState } from "react";
import { Link } from "react-router-dom";
import { noProfile } from "../assets";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateProfile } from "../Redux/features/userSlice";
import { LiaEditSolid } from "react-icons/lia";
import { BsBriefcase, BsPersonFillAdd } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment/moment";

function ProfileCard({ user, edit }) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(getUser);

  const updateHandle = async () => {
    dispatch(updateProfile(true));
  };
  const handleRequest = async () => {
    try {
      const response = await apiRequest({
        url: `/users/send-request/${user._id}`,
        token: user.token,
      });
      if (response.success) {
        setSuggestFriends(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div className="w-full bg-primary  shadow-sm rounded-lg px-6 py-4">
      <div className="border-b pb-5 flex w-full justify-between items-center border-[#66666645]">
        <Link to={`/profile/${user._id}`} className="flex gap-2">
          <img
            src={user.profileUrl || noProfile}
            alt="profile pic"
            className="w-14 h-14 object-cover rounded-full"
          />
          <div className="flex flex-col justify-center">
            <p className="text-lg font-medium text-ascent-1">
              {user.firstName} {user.lastName}
            </p>
            <span className="text-ascent-2">
              {user.profession || "No Profession"}
            </span>
          </div>
        </Link>

        <div>
          {user._id === loggedInUser.user._id ? (
            <LiaEditSolid
              onClick={updateHandle}
              size={22}
              className="text-[#065ad8] cursor-pointer "
            />
          ) : (
            <button
              className="text-sm text-white p-1 rounded bg-[#0444a430]"
              onClick={handleRequest}
            >
              <BsPersonFillAdd />
            </button>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
        <div className="flex gap-2 items-center text-ascent-2">
          <CiLocationOn className="text-xl text-ascent-1" />
          <span>{user.location ?? "Add location"}</span>
        </div>
        <div className="flex gap-2 items-center text-ascent-2">
          <BsBriefcase className="text-xl text-ascent-1" />
          <span>{user.profession ?? "No Profession"}</span>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
        <p className="font-semibold text-xl text-ascent-1 ">
          {user.friends.length} Friends
        </p>
        <div className="flex items-center justify-between">
          <span className="text-ascent-2">Who viewed your profile</span>
          <span className="text-ascent-1 text-lg ">{user.views.length}</span>
        </div>
        <span className="text-base text-[#065ad8]">
          {user.verified ? "Verified Account" : "Not Verified"}
        </span>
        <div className="flex justify-between items-center">
          <span className="text-ascent-2">Joined</span>
          <span className="text-ascent-1 text-base">
            {moment(user.createdAt).fromNow()}
          </span>
        </div>
      </div>
    </div>

    </>
  );
}

export default ProfileCard;
