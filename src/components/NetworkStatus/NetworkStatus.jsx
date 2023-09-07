import { useEffect, useState } from "react";
import { NETWORK_STATUS } from "../../constants";

export default function NetworkStatus() {
  const [status, setStatus] = useState(NETWORK_STATUS.idle);

  useEffect(() => {
    window.addEventListener("online", () => {
      console.log("navigator.onLine online", navigator.onLine);
    });
    window.addEventListener("offline", () => {
      console.log("navigator.onLine offline", navigator.onLine);
    });
    // navigator.onLine
    //   ? setStatus(NETWORK_STATUS.online)
    //   : setStatus(NETWORK_STATUS.offline);
  });

  return status === NETWORK_STATUS.idle ? (
    "idle"
  ) : status === NETWORK_STATUS.offline ? (
    <div>Service is offline.</div>
  ) : (
    <div>Service is online.</div>
  );
}
