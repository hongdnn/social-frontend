"use client";

import { TextInput } from "@/src/components/common/TextInput";
import { useTranslations } from "next-intl";
import { useSignUp } from "./hooks/use-sign-up";
import { Alert, AlertDescription } from "@/src/components/common/alert";
import { FormEvent } from "react";

export default function SignUpPage() {
  const t = useTranslations("SignUpPage");
  const { signUp, error, router, setFirstName, setLastName, setPassword, setEmail, setPhone } = useSignUp();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); 
    await signUp();
  };

  return (
    <div className="flex h-screen px-4 py-8">
      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_bottom,rgb(0,0,0)_55%,#03719c_100%)]">
        <h2 className="text-2xl font-bold">Social</h2>
        <p className="mb-3 mt-10 text-3xl">{t("getStarted")}</p>
        <p className="w-72 text-center text-xl leading-relaxed">
          {t("completeSteps")}
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">{t("signUpAccount")}</h2>
        <p className="mb-5 text-center text-xl">{t("enterInfo")}</p>

        <form onSubmit={handleSubmit} className="flex w-[60%] flex-col space-y-6">
          <div className="flex space-x-10">
            <TextInput
              id="firstName"
              type="text"
              label={t("firstName")}
              placeholder="eg. John"
              required={true}
              onChange={setFirstName}
            />
            <TextInput
              id="lastName"
              type="text"
              label={t("lastName")}
              placeholder="eg. Doe"
              required={true}
              onChange={setLastName}
            />
          </div>
          <TextInput
            id="email"
            type="email"
            label={t("email")}
            placeholder="eg. johndoe@gmail.com"
            required={true}
            onChange={setEmail}
          />
          <TextInput
            id="phone"
            type="phone"
            label={t("phone")}
            placeholder={t("phonePlaceholder")}
            onChange={setPhone}
          />
          <TextInput
            id="password"
            type="password"
            label={t("password")}
            placeholder={t("passwordPlaceholder")}
            required={true}
            onChange={setPassword}
          />
          <div>
            <button
              type="submit"
              className="my-4 w-full flex-1 rounded bg-primary p-2 text-white"
            >
              {t("signUp")}
            </button>
          </div>
        </form>

        {error && (
          <Alert variant="destructive" className="w-[60%]">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-2 flex space-x-2">
          <p>{t("hadAccount")}</p>
          <p
            className="cursor-pointer text-primary underline"
            onClick={() => router.push("/login")}
          >
            {t("signIn")}
          </p>
        </div>
      </div>
    </div>
  );
}
