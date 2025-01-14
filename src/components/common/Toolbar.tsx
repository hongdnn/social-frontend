'use client'

import Link from "next/link";
import { ReactNode, useState } from "react";
import { CreatePostModal } from "./CreatePostModal";
import { SearchPanel } from "./SearchPanel";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const Toolbar: React.FC = (): ReactNode => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();


  const handleNavClick = (type?: string) => {
    if (type === 'search') {
      setIsSearchOpen(!isSearchOpen);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "tk=; path=/; max-age=0";
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      <div className="flex w-1/12 flex-shrink-0 flex-col p-4 shadow-md">
      <div className="flex flex-col flex-grow">
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
            <Link
              href="/notifications"
              className="cursor-pointer hover:text-primary"
            >
              Notification
            </Link>
          </li>
          <li>
            <Link href="/profile" className="cursor-pointer hover:text-primary">
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
          className="flex items-center gap-2 cursor-pointer hover:text-primary mt-auto pb-4"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {isSearchOpen && (
        <SearchPanel isOpen={isSearchOpen} />
      )}
    </>
  );
};