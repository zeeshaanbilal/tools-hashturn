"use client";

import { poppins } from "@/theme/fonts";
import { isValidEmail } from "@/utils/validators";
import { useState } from "react";
import { signIn } from "next-auth/react";
import SignUpWithFacebook from "./buttons/SignUpWithFacebook";
import SignUpWithGoogle from "./buttons/SignUpWithGoogle";
import OrFormDivider from "./OrFormDivider";
import TextBox from "../ui/TextBox";
import axios from "axios";
import VerificationPopup from "./VerificationPopup";

export default function SignUpForm() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [verificationPopup, setVerificationPopup] = useState(false);

  const handleLogin = async () => {
    setFormError("");
    setPasswordError("");
    if (!isValidEmail(data.email)) {
      setErrors((prev) => ({ ...prev, email: "Not a valid email" }));
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    try {
      setSubmitting(true);
      const res = await axios.post("/api/auth/signup", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password,
      });
      if (res.status !== 200) {
        setFormError(res.data.error || "Failed to sign up");
        return;
      }
      setVerificationPopup(true);
    } catch (e) {
      setFormError((e as any).response.data.error || "Failed to sign up");
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
        Sign Up
      </h1>
      <div className="w-full flex flex-col gap-3">
        <SignUpWithFacebook />
        <SignUpWithGoogle />
      </div>
      <OrFormDivider />
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex gap-2">
          <TextBox
            name="firstName"
            label="First name"
            value={data.firstName}
            setValue={(text) => setData({ ...data, firstName: text })}
            type="text"
            error={errors.firstName}
            setError={(text) => setErrors({ ...errors, firstName: text })}
          />
          <TextBox
            name="lastName"
            label="Last name"
            value={data.lastName}
            setValue={(text) => setData({ ...data, lastName: text })}
            type="text"
            error={errors.lastName}
            setError={(text) => setErrors({ ...errors, lastName: text })}
          />
        </div>
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
          value={password}
          setValue={(text) => setPassword(text)}
          type="password"
          error={passwordError}
          setError={(text) => setPasswordError(text)}
        />
      </div>
      <div
        className="w-full flex justify-end items-center mt-1 mb-3"
        style={{ visibility: "hidden" }}
      >
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
          data.email.length > 0 &&
          data.firstName.length > 0 &&
          data.lastName.length > 0 &&
          password.length >= 8 &&
          !submitting
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
        {submitting ? "Creating account..." : "Sign up"}
      </button>
      {verificationPopup && <VerificationPopup open={verificationPopup} onClose={() => setVerificationPopup(false)} />}
    </div>
  );
}
