import { MessageDTO, MessageModel } from "@/src/models/message";
import { NotificationModel } from "@/src/models/notification";
import { io, Socket } from "socket.io-client";


interface ServerResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    status: number;
    message: string;
}

export class SocketManager {
    private static instance: SocketManager;
    private socket: Socket | null = null;
    private messageCallbacks: ((message: MessageModel) => void)[] = [];
    private notificationCallbacks: ((notification: NotificationModel) => void)[] = [];
    private errorCallbacks: ((error: Error) => void)[] = [];

    private constructor() {}

    public static getInstance(): SocketManager {
        if (!SocketManager.instance) {
        SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }

    public async connect(token?: string): Promise<void> {
        const url = process.env.NEXT_PUBLIC_SOCKET_URL || "";
        return new Promise<void>((resolve, reject) => {
            try {
                if (this.socket?.connected) {
                    console.log("Socket already connected");
                    resolve();
                    return;
                }
    
                this.socket = io(url, {
                    auth: { token },
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 5000,
                });
    
                this.socket.on('connect', () => {
                    console.log('Socket connected successfully');
                    this.setupEventListeners();
                    resolve();
                });
    
                this.socket.on('connect_error', (error) => {
                    console.error("Failed to connect socket:", error);
                    this.notifyError(new Error(`Connection failed: ${error}`));
                    reject(error);
                });
    
            } catch (error) {
                console.error("Failed to initialize socket:", error);
                this.notifyError(new Error(`Connection failed: ${error}`));
                reject(error);
            }
        });
    }
    

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.on("disconnect", (reason) => {
            console.warn("Socket disconnected:", reason);
        });

        this.socket.on("receive_private_message", (response: ServerResponse) => {
            try {
                if (response.status === 0) {
                    const message = this.parseMessage(response.data);
                    if (message) {
                        this.notifyMessage(message);
                    }
                }
            } catch (error) {
                console.error("Error parsing incoming message:", error);
            }
        });

        this.socket.on("receive_notification", (response: ServerResponse) => {
            try {
                console.log(response)
                if (response.status === 0) {
                    const notification = NotificationModel.fromDTO(response.data);
                    if (notification) {
                        this.notifyNotification(notification);
                    }
                }
            } catch (error) {
                console.error("Error parsing notification:", error);
            }
        });
    }

    /* Register user message listener */
    public onMessage(callback: (message: MessageModel) => void): () => void {
        this.messageCallbacks.push(callback);
        return () => {
        this.messageCallbacks = this.messageCallbacks.filter(
            (cb) => cb !== callback,
        );
        };
    }

    /* Register notification listener */
    public onNotification(callback: (notification: NotificationModel) => void): () => void {
        this.notificationCallbacks.push(callback);
        return () => {
            this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
        };
    }

    public onError(callback: (error: Error) => void): () => void {
        this.errorCallbacks.push(callback);
        return () => {
        this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback);
        };
    }

    public sendPrivateMessage(message: {
        sender_id: string;
        receiver_id: string;
        message: string;
        message_type: string;
    }) {
        try {
            this.socket?.emit("private_message", message);
        } catch (error) {
            console.error("Failed to send private message:", error);
            this.notifyError(new Error(`Failed to send message: ${error}`));
        }
    }

    /* Triggering when receive other user message from socket */
    private notifyMessage(message: MessageModel) {
        this.messageCallbacks.forEach((callback) => callback(message));
    }

     /* Triggering when receive notification from socket */
    private notifyNotification(notification: NotificationModel) {
        this.notificationCallbacks.forEach(callback => callback(notification));
    }

    private notifyError(error: Error) {
        this.errorCallbacks.forEach((callback) => callback(error));
    }

    private parseMessage(data: MessageDTO): MessageModel | null {
        try {
            return MessageModel.fromDTO(data);
        } catch (error) {
            console.error("Failed to parse message:", error);
            return null;
        }
    }

    public isConnected(): boolean {
        return this.socket?.connected || false;
    }

    public disconnect() {
        console.log("disconnect")
        this.socket?.disconnect();
        this.socket = null;
        this.messageCallbacks = [];
        this.errorCallbacks = [];
    }
}
