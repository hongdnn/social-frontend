import React, { useState, KeyboardEvent, ReactNode } from "react";

export const ChatInput: React.FC<{
  onSend: (message: string) => void;
}> = ({ onSend }: { onSend: (message: string) => void }): ReactNode => {
  const [message, setMessage] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (message.trim()) {
        onSend(message)
        setMessage("");
      }
    }
  };

  return (
    <div className="border-t p-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="w-full resize-none rounded-lg border p-2 focus:outline-none focus:ring focus:ring-blue-200 text-black"
      ></textarea>
    </div>
  );
};
