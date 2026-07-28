import { View, Text } from "react-native";
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api";
import { getToken } from "../storage/authStorage/getToken";
import { useAuth } from "./authContext";
import { useEffect } from "react";

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingFetchPost, setLoaingFetchPost] = useState(false);
  const [postsData, setPostsData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      getAllPosts();
    }
  }, [user?._id]);

  // ====================
  // Get all users posts
  // ====================

  const getAllPosts = async () => {
    setLoaingFetchPost(true);
    try {
      const token = await getToken("token");
      if (!token) return;

      const res = await axios.get(`${BASE_URL}/api/user/post/get-posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPostsData(res.data.posts);
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      setLoaingFetchPost(false);
    }
  };

  // ===================
  // create and add post
  // ===================
  const addNewPost = async (data) => {
    console.log("data =>>>", data);

    setLoading(true);
    try {
      const token = await getToken("token");
      const res = await axios.post(`${BASE_URL}/api/user/post/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("response ", res?.data);
      const post = res?.data;
      setPostsData((prev) => [...prev, post]);
      return res?.data;
    } catch (error) {
      console.error(error?.response?.data?.message || "failed create post");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // updated post user image show
  // ============================

  const updateMyPostsProfileImage = (imgUri) => {
    setPostsData((prev) =>
      prev.map((post) =>
        post.user._id === user._id
          ? {
              ...post,
              user: {
                ...post.user,
                profileImage: imgUri.url,
              },
            }
          : post,
      ),
    );
  };

  // =======================
  // like update toggle like
  // =======================
  const likeUnlikePost = async (postId) => {
    try {
      const token = await getToken("token");
      if (!token) return;
      const res = await axios.post(
        `${BASE_URL}/api/user/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { liked, likeCount } = res.data;

      setPostsData((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                liked,
                likeCount,
              }
            : post,
        ),
      );
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  // =======================
  // Liked unliked featucers
  //  =======================

  const optimisticLike = (postId) => {

    setPostsData((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              liked: !post.liked,
              likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post,
      ),
    );
  };

  // ========================
  // Increment post comment count
  // ========================

  const increamentCommentCount = (postId) => {
    console.log("post id",postId);
    
    setPostsData((prev) =>
      prev.map((post) =>
        post?._id === postId
          ? { ...post, commentCount: post?.commentCount + 1 }
          : post,
      ),
    );
  };

  // =============================
  // dicrement post comment count
  // =============================

  const dicrementCommentCount = (postId) => {
    console.log(postsData);
    
    console.log("post id",postId);

    setPostsData((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post,commentCount: Math.max(0, post?.commentCount - 1) }
          : post,
      ),
    );
  };

  return (
    <PostContext.Provider
      value={{
        addNewPost,
        loading,
        postsData,
        optimisticLike,
        updateMyPostsProfileImage,
        likeUnlikePost,
        increamentCommentCount,
        dicrementCommentCount,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);
