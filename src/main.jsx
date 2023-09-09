import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './css/index.css'
import './css/unsemantic.css'

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        type: 'module',
      })
      if (registration.installing) {
        console.log('Service worker installing')
      } else if (registration.waiting) {
        console.log('Service worker installed')
      } else if (registration.active) {
        console.log('Service worker active')
      }
      registration.addEventListener('updatefound', () => {
        // A wild service worker has appeared in reg.installing!
        const newWorker = registration.installing
        console.log('updatefound fired:', newWorker)

        // newWorker.state
        // "installing" - the install event has fired, but not yet complete
        // "installed"  - install complete
        // "activating" - the activate event has fired, but not yet complete
        // "activated"  - fully active
        // "redundant"  - discarded. Either failed install, or it's been
        //                replaced by a newer version

        newWorker.addEventListener('statechange', () => {
          // newWorker.state has changed
          console.log('statechange fired:', newWorker)
          if (newWorker.state === 'activated') {
            alert('SW was updated.')
          }
        })
        let refreshing
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          function () {
            if (refreshing) return
            window.location.reload()
            refreshing = true
          }
        )
      })
    } catch (error) {
      console.error(`Registration failed with ${error}`)
    }
  }
}

registerServiceWorker()

ReactDOM.createRoot(document.getElementById('container')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
