import { MessageModel } from "@/src/models/message";
import { forwardRef } from "react";

export const Message = forwardRef<
  HTMLDivElement,
  {
    messageModel: MessageModel;
    /* check if this is current user's message to show in chat room */
    isCurrentUserMessage: boolean;
  }
>(({ messageModel, isCurrentUserMessage }, ref) => {
  const { message } = messageModel;
  return (
    <div
      ref={ref}
      className={`flex w-full ${isCurrentUserMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`w-fit max-w-[50%] whitespace-pre-line rounded-3xl p-3 ${isCurrentUserMessage ? "bg-primary" : "bg-gray-500"}`}
      >
        {message}
      </div>
    </div>
  );
});

Message.displayName = "Message";
