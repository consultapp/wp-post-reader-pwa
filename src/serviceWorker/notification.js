function initNotifications() {
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
    // console.log("SW: Message received:", data);
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
}
export default initNotifications;
