import { ConversationModel } from "@/src/models/conversation";
import { ReactNode } from "react";
import { Conversation } from "./Conversation";
import { UserModel } from "@/src/models/user";
import { SquarePen } from "lucide-react";

export const ConversationList: React.FC<{
  conversations: ConversationModel[];
  loading: boolean;
  user: UserModel | null;
  onConversationClick: (id: string) => void;
  onCreateConversation: () => void
}> = ({
  conversations,
  loading,
  user,
  onConversationClick,
  onCreateConversation
}: {
  conversations: ConversationModel[];
  loading: boolean;
  user: UserModel | null;
  onConversationClick: (id: string) => void;
  onCreateConversation: () => void;
}): ReactNode => {
  return (
    <div className="flex w-[20%] flex-col border-r shadow-md">
      <div className="flex min-h-[65px] justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Chats</h2>
        <SquarePen onClick={onCreateConversation} className="size-6 text-white" />
      </div>
      <div className="flex-grow overflow-y-auto py-2">
        {loading ? (
          <></>
        ) : conversations.length > 0 ? (
          conversations.map((_, index) => (
            <Conversation
              key={index}
              conversationModel={conversations[index]}
              user={user}
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
