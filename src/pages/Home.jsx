import React, { useEffect, useState } from "react";
import {
  TopBar,
  ProfileCard,
  FriendsCard,
  CustomButton,
  TextInput,
  Loading,
  PostCard,
  EditProfile,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../Redux/features/userSlice";
import { Link } from "react-router-dom";
import { noProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { BiImage, BiSolidVideo } from "react-icons/bi";
import { apiRequest } from "../utils/apiRequest";
import { uploadFile } from "../utils/cloudinaryUpload";

function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [friendRequests, setFriendsRequests] = useState([]);
  const [suggestFriends, setSuggestFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const { user, edit } = useSelector(getUser);

  const handleAddFriend = async (id) => {
    try {
      const response = await apiRequest({
        url: `/users/send-request/${id}`,
        token: user.token,
      });
      if (response.success) {
        const index = suggestFriends.findIndex(
          (suggestFriend) => suggestFriend._id === id
        );
        const newSuggestFriends = [...suggestFriends];
        newSuggestFriends.splice(index, 1);
        setFriendsRequests(newSuggestFriends);
      }
    } catch (error) {
      console.log({ success: false, message: error.message });
    }
  };

  const requestStatusHandle = async (data) => {
    try {
      const response = await apiRequest({
        url: `/users/accept-request`,
        token: user.token,
        data: data,
        method: "POST",
      });
      if (response.success) {
        const index = friendRequests.findIndex(
          (friendRequest) => friendRequest._id === data.rid
        );
        const newRequests = [...friendRequests];
        newRequests.splice(index, 1);
        setFriendsRequests(newRequests);
      }
    } catch (error) {
      console.log({ success: false, message: error.message });
    }
  };

  const handleLike = async (postid) => {
    try {
      const response = await apiRequest({
        url: `/posts/like/${postid}`,
        token: user.token,
      });
      if (response.success) {
        const index = posts.findIndex((post) => post._id === postid);
        const newPosts = [...posts];
        newPosts.splice(index, 1, response.data);
        setPosts(newPosts);
      }
    } catch (error) {
      console.log({ success: false, message: error.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await apiRequest({
        url: `/posts/delete-post/${id}`,
        token: user.token,
        method: "DELETE",
      });
      if (response.success === true) {
        const index = posts.findIndex((post) => post._id === id);
        const newPosts = [...posts];
        newPosts.splice(index, 1);
        setPosts(newPosts);
      }
    } catch (error) {
      console.log({ success: false, message: error.message });
    }
  };

  const handlePost = async (data) => {
    try {
      setPosting(true);
      setErrorMessage("");
      const image = file && (await uploadFile(file));
      const newData = { ...data, image };
      const response = await apiRequest({
        url: "/posts/create-post",
        token: user.token,
        data: newData,
        method: "POST",
      });
      if (response.success) {
        const post = response.data;
        const newPosts = [post, ...posts];
        setPosts(newPosts);
      }
    } catch (error) {
      setErrorMessage({ success: false, message: error.message });
    } finally {
      setPosting(false);
    }
  };

  const getAllPosts = async () => {
    try {
      setLoading(true)
      const response = await apiRequest({
        url: search ? `/posts/${search}` : "/posts",
        token: user.token,
      });
      if (response.success) {
        setPosts(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await apiRequest({
        url: "/users/get-user",
        token: user.token,
      });
      if (response.success === true) {
        const token = user.token;
        dispatch(login({ token, ...response.data }));
      } else if (response.message === "Authentication Failed!") {
        window.localStorage.removeItem("user");
        window.location.replace("/login");
        window.alert("User session expired , Login again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFriendRequests = async () => {
    try {
      const response = await apiRequest({
        url: "/users/friend-requests",
        token: user.token,
      });
      if (response.success) {
        setFriendsRequests(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSuggestedFriends = async () => {
    try {
      const response = await apiRequest({
        url: "/users/suggest-friends",
        token: user.token,
      });
      if (response.success) {
        setSuggestFriends(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setLoading(true);
    getUserInfo();
    getFriendRequests();
    getSuggestedFriends();
  }, []);

  useEffect(() => {
    setLoading(true);
    getAllPosts();
  }, [search]);

  return (
    <>
      <div className="home w-full px-0 lg:px-10 pb-20 2xl:px-40 h-screen overflow-hidden bg-bgColor">
        <TopBar setSearch={setSearch} />
        <div className="w-full gap-2 flex lg:gap-4 pb-10 pt-5 h-full">
          {/* left */}
          <div className="hidden w-1/3 lg:w-1/4 h-full overflow-y-auto gap-6 md:flex flex-col">
            <ProfileCard user={user} edit={edit} />
            <FriendsCard friends={user.friends} />
          </div>
          {/* center */}
          <div className="flex-1 bg-primary h-full px-4 flex flex-col gap-4 overflow-y-auto rounded-lg">
            <form
              onSubmit={handleSubmit(handlePost)}
              className="bg-primary px-4 rounded-lg"
            >
              <div className=" gap-2 py-4 flex w-full items-center border-b border-[#66666645]">
                <img
                  src={user.profileUrl || noProfile}
                  alt="profile pic"
                  className="w-14 h-14 object-cover rounded-full"
                />
                <TextInput
                  name="description"
                  placeholder="What's on your mind... "
                  styles="w-full rounded-full py-5"
                  register={register("description", {
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
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
              <div className="flex justify-between items-center py-4">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    name="imgUpload"
                    id="imgUpload"
                    data-max-size="5120"
                    className="hidden"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <BiImage />
                  <span>Image</span>
                </label>
                <label
                  htmlFor="videoUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    name="videoUpload"
                    id="videoUpload"
                    data-max-size="5120"
                    className="hidden"
                    accept=".mp4 , .wav"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>
                <label
                  htmlFor="vgifUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    name="vgifUpload"
                    id="vgifUpload"
                    data-max-size="5120"
                    className="hidden"
                    accept=".gif"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>
                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      title="Post"
                      containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                    />
                  )}
                </div>
              </div>
            </form>
            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={(id) => {
                    handleDelete(id);
                  }}
                  likePost={(postId) => {
                    handleLike(postId);
                  }}
                />
              ))
            ) : (
              <div className="flex h-full w-full justify-center items-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>
          {/* right */}
          <div className="hidden w-1/4 lg:flex flex-col h-full gap-8 overflow-y-auto">
            {/* friend requests */}
            <div className="w-full bg-primary px-6 py-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span>Friend Requests</span>
                <span>{friendRequests?.length}</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4 ">
                {friendRequests?.map((friendRequest) => (
                  <div
                    key={friendRequest?._id}
                    className="flex items-center justify-between"
                  >
                    <Link
                      to={`/profile/${friendRequest?.requestFrom?._id}`}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={
                          friendRequest?.requestFrom?.profileUrl ?? noProfile
                        }
                        alt={friendRequest?.requestFrom?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {friendRequest?.requestFrom?.firstName}{" "}
                          {friendRequest?.requestFrom?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friendRequest?.requestFrom?.profession ??
                            "No Profession"}
                        </span>
                      </div>
                    </Link>
                    <div className="flex justify-center gap-2">
                      <CustomButton
                        title="Accept"
                        onClick={() =>
                          requestStatusHandle({
                            rid: friendRequest._id,
                            status: "accept",
                          })
                        }
                        containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
                      />
                      <CustomButton
                        title="Deny"
                        onClick={() =>
                          requestStatusHandle(friendRequest._id, "deny")
                        }
                        containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* suggest friends */}
            <div className="w-full bg-primary px-6 py-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span>Friend Suggestions</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4 ">
                {suggestFriends?.map((suggestFriend) => (
                  <div
                    key={suggestFriend?._id}
                    className="flex items-center justify-between"
                  >
                    <Link
                      to={`/profile/${suggestFriend?._id}`}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={suggestFriend?.profileUrl ?? noProfile}
                        alt={suggestFriend?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {suggestFriend?.firstName} {suggestFriend?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {suggestFriend?.profession ?? "No profession"}
                        </span>
                      </div>
                    </Link>
                    <div className="flex gap-1 ">
                      <button
                        className="text-sm rounded p-1 text-white bg-[#0444a430]"
                        onClick={() => handleAddFriend(suggestFriend._id)}
                      >
                        <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
}

export default Home;
