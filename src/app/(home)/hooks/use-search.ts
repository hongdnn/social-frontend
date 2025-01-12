import { userApi } from "@/src/lib/api/user-api";
import { UserModel } from "@/src/models/user";
import { useState } from "react";

export const useSearch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<UserModel[]>([]);

    const handleSearch = async (keyword: string) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await userApi.searchUsers(keyword)
            if(response.status === 0) {
                setSearchResult(response.data)
            }
        } catch (error) {
            setError(`${error}`)
        } finally {
            setLoading(false)
        }
    }


    return { loading, error, handleSearch, searchResult, setSearchResult }
}