import { poppins } from "@/theme/fonts";
import LoginWithFacebook from "./buttons/LoginWithFacebook";
import LoginWithGoogle from "./buttons/LoginWithGoogle";
import OrFormDivider from "./OrFormDivider";
import TextBox from "../ui/TextBox";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { isValidEmail } from "@/utils/validators";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const params = useSearchParams();
  const callbackUrl = params?.get("callbackUrl") || "/dashboard";
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const verified = params?.get("verified");
    const error = params?.get("error");
    if (verified === "1") {
      setSuccess("Your email has been verified. You can log in now.");
    } else if (verified === "0") {
      setFormError("Verification link is invalid or expired.");
    }else if(error == "OAuthAccountNotLinked" || error == "OAuthSignin"){
      setFormError("Email already registered");
    }
  }, [params]);

  const handleLogin = async () => {
    setFormError("");
    if (!isValidEmail(data.email)) {
      setErrors((prev) => ({ ...prev, email: "Not a valid email" }));
      return;
    }
    if (!data.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }
    try {
      setSubmitting(true);
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });
      console.log(res);
      if (res?.error) {
        if (res.error === "UNVERIFIED_EMAIL") {
          setFormError("Please verify your email first.");
        } else {
          setFormError("Invalid email or password");
        }
      }else if (res?.ok && res.url) {
          window.location.href = res.url;
      }
    } catch (e) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-auth-grayed-text sm:px-10">
      <h1
        className="py-5 text-2xl font-medium"
        style={{ fontFamily: poppins.style.fontFamily }}
      >
        Log In
      </h1>
      <div className="w-full flex flex-col gap-3">
        <LoginWithFacebook />
        <LoginWithGoogle />
      </div>
      <OrFormDivider />
      <div className="w-full flex flex-col gap-2">
        <TextBox
          name="email"
          label="Email address"
          value={data.email}
          setValue={(text) => setData({ ...data, email: text })}
          type="email"
          error={errors.email}
          setError={(text) => setErrors({ ...errors, email: text })}
        />
        <TextBox
          name="password"
          label="Password"
          value={data.password}
          setValue={(text) => setData({ ...data, password: text })}
          type="password"
          error={errors.password}
          setError={(text) => setErrors({ ...errors, password: text })}
        />
      </div>
      {success && (
        <div className="w-full text-sm text-green-600 mt-2">{success}</div>
      )}
      <div className="w-full flex justify-end items-center mt-1 mb-3">
        <span
          className="text-sm cursor-pointer font-semibold text-primary"
          style={{ fontFamily: poppins.style.fontFamily }}
        >
          Forgot Password?
        </span>
      </div>
      {formError && (
        <div className="w-full text-sm text-red-500 mt-2">{formError}</div>
      )}
      <button
        className={`w-full py-2 sm:py-3 flex justify-center items-center rounded-full font-medium text-sm sm:text-lg text-base ${
          data.email.length > 0 && data.password.length > 0 && !submitting
            ? "bg-auth-btn-primary text-white cursor-pointer"
            : "bg-auth-btn-secondary"
        }`}
        style={{ fontFamily: poppins.style.fontFamily }}
        onClick={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        disabled={submitting}
      >
        {submitting ? "Logging in..." : "Log In"}
      </button>
    </div>
  );
}
