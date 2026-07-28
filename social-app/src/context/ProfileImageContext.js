import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { getToken } from "../storage/authStorage/getToken";
import { useAuth } from "./authContext";
import { BASE_URL } from "../config/api";
import { usePost } from "./PostContext";

const ProfileImageContext = createContext();

export const ProfileImageContextProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUploadLoading, setImageUploading] = useState(false);

  const { updateMyPostsProfileImage } = usePost();

  // ==========================
  // upload profile image
  //  ==========================
  const uploadProfileImage = async (image) => {
    setImageUploading(true);
    if (!image) {
      setLoading(false);
      Alert.alert("select image");
      return;
    }

    const formData = new FormData();

    formData.append("image", {
      uri: image.uri,
      name: image.fileName,
      type: image.mimeType,
    });

    try {
      const token = await getToken("token");
      if (!token) {
        setLoading(false);
        return Alert.alert("invalid token");
      }

      const response = await axios.post(
        `${BASE_URL}/api/user/profile-image/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const updatedUser = response?.data?.user;
      setUser(updatedUser);
      updateMyPostsProfileImage(
        updatedUser.profileImages.find((img) => img?.isActive),
      );
    } catch (error) {
      console.log(error.response?.data?.message);
    } finally {
      setImageUploading(false);
    }
  };

  // ===========================
  //   update image profile image
  // ============================

  const updateProfile = async (formData) => {
    setLoading(true);
    if (!user?.profileImages.length) {
      Alert.alert("Upload", "upload first image then change");
      setLoading(false);
      return;
    }
    try {
      const token = await getToken("token");
      if (!token) {
        setLoading(false);
        return Alert.alert("invalid token");
      }
      const response = await axios.patch(
        `${BASE_URL}/api/user/profile-image/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const updatedUser = response?.data?.user;
      Alert.alert(response?.data?.message);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Image upload failed",
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // get active image
  // ====================================
  const getActiveImage = () => {
    if (!user?.profileImages?.length) {
      return null;
    }
    const currentImage = user?.profileImages.find((img) => img.isActive);
    return currentImage?.url ?? null;
  };

  return (
    <ProfileImageContext.Provider
      value={{
        updateProfile,
        loading,
        getActiveImage,
        uploadProfileImage,
        imageUploadLoading,
      }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
};

export const useProfileImage = () => useContext(ProfileImageContext);
