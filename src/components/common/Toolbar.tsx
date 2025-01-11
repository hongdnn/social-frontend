'use client'

import Link from "next/link";
import { ReactNode, useState } from "react";
import { CreatePostModal } from "./CreatePostModal";

export const Toolbar: React.FC = (): ReactNode => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex w-1/12 flex-shrink-0 flex-col p-4 shadow-md">
        <h1 className="mb-4 text-xl font-bold">Social</h1>
        <ul className="space-y-4">
          <li>
            <Link href="/" className="cursor-pointer hover:text-primary">
              Home
            </Link>
          </li>
          <li>
            <Link href="/search" className="cursor-pointer hover:text-primary">
              Search
            </Link>
          </li>
          <li>
            <Link href="/chat" className="cursor-pointer hover:text-primary">
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

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};