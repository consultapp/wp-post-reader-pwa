import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VITE_DEV = import.meta.env.VITE_DEV;

export default function EventSWListeners() {
  const navigate = useNavigate();

  // MESSAGE REDUCER
  function messageReducer(action) {
    const { type, payload } = action;

    switch (type) {
      case "CLEAR_BADGE":
        if ("setAppBadge" in navigator) navigator.clearAppBadge();
        break;
      case "NAVIGATE_TO":
        navigate(payload);
        break;
      case "WE_ARE_OFFLINE":
        alert("WE_ARE_OFFLINE");
        break;
      case "WE_ARE_ONLINE":
        alert("WE_ARE_ONLINE");
        break;
    }
  }

  useEffect(() => {
    navigator.serviceWorker.ready.then(() => {
      navigator.serviceWorker.addEventListener("message", (e) => {
        const { data } = e;
        if (VITE_DEV) console.log("WINDOW: data from SW", data);
        messageReducer(data);
      });
    });
  });
  return;
}
