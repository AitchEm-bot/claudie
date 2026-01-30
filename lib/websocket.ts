export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export class ChatWebSocket {
  private ws: WebSocket | null = null
  private url: string
  private onMessage: (message: string) => void
  private onStatusChange: (status: ConnectionStatus) => void
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private reconnectTimeout: NodeJS.Timeout | null = null

  constructor(
    url: string,
    onMessage: (message: string) => void,
    onStatusChange: (status: ConnectionStatus) => void
  ) {
    this.url = url
    this.onMessage = onMessage
    this.onStatusChange = onStatusChange
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    this.onStatusChange('connecting')

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        this.reconnectAttempts = 0
        this.onStatusChange('connected')
      }

      this.ws.onmessage = (event) => {
        this.onMessage(event.data)
      }

      this.ws.onclose = () => {
        this.onStatusChange('disconnected')
        this.attemptReconnect()
      }

      this.ws.onerror = () => {
        this.onStatusChange('error')
      }
    } catch {
      this.onStatusChange('error')
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000)

    this.reconnectTimeout = setTimeout(() => {
      this.connect()
    }, delay)
  }

  send(message: string): boolean {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return false
    }

    this.ws.send(message)
    return true
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.onStatusChange('disconnected')
  }

  getStatus(): ConnectionStatus {
    if (!this.ws) return 'disconnected'

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'connected'
      default:
        return 'disconnected'
    }
  }
}

export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
