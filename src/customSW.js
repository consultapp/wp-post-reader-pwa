import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

import { Exception } from 'sass'
import initNotifications from './serviceWorker/notification'

// import { clientsClaim } from "workbox-core";
// self.skipWaiting();
// clientsClaim();

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

const cacheVersion = '11'
const staticCacheName = 's-app-' + cacheVersion
const dynamicCacheName = 'd-app-' + cacheVersion

const assetUrls = []

self.addEventListener('install', async (event) => {
  try {
    event.waitUntil(
      caches.open(staticCacheName).then((cache) => {
        return cache.addAll(assetUrls)
      })
    )
  } catch (error) {
    throw Exception('Open cache error')
  }
})

self.addEventListener('activate', async () => {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter((name) => name !== staticCacheName)
      .filter((name) => name !== dynamicCacheName)
      .map((name) => caches.delete(name))
  )
  initNotifications()
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(dynamicCacheName).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone())

          return networkResponse
        })

        return cachedResponse || fetchedResponse
      })
    })
  )
})

// self.addEventListener("fetch", (event) => {
//   const { request } = event;

//   // const url = new URL(request.url);
//   // if (url.origin === location.origin) {
//   event.respondWith(cacheFirst(request));
//   // } else {
//   //   event.respondWith(networkFirst(request));
//   // }
// });

async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? (await fetch(request))
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
