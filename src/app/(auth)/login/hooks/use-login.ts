import { useState } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/src/lib/api/user-api";
import { useSocket } from "@/src/app/socket-context";
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { connectSocket } = useSocket();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpAlert, setSignUpAlert] = useState(false);

  const login = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.login(email, password);
      if (response.status === 0) {
        await connectSocket(response.token ?? '');
        document.cookie = `tk=${response.token ?? ''}; path=/; max-age=2592000`;
        localStorage.setItem('auth_token', response.token ?? '')
        localStorage.setItem('user', JSON.stringify(response.user))
        router.push("/");
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.log(error);
      setError("There is something wrong");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, router, email, password, signUpAlert, setEmail, setPassword, setSignUpAlert };
};
