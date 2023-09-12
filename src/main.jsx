import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./css/index.css";
import "./css/unsemantic.css";

// newWorker.state
// "installing" - the install event has fired, but not yet complete
// "installed"  - install complete
// "activating" - the activate event has fired, but not yet complete
// "activated"  - fully active
// "redundant"  - discarded. Either failed install, or it's been
//                replaced by a newer version
if ("serviceWorker" in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener("load", async () => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          let registration;
          // Use ES Module version of our Service Worker in development
          if (import.meta.env?.VITE_DEV) {
            registration = await navigator.serviceWorker.register("/sw.js", {
              type: "module",
            });
          } else {
            // In production, use the normal service worker registration
            registration = await navigator.serviceWorker.register("/sw.js");
          }
          у;
          if (registration.installing) {
            console.log("Service worker installing");
          } else if (registration.waiting) {
            console.log("Service worker installed");
          } else if (registration.active) {
            console.log("Service worker active");
          }

          registration.addEventListener("updatefound", () => {
            // A wild service worker has appeared in reg.installing!
            const newWorker = registration.installing;
            console.log("updatefound fired:", newWorker);

            newWorker.addEventListener("statechange", () => {
              // newWorker.state has changed
              console.log("statechange fired:", newWorker);
              if (newWorker.state === "activated") {
                alert("Application was updated (sw).");
              }
            });

            let refreshing;
            navigator.serviceWorker.addEventListener(
              "controllerchange",
              function () {
                if (refreshing) return;

                console.log("window reload after controller change");
                window.location.reload();
                refreshing = true;
              }
            );
          });
        } catch (error) {
          console.error(`Registration failed with ${error}`);
        }
      }
    };

    registerServiceWorker();
  });
}

ReactDOM.createRoot(document.getElementById("container")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
