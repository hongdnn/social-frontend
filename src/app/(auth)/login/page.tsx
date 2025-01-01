"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useEffect } from "react";
import { useLogin } from "./hooks/use-login";
import { Alert, AlertDescription } from "@/src/components/common/alert";

export default function LoginPage() {
  const {
    login,
    loading,
    error,
    router,
    setEmail,
    setPassword,
    setSignUpAlert,
    email,
    password,
    signUpAlert,
  } = useLogin();
  const t = useTranslations("LoginPage");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSignUpAlert(false);
    await login();
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    // Check for registration success
    const signUpSuccess = sessionStorage.getItem("signUpSuccess");
    if (signUpSuccess) {
      sessionStorage.removeItem("signUpSuccess");
      setSignUpAlert(true);
    }
  }, [setSignUpAlert]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex h-auto w-[400px] flex-col items-center justify-center rounded-3xl border-[2px] border-gray-600 p-16">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center space-y-6"
        >
          <h1 className="mb-4 text-3xl font-bold">Social</h1>
          {signUpAlert && (
            <Alert variant="default">
              <AlertDescription>
                {t("signUpSuccess")}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {t("loginFailed")}
              </AlertDescription>
            </Alert>
          )}
          <input
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-4 w-full rounded border p-2 text-black"
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
            className="w-full rounded bg-primary p-2 text-white"
          >
            {t("signIn")}
          </button>
        </form>
        <p className="my-6 ml-auto text-primary underline" onClick={() => {}}>
          {t("forgotPassword")}
        </p>
        <div className="mt-auto flex space-x-1">
          <p>{t("doNotHaveAccount")}</p>
          <p
            className="cursor-pointer text-primary underline"
            onClick={() => router.push("signup")}
          >
            {t("signUp")}
          </p>
        </div>
      </div>
    </div>
  );
}
