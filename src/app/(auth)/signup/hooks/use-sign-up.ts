import { userApi } from "@/src/lib/api/user-api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const signUp = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.register(
        firstName,
        lastName,
        email,
        password,
        phone.trim() ? phone : undefined,
      );
      if (response.status === 0) {
        sessionStorage.setItem('signUpSuccess', 'true');
        router.push("/login");
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

  return {
    signUp,
    loading,
    error,
    setEmail,
    setFirstName,
    setLastName,
    setPassword,
    setPhone,
    router,
  };
};
