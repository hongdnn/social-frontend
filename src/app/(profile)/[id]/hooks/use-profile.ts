import { followApi } from "@/src/lib/api/follow-api";
import { userApi } from "@/src/lib/api/user-api";
import { parseUserFromJson, UserModel } from "@/src/models/user";
import { useCallback, useState } from "react";



export const useProfile= () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserModel | null>(null);
    const [currentUser] = useState(() => parseUserFromJson(localStorage.getItem("user")));

    const fetchUserProfile = useCallback(async(userId: string) => {
        setLoading(true)
        setError(null)
        const response = await userApi.fetchProfile(userId)
        if(response.status === 0) {
            setUserProfile(response.data)
        } else {
            setError(response.message)
        }
        setLoading(false)
    }, [])

    const handleFollow = useCallback(async(userId: string) => {
        const response = await followApi.updateFollow(userId)
        if(response.status === 0) {
            const updatedUserProfile = new UserModel(
                userProfile?.id ?? '',
                userProfile?.firstName ?? '',
                userProfile?.lastName ?? '',
                userProfile?.email ?? '',
                userProfile?.phone ?? '',
                userProfile?.image ?? '',
                response.message === 'Following',
                userProfile?.followers ?? 0,
                userProfile?.followees ?? 0,
            )
            setUserProfile(updatedUserProfile)
        } 
    }, [userProfile])

    return { loading, error, userProfile, fetchUserProfile, currentUser, handleFollow }
}