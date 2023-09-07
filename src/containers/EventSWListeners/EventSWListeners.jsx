import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EventSWListeners() {
  const navigate = useNavigate();
  useEffect(() => {
    navigator.serviceWorker.ready.then(() => {
      navigator.serviceWorker.addEventListener("message", (e) => {
        const { data } = e;
        console.log("WINDOW: data from SW", data);

        if (data.type === "CLEAR_BADGE") {
          if ("setAppBadge" in navigator) navigator.clearAppBadge();
        }

        if (data.type === "NAVIGATE_TO") {
          navigate(data.payload);
        }
      });
    });
  });
  return;
}
