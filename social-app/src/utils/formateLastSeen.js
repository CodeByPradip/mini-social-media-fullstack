// formate lastseen 
export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "long ago";

  const now = new Date();
  const last = new Date(lastSeen);

  const diff = Math.floor((now - last) / 1000); // seconds

  if (diff < 60) {
    return "just now";
  }

  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} min ago`;
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hr ago`;
  }

  const days = Math.floor(diff / 86400);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};



// formate post create date 
export const formatePostDate = (time)=>{
    if (!time) return "long ago";

  const now = new Date();
  const last = new Date(time);

  const diff = Math.floor((now - last) / 1000); // seconds

  if (diff < 60) {
    return "just now";
  }

  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} min`;
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hr`;
  }

  const days = Math.floor(diff / 86400);
  return `${days} day${days > 1 ? "s" : ""}`;
}

// formate time 

export const formatTime = (time) => {
  const date = new Date(time);

  const hour = date.getHours();

  const minute = date.getMinutes();

  const amPm = hour >= 12 ? "pm" : "am";

  const formattedHour = hour % 12 || 12;

  const formattedMinute = minute < 10 ? `0${minute}` : minute;

  return `${formattedHour}:${formattedMinute} ${amPm}`;
};
