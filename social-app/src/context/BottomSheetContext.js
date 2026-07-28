import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const BottomSheetContext = createContext();

export const BottomSheetContextProvider = ({ children }) => {
  // Kis post ke comments open hain
  const [selectedPost, setSelectedPost] = useState(null);


  // BottomSheet Ref
  const bottomSheetRef = useRef(null);

  // Snap points
  const snapPoints = useMemo(() => ["85%"], []);

  // ==========================
  // Open BottomSheet
  // ==========================
  const openCommentSheet = (post) => {
    setSelectedPost(post);
    
    // BottomSheet open
    requestAnimationFrame(() => {
      bottomSheetRef.current?.expand();
    });
  };

  // ==========================
  // Close BottomSheet
  // ==========================
  const closeCommentSheet = () => {
    bottomSheetRef.current?.close();
    setSelectedPost(null);
  };

  return (
    <BottomSheetContext.Provider
      value={{
        // state
        selectedPost,
        setSelectedPost,

        // refs
        bottomSheetRef,

        // config
        snapPoints,

        // actions
        openCommentSheet,
        closeCommentSheet,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => useContext(BottomSheetContext);
