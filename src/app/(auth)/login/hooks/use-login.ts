import { useState } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/src/lib/api/user-api";
import { useSocket } from "@/src/app/socket-context";
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { connectSocket } = useSocket();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.login(email, password);
      if (response.status == 0) {
        await connectSocket(response.token ?? '');
        document.cookie = `tk=${response.token ?? ''}; path=/; max-age=2592000`;
        localStorage.setItem('auth_token', response.token ?? '')
        localStorage.setItem('user', JSON.stringify(response.user))
        router.push("/");
      } else {
        console.log(response);
        setError(response.message);
      }
    } catch (error) {
      console.log(error);
      setError("There is something wrong");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
