const cacheVersion = "16";
const cacheName = "appCache_v" + cacheVersion;
const assetUrls = [];
const isPromtSWUpdateOn = false;

self.addEventListener("install", async (event) => {
  try {
    event.waitUntil(
      caches.open(cacheName).then((cache) => {
        return cache.addAll(assetUrls);
      })
    );
    // AUTOUPDATE OF SW
    if (!isPromtSWUpdateOn) self.skipWaiting();
  } catch (error) {
    throw "Open cache error";
  }
});

self.addEventListener("activate", async (event) => {
  // AUTOUPDATE OF SW
  if (!isPromtSWUpdateOn) {
    event.waitUntil(self.clients.claim());
  }

  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name !== cacheName)
      .map((name) => caches.delete(name))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());

          return networkResponse;
        });

        return cachedResponse || fetchedResponse;
      });
    })
  );
});

// *************************************************************************

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
                if (data.url) {
                  client.focus();
                  messageClient(client.id, {
                    type: "NAVIGATE_TO",
                    payload: data.url,
                  });
                }
              }
            }
          else if ("openWindow" in self.clients) {
            if (data.url)
              self.clients.openWindow(data.url).then((client) => {
                console.log("newWindow");
              });
          }
        })
    );
  },
  false
);

self.addEventListener("message", (event) => {
  messageReducer(event?.data ?? {});
  // console.log('SW: Message received:', data)
});

async function messageClient(clientId, action) {
  const client = await self.clients.get(clientId);
  client.postMessage(action);
}

async function messageAllClients(action) {
  let allClients = await self.clients.matchAll({ includeUncontrolled: true });
  return Promise.all(
    allClients.map((client) => {
      return client.postMessage(action);
    })
  );
}

const initialNotificationData = {
  icon: "/logo.png",
  body: "",
};

function showNotification(title, payload) {
  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }

  self.registration.showNotification(title ?? "Notification", {
    ...initialNotificationData,
    ...payload,
  });
}

function showGoToNotification(data) {
  showNotification("Открыть статью", {
    body: data.title ?? "",
    data,
    tag: "sgo-to-notification",
  });
}

// MESSAGE REDUCER
function messageReducer(action) {
  const { type, data } = action;
  switch (type) {
    case "SHOW_GOTO_NOTIFICATION":
      showGoToNotification(data);
      break;
  }

  // sendMessage({
  //   type: "MESSAGE",
  //   payload: `SW Answer: Message received: ${event.data}`,
  // });
}
// **************************

// async function sendMessage(data) {
//   let allClients = await self.clients.matchAll({ includeUncontrolled: true })
//   return Promise.all(
//     allClients.map((client) => {
//       // let channel = new MessageChannel()
//       return client.postMessage(data)
//     })
//   )
// }

// self.addEventListener("fetch", (event) => {
//   const { request } = event;

//   // const url = new URL(request.url);
//   // if (url.origin === location.origin) {
//   event.respondWith(cacheFirst(request));
//   // } else {
//   //   event.respondWith(networkFirst(request));
//   // }
// });

// async function cacheFirst(request) {
//   const cached = await caches.match(request)
//   return cached ?? (await fetch(request))
// }

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
