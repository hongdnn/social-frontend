"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { CreatePostModal } from "./CreatePostModal";
import { SearchPanel } from "./SearchPanel";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseUserFromJson, UserModel } from "@/src/models/user";
import { NotificationPanel } from "./NotificationPanel";

export const Toolbar: React.FC = (): ReactNode => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<UserModel | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleNavClick = (type?: string) => {
    if (type === "search") {
      setIsSearchOpen(!isSearchOpen);
      setIsNotificationOpen(false);
    } else if (type === "notification") {
      setIsNotificationOpen(!isNotificationOpen);
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(false);
      setIsNotificationOpen(false);
    }
  };

  useEffect(() => {
    const storedUser = parseUserFromJson(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    document.cookie = "tk=; path=/; max-age=0";
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      <div className="flex w-1/12 flex-shrink-0 flex-col p-4 shadow-md">
        <div className="flex flex-grow flex-col">
          <h1 className="mb-4 text-xl font-bold">Social</h1>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="cursor-pointer hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <button
                className="cursor-pointer hover:text-primary"
                onClick={() => handleNavClick("search")}
              >
                Search
              </button>
            </li>
            <li>
              <Link
                href="/chat"
                className="cursor-pointer hover:text-primary"
                onClick={() => handleNavClick()}
              >
                Chat
              </Link>
            </li>
            <li>
              <button
                className="cursor-pointer hover:text-primary"
                onClick={() => handleNavClick("notification")}
              >
                Notification
              </button>
            </li>
            <li>
              <Link
                href={`/${user?.id}`}
                className="cursor-pointer hover:text-primary"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer hover:text-primary"
              >
                Create
              </button>
            </li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="mt-auto flex cursor-pointer items-center gap-2 pb-4 hover:text-primary"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />

      {isSearchOpen && <SearchPanel isOpen={isSearchOpen} />}
      {isNotificationOpen && <NotificationPanel isOpen={isNotificationOpen} />}
    </>
  );
};
