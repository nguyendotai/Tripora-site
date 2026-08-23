"use client";

import {
  GoogleLogin,
  GoogleOAuthProvider,
  type CredentialResponse,
} from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGoogleLoginMutation } from "@/features/auth/api/auth.api";
import { saveSession } from "@/features/auth/services/auth-storage";
import { setCredentials } from "@/features/auth/store/auth.slice";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInButton({
  text = "signin_with",
  redirectTo = "/",
}: {
  text?: "signin_with" | "signup_with";
  redirectTo?: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [googleLogin] = useGoogleLoginMutation();
  const [error, setError] = useState(false);

  if (!GOOGLE_CLIENT_ID) return null;

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError(true);
      return;
    }
    try {
      const result = await googleLogin({
        idToken: credentialResponse.credential,
      }).unwrap();
      dispatch(setCredentials(result));
      saveSession(result.accessToken, result.user);
      router.push(redirectTo);
    } catch {
      setError(true);
    }
  };

  return (
    <div className="w-full">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <div className="flex justify-center [&>div]:w-full">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError(true)}
            text={text}
            shape="pill"
            size="large"
            width="100%"
          />
        </div>
      </GoogleOAuthProvider>
      {error && (
        <p className="mt-2 text-center text-xs text-destructive">
          Đăng nhập với Google không thành công. Vui lòng thử lại.
        </p>
      )}
    </div>
  );
}
