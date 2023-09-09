import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EventSWListeners() {
  const navigate = useNavigate()

  // MESSAGE REDUCER
  function messageReducer(action) {
    const { type, payload } = action

    switch (type) {
      case 'CLEAR_BADGE':
        if ('setAppBadge' in navigator) navigator.clearAppBadge()
        break
      case 'NAVIGATE_TO':
        navigate(payload)
        break
    }
  }

  useEffect(() => {
    navigator.serviceWorker.ready.then(() => {
      navigator.serviceWorker.addEventListener('message', (e) => {
        const { data } = e
        console.log('WINDOW: data from SW', data)

        messageReducer(data)
      })
    })
  })
  return
}
