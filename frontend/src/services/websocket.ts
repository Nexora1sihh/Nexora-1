type WebSocketHandler = (eventData: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: WebSocketHandler[] = [];
  private reconnectInterval: number = 3000;

  connect() {
    const wsBase =
  import.meta.env.VITE_WS_URL ||
  `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
const wsUrl = `${wsBase}/ws/events`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('⚡ Connected to NWIP WebSocket server');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach((listener) => listener(data));
        } catch (e) {
          console.error('Failed to parse WebSocket message', e);
        }
      };

      this.socket.onclose = () => {
        console.warn('WebSocket connection closed. Reconnecting in 3s...');
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.socket.onerror = (err) => {
        console.error('WebSocket error:', err);
      };
    } catch (e) {
      console.error('WebSocket connection error', e);
    }
  }

  subscribe(handler: WebSocketHandler) {
    this.listeners.push(handler);
    return () => {
      this.listeners = this.listeners.filter((h) => h !== handler);
    };
  }
}

export const wsService = new WebSocketService();
