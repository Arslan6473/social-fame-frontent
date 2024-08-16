import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../Redux/features/userSlice";
import {
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TopBar,
} from "../components";
import { apiRequest } from "../utils/apiRequest";
import { useSelector } from "react-redux";

function Profile() {
  const { id } = useParams();
  const { user } = useSelector(getUser);
  const [posts,setPosts] = useState({})
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserById = async () => {
    try {
      setLoading(true);
      const response = await apiRequest({
        url: `/users/get-user/${id}`,
        token: user.token,
      });
      if (response.success) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPostsById = async () => {
    try {
      const response = await apiRequest({
        url: `/posts/get-posts/${id}`,
        token: user.token,
      });
      if(response.success){
        console.log(response);
        setPosts(response.data)
      }
     
    } catch (error) {
      console.error("API request failed:", error);
    } 
  };

  const viewProfile = async () => {
    try {
      setLoading(true);
      const response = await apiRequest({
        url: `/users/view-profile/${id}`,
        token: user.token,
      });
      if (response.success) {
    
         
        setPosts(response.data);
      }
    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user._id !== id) {
      getUserById();
      viewProfile()
    } else {
      setUserInfo(user);
    }
    getPostsById();
  }, [id]);

  return (
    <div className="home w-full px-0 lg:px-10 pb-20 2xl:px-40 h-screen overflow-hidden bg-bgColor">
      <TopBar />
      {userInfo &&(
        <div className="w-full gap-2 flex lg:gap-4 pb-10 pt-5 h-full">
          {/* left */}
          <div className="hidden w-1/3 lg:w-1/4 h-full overflow-y-auto gap-6 md:flex flex-col">
            <ProfileCard user={userInfo} />
          </div>
          {/* center */}
          <div className="flex-1 bg-primary h-full px-4 flex flex-col gap-4 overflow-y-auto rounded-lg">
            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  likePost={() => {}}
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
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
