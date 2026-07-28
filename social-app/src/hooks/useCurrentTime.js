import { useEffect, useState } from "react";

const useCurrentTime = () => {
  // Current time state
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    // Update current time every 1 minute
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60 * 1000);

    // Cleanup when component unmounts
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Return current time so the component re-renders
  return currentTime;
};

export default useCurrentTime;
