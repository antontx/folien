import { useCallback, useEffect, useRef, useState } from 'react'

export type PresenterMessage =
  | {
      type: 'state'
      index: number
      step: number
      totalSteps: number
      showBorder: boolean
      isFullscreen: boolean
    }
  | {
      type: 'navigate'
      action: 'nextStep' | 'prevStep' | 'nextSlide' | 'prevSlide' | 'goTo'
      index?: number
    }
  | { type: 'control'; action: 'fullscreen' | 'border'; value: boolean }
  | { type: 'connected' }
  | { type: 'disconnected' }
  | { type: 'ping' }
  | { type: 'pong' }

const CHANNEL_NAME = 'atelier-presenter'

export function usePresenterChannel(
  onMessage?: (message: PresenterMessage) => void,
) {
  const channelRef = useRef<BroadcastChannel | null>(null)
  const onMessageRef = useRef<typeof onMessage>(onMessage)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel

    channel.onmessage = (event: MessageEvent<PresenterMessage>) => {
      const msg = event.data

      if (msg.type === 'connected') {
        setIsConnected(true)
      } else if (msg.type === 'disconnected') {
        setIsConnected(false)
      } else if (msg.type === 'ping') {
        channel.postMessage({ type: 'pong' })
      } else if (msg.type === 'pong') {
        setIsConnected(true)
      }

      onMessageRef.current?.(msg)
    }

    // Check if other window exists
    channel.postMessage({ type: 'ping' })

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [])

  const send = useCallback((message: PresenterMessage) => {
    channelRef.current?.postMessage(message)
  }, [])

  const broadcast = useCallback((message: PresenterMessage) => {
    channelRef.current?.postMessage(message)
  }, [])

  return { send, broadcast, isConnected, setIsConnected }
}
