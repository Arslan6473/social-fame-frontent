import React, { useEffect, useState, useRef } from "react";
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
import { BsFiletypeGif, BsPersonFillAdd, BsEmojiSmile, BsX } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { BiImage, BiSolidVideo, BiWorld } from "react-icons/bi";
import { apiRequest } from "../utils/apiRequest";
import { uploadFile } from "../utils/cloudinaryUpload";

function Home() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [friendRequests, setFriendsRequests] = useState([]);
  const [suggestFriends, setSuggestFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, edit } = useSelector(getUser);
  const modalRef = useRef(null);
  const textareaRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && showModal) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        300
      )}px`;
    }
  }, [showModal]);

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
        setSuggestFriends(newSuggestFriends);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type.split("/")[0]); // 'image', 'video', etc.

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setFileType(null);
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
        reset();
        setFile(null);
        setFilePreview(null);
        setFileType(null);
        setShowModal(false);
      }
    } catch (error) {
      setErrorMessage({ success: false, message: error.message });
    } finally {
      setPosting(false);
    }
  };

  const getAllPosts = async () => {
    try {
      setLoading(true);
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
          <div className="flex-1 bg-primary h-full shadow-lg px-4 flex flex-col gap-4 overflow-y-auto rounded-lg">
            {/* Post creation trigger */}
            <div 
              className="bg-primary px-4 rounded-lg cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <div className="gap-2 py-3 flex w-full items-center border-b border-[#66666645]">
                <img
                  src={user.profileUrl || noProfile}
                  alt="profile pic"
                  className="w-14 h-14 object-cover rounded-full"
                />
                <div className="w-full rounded-full py-5 px-4 bg-inputBg text-ascent-2">
                  What's on your mind, {user.firstName}?
                </div>
              </div>
              <div className="w-full py-4">
                <div className="flex gap-4 justify-between items-center">
                  <button 
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("imgUpload").click();
                    }}
                  >
                    <BiImage />
                    <span>Photo</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("videoUpload").click();
                    }}
                  >
                    <BiSolidVideo />
                    <span>Video</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("gifUpload").click();
                    }}
                  >
                    <BsFiletypeGif />
                    <span>GIF</span>
                  </button>
                </div>
              </div>
              
              {/* Hidden file inputs */}
              <input
                type="file"
                id="imgUpload"
                className="hidden"
                accept=".jpg, .jpeg, .png"
                onChange={handleFileChange}
              />
              <input
                type="file"
                id="videoUpload"
                className="hidden"
                accept=".mp4, .wav"
                onChange={handleFileChange}
              />
              <input
                type="file"
                id="gifUpload"
                className="hidden"
                accept=".gif"
                onChange={handleFileChange}
              />
            </div>

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
                          requestStatusHandle({
                            rid: friendRequest._id,
                            status: "deny",
                          })
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

      {/* Post Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex  items-center justify-center z-50 overflow-y-auto py-10">
          <div 
            ref={modalRef}
            className="bg-primary rounded-lg w-full shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-primary z-10 p-4 border-b border-[#66666645]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-ascent-1">Create Post</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-ascent-1 hover:text-ascent-2"
                >
                  <BsX size={24} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={user.profileUrl || noProfile}
                  alt="profile pic"
                  className="w-10 h-10 object-cover rounded-full"
                />
                <div>
                  <p className="font-medium text-ascent-1">
                    {user.firstName} {user.lastName}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-ascent-2">
                    <BiWorld />
                    <span>Public</span>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(handlePost)} className="p-4">
              <textarea
                ref={textareaRef}
                {...register("description", {
                  required: "Write something about post",
                })}
                placeholder={`What's on your mind, ${user.firstName}?`}
                className="w-full rounded-lg py-3 px-4 bg-inputBg text-ascent-1 border-none focus:ring-0 resize-none"
                style={{ minHeight: "100px", maxHeight: "300px" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(
                    e.target.scrollHeight,
                    300
                  )}px`;
                }}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
              
              {/* File preview */}
              {filePreview && (
                <div className="mt-4 relative">
                  {fileType === "image" && (
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="w-full max-h-96 object-contain rounded-lg"
                    />
                  )}
                  {fileType === "video" && (
                    <video 
                      src={filePreview} 
                      controls 
                      className="w-full max-h-96 object-contain rounded-lg"
                    />
                  )}
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                  >
                    <BsX size={20} />
                  </button>
                </div>
              )}
              
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
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#66666645] sticky bottom-0 bg-primary pb-2">
                <div className="flex gap-4">
                  <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg, .jpeg, .png"
                      onChange={handleFileChange}
                    />
                    <BiImage />
                    <span>Photo</span>
                  </label>
                  <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".mp4, .wav"
                      onChange={handleFileChange}
                    />
                    <BiSolidVideo />
                    <span>Video</span>
                  </label>
                  <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".gif"
                      onChange={handleFileChange}
                    />
                    <BsFiletypeGif />
                    <span>GIF</span>
                  </label>
                  <button 
                    type="button"
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1"
                  >
                    <BsEmojiSmile />
                    <span>Feeling</span>
                  </button>
                </div>
                
                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      title="Post"
                      containerStyles="bg-[#0444a4] text-white py-2 px-6 rounded-md font-semibold text-sm"
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {edit && <EditProfile />}
    </>
  );
}

export default Home;