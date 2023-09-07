function notifyMe(title, url) {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      if ("setAppBadge" in navigator) navigator.setAppBadge(true);

      navigator.serviceWorker.ready.then((registration) => {
        registration.active.postMessage({
          type: "SHOW_GOTO_NOTIFICATION",
          data: { title, url },
        });
        // registration.showNotification("Открыть статью", {
        //   body: title,
        //   data: { title, url },
        //   icon: "/logo.svg",
        //   // actions: [
        //   //   {
        //   //     action: "hide",
        //   //     title: "Hide",
        //   //   },
        //   // ],
        // });
      });
    }
  });
}

export default function NotificationButtonOpenPost({ title, url }) {
  return (
    <span
      className="entry-more-link"
      onClick={(e) => {
        e.preventDefault();
        notifyMe(title, url);
      }}
    >
      <span>Открыть через уведомление</span>
    </span>
  );
}

// if (!("Notification" in window)) {
//   // Check if the browser supports notifications
//   alert("This browser does not support desktop notification");
// } else if (Notification.permission === "granted") {
//   // Check whether notification permissions have already been granted;
//   // if so, create a notification
//   const notification = new Notification("Hi there!");
//   // …
// } else if (Notification.permission !== "denied") {
//   // We need to ask the user for permission
//   Notification.requestPermission().then((permission) => {
//     // If the user accepts, let's create a notification
//     if (permission === "granted") {
//       const notification = new Notification("Hi there!");
//       // …
//     }
//   });
// }
