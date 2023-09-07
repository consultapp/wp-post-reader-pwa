import { useEffect } from "react";

export default function EventSWListeners() {
  useEffect(() => {
    navigator.serviceWorker.ready.then(() => {
      navigator.serviceWorker.addEventListener("message", (e) => {
        const { data } = e;
        console.log("WINDOW: data from SW", data);
        if (data.type === "CLEAR_BADGE") {
          navigator.clearAppBadge();
        }
      });
    });
  });
  return;
}
