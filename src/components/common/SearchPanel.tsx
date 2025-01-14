import { useSearch } from "@/src/app/(home)/hooks/use-search";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { User } from "./User";
import { useRouter } from "next/navigation";

interface SearchPanelProps {
  isOpen: boolean;
}

export const SearchPanel = ({ isOpen }: SearchPanelProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { loading, searchResult, handleSearch } = useSearch();
    const router = useRouter();

    const onSearch = debounce((query: string) => {
        handleSearch(query);
      }, 700);
    
      const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
    
        if (query.trim().length > 0) {
            onSearch(query.trim());
        }
      };
    
    return (
      <div
        className={`h-screen w-[20%] border-r bg-background shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ position: "absolute", left: "8.33%" }}
      >
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleQueryChange}
              className="w-full rounded-lg border bg-gray-800 p-2 pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="mt-6">
            {searchQuery ? (
              <div className="space-y-6">
                {searchResult.map((user) => (
                    <User key={user.id} user={user} onClick={(id) => {router.push(`/${id}`);}} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Try searching for someone here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}