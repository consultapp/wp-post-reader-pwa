import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

const cacheVersion = "v6";
const staticCacheName = "s-app-" + cacheVersion;
const dynamicCacheName = "d-app-" + cacheVersion;

const assetUrls = [];

self.addEventListener("install", async () => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetUrls);
});

self.addEventListener("activate", async () => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name !== staticCacheName)
      .filter((name) => name !== dynamicCacheName)
      .map((name) => caches.delete(name))
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // const url = new URL(request.url);
  // if (url.origin === location.origin) {
  event.respondWith(cacheFirst(request));
  // } else {
  //   event.respondWith(networkFirst(request));
  // }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
}

self.addEventListener(
  "notificationclick",
  (event) => {
    const { data } = event.notification;

    event.notification.close();
    event.waitUntil(
      self.clients
        .matchAll({
          type: "window",
        })
        .then((clientList) => {
          if (clientList.length)
            for (const client of clientList) {
              if ("focus" in client) {
                client.focus();
                if (data.url) {
                  // client.navigate(data.url);
                  messageClient(client.id, {
                    type: "NAVIGATE_TO",
                    payload: data.url,
                  });
                }
                messageClient(client.id, { type: "CLEAR_BADGE" });
              }
            }
          else if (self.clients.openWindow) {
            if (data.url)
              self.clients
                .openWindow(data.url)
                .then((client) => (client ? client.focus() : null));
          }
        })
    );
  },
  false
);

self.addEventListener("message", (event) => {
  const { data } = event;
  console.log("SW: Message received:", data);
  if (data.type === "SHOW_GOTO_NOTIFICATION") {
    event.waitUntil(showGoToNotification(data.data));
  }
  // sendMessage({
  //   type: "MESSAGE",
  //   payload: `SW Answer: Message received: ${event.data}`,
  // });
});

async function messageClient(clientId, data) {
  const client = await self.clients.get(clientId);
  client.postMessage(data);
}

async function sendMessage(data) {
  let allClients = await self.clients.matchAll({ includeUncontrolled: true });
  return Promise.all(
    allClients.map((client) => {
      let channel = new MessageChannel();
      return client.postMessage(data);
    })
  );
}

async function showGoToNotification(data) {
  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }
  const title = data.title || "";
  const icon = "/logo.png";

  self.registration.showNotification("Открыть статью", {
    body: title,
    data,
    tag: "sgo-to-notification",
    icon,
  });
}

// async function messageAllClients(data, openNewClient = false) {
//   self.clients
//     .matchAll({
//       type: "window",
//     })
//     .then((clientList) => {
//       if (clientList.length) {
//         for (const client of clientList) {
//           client.postMessage(data);
//         }
//       } else if (openNewClient && self.clients.openWindow) {
//         self.clients.then((client) => client.postMessage(data));
//       }
//     });
// }
// async function networkFirst(request) {
//   const cache = await caches.open(dynamicCacheName);
//   try {
//     const response = await fetch(request);
//     await cache.put(request, response.clone());
//     return response;
//   } catch (e) {
//     const cached = await cache.match(request);
//     console.log("offline.html");
//     // return cached ?? (await caches.match("/offline.html"));
//     return cached ?? "";
//   }
// }
