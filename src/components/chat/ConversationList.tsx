import { ConversationModel } from "@/src/models/conversation";
import { ReactNode } from "react";
import { Conversation } from "./Conversation";

export const ConversationList: React.FC<{
  conversations: ConversationModel[];
  loading: boolean;
  onConversationClick: (id: string) => void;
}> = ({
  conversations,
  loading,
  onConversationClick,
}: {
  conversations: ConversationModel[];
  loading: boolean;
  onConversationClick: (id: string) => void;
}): ReactNode => {
  return (
    <div className="flex w-[20%] flex-col shadow-md">
      <div className="min-h-[65px] border-b p-4">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <div className="flex-grow overflow-y-auto py-2">
        {loading ? (
          <></>
        ) : conversations.length > 0 ? (
          conversations.map((_, index) => (
            <Conversation
              key={index}
              conversationModel={conversations[index]}
              onClick={(id) => onConversationClick(id)}
            />
          ))
        ) : (
          <>
            <h2 className="font-semibold">No messages yet</h2>
            <p className="text-gray-500">
              Start a conversation to see it here.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
