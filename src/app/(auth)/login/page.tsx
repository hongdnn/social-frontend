"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { useLogin } from "./hooks/use-login";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading, error } = useLogin();
    const t = useTranslations("LoginPage");
        
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    useEffect(() => {
        localStorage.clear()
    }, [])

    return (
        <div className="flex h-screen items-center justify-center">
        <div className="flex h-[500px] w-[400px] flex-col items-center justify-center rounded-3xl border-[2px] border-gray-600 p-16">
            <form onSubmit={handleSubmit} className="flex w-full flex-col items-center justify-center space-y-4">
            <h1 className="mb-8 text-3xl font-bold">Social</h1>
            <input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded border p-2 text-black"
            />
            <input
                type="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded border p-2 text-black"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-primary w-full rounded p-2 text-white"
            >
                {t("signIn")}
            </button>
            </form>
            <p className="text-primary ml-auto mt-6 underline" onClick={() => {}}>
            {t("forgotPassword")}
            </p>
            <div className="mt-auto flex space-x-1">
            <p>{t("doNotHaveAccount")}</p>
            <p className="text-primary underline">{t("signUp")}</p>
            </div>
        </div>
        </div>
    );
}
