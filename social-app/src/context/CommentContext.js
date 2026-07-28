import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "../storage/authStorage/getToken";
import axios from "axios";
import { BASE_URL } from "../config/api";
import { Alert } from "react-native";

const CommentContext = createContext();

export const CommentContextProvider = ({ children }) => {
  const [commentsByPost, setCommentsByPost] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  //============================
  // Get comments
  // ===========================

  const getAllComments = async (postId) => {
    setLoadingComments(true);
    try {
      const token = await getToken("token");
      if (!token) return;

      const response = await axios.get(
        `${BASE_URL}/api/user/comment/get-comments/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const { comments } = response?.data;
      setCommentsByPost(comments);
      return true;
    } catch (error) {
      console.log(
        error?.response?.data?.message || "failed fetch all comments",
      );
    } finally {
      setLoadingComments(false);
    }
  };

  //====================
  // Create comment
  // ===================
  const createComment = async (commentText, postId) => {
    setLoadingComments(true);
    try {
      const token = await getToken("token");
      if (!token) return;

      const response = await axios.post(
        `${BASE_URL}/api/user/comment/create/${postId}`,
        { commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { comment } = response?.data;
      setCommentsByPost((prev) => [...prev, comment]);
      return response?.data?.success;
    } catch (error) {
      console.log(error?.response?.data?.message || "failed to create comment");
    } finally {
      setLoadingComments(false);
    }
  };

  //===================
  // Delete Comment
  // ==================

  const deleteComment = async (commentId) => {
    try {
      const token = await getToken("token");
      if (!token) return;

      const response = await axios.delete(
        `${BASE_URL}/api/user/comment/delete-comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      Alert.alert("success", response?.data?.message);
      setCommentsByPost((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );
      return response?.data?.success;
    } catch (error) {
      console.log(error?.response?.data?.message || "failed to delete comment");
      console.log(error.response?.status);
      console.log(error.response?.data);
    }
  };

  //===================
  // Edit comment
  //===================
  const editComment = (commentId) => {};

  // ====================
  // Clear comment
  // ====================
  const clearComment = () => {
    setCommentsByPost([]);
  };

  return (
    <CommentContext.Provider
      value={{
        commentsByPost,
        getAllComments,
        createComment,
        deleteComment,
        editComment,
        loadingComments,
        clearComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useComment = () => useContext(CommentContext);
