import { ReactNode } from "react";

export const Toolbar: React.FC = ({}): ReactNode => {
  return (
    <div className="flex w-1/12 flex-shrink-0 flex-col p-4 shadow-md">
      <h1 className="mb-4 text-xl font-bold">Social</h1>
      <ul className="space-y-4">
        <li className="hover:text-primary cursor-pointer">Home</li>
        <li className="hover:text-primary cursor-pointer">Search</li>
        <li className="hover:text-primary cursor-pointer">Chat</li>
        <li className="hover:text-primary cursor-pointer">Notification</li>
        <li className="hover:text-primary cursor-pointer">Profile</li>
      </ul>
    </div>
  );
};
