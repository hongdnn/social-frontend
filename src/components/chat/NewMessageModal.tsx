import { debounce } from "lodash";
import { User } from "../common/User";
import { ChangeEvent, useState } from "react";
import { useSearch } from "@/src/app/(home)/hooks/use-search";
import { UserModel } from "@/src/models/user";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (userIds: string[]) => Promise<void>
}

export const NewMessageModal: React.FC<NewMessageModalProps> = ({
  isOpen,
  onClose,
  onStartConversation
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, searchResult, handleSearch, setSearchResult } = useSearch();
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([]);

  const onSearch = debounce((query: string) => {
    handleSearch(query);
  }, 700);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      onSearch(query.trim());
    } else {
      setSearchResult([]);
    }
  };

  const handleSelectedUser = (user: UserModel) => {
    const newSelectedUsers = [...selectedUsers, user]
    setSelectedUsers(newSelectedUsers)
    setSearchQuery('')
    setSearchResult([])
  };

  const removeSelectedUser = (userId: string) => {
    const updatedSelectedUsers = selectedUsers.filter(user => user.id !== userId);
    setSelectedUsers(updatedSelectedUsers);
  };

  const cleanup = () => {
    setSelectedUsers([])
    setSearchQuery('')
    setSearchResult([])
  }

  const handleStartConversation = async () => {
    const userIds = selectedUsers.map(user => user.id)
    await onStartConversation(userIds)
    cleanup();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="relative h-[32rem] w-full max-w-[32rem] rounded border-[1px] border-gray-500 bg-background p-5 shadow-xl">
        <div className="mb-4 flex items-center">
          <h2 className="flex-grow text-center text-xl font-semibold">
            Create new message
          </h2>
          <button
            onClick={() => {
              cleanup();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="flex w-full items-center space-x-3">
          <p>To:</p>
          {selectedUsers.length > 0 ? (
            <div>
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex space-x-2 rounded-xl bg-primary px-2"
                >
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                  <button
                    onClick={() => {
                      removeSelectedUser(user.id);
                    }}
                    className="text-white hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <input
              className="border-none bg-background outline-none focus:ring-0"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleQueryChange(e)}
            />
          )}
        </div>
        <div className="scrollable mt-4 flex h-2/3 overflow-y-auto py-2">
          {searchQuery ? (
            <div className="w-full space-y-6">
              {searchResult.map((user) => (
                <User
                  key={user.id}
                  user={user}
                  onClick={() => {
                    handleSelectedUser(user);
                  }}
                  isShowSelected={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-500">
              <p>No account found.</p>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <button
          onClick={handleStartConversation}
            className={`w-full rounded px-4 py-2 text-white bg-primary ${
              selectedUsers.length === 0 || loading
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            disabled={selectedUsers.length === 0 || loading}
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
};
