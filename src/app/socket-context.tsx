'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MessageModel } from '@/src/models/message';
import { SocketManager } from '../lib/socket/socket-manager';

interface SocketContextType {
  isConnected: boolean;
  connectSocket: (token: string) => Promise<void>;
  disconnectSocket: () => void;
  sendPrivateMessage: (message: {
    sender_id: string;
    receiver_id: string;
    message: string;
    message_type: string;
  }) => void;
  subscribeToMessages: (callback: (message: MessageModel) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [socketManager] = useState(() => SocketManager.getInstance());

  const connectSocket = useCallback(async (token: string): Promise<void> =>  {
    try {
      await socketManager.connect(token);
      setIsConnected(true);
    } catch (error) {
      console.error("Socket connection failed:", error);
      setIsConnected(false);
    }
  }, [socketManager]);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      connectSocket(storedToken);
    }
  }, [connectSocket]);

  const disconnectSocket = useCallback(() => {
    socketManager.disconnect();
    setIsConnected(false);
  }, [socketManager]);

  const sendPrivateMessage = useCallback((message: {
    sender_id: string;
    receiver_id: string;
    message: string;
    message_type: string;
  }) => {
    socketManager.sendPrivateMessage(message);
  }, [socketManager]);

  const subscribeToMessages = useCallback((callback: (message: MessageModel) => void) => {
    return socketManager.onMessage(callback);
  }, [socketManager]);

  const value: SocketContextType = {
    isConnected,
    connectSocket,
    disconnectSocket,
    sendPrivateMessage,
    subscribeToMessages,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

// Custom hook to use socket
export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
