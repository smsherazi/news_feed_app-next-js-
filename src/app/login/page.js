"use client";

import "@/Component Css/login.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const router = useRouter();

  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");
    if (toastMessage) {
      toast.error(toastMessage, { duration: 4000 });
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "") {
      setError("All fields are required!");
    } else if (!emailRegex.test(email)) {
      setError("Invalid email format!");
    } else if (password === "") {
      setError("All fields are required!");
    } else if (password.length < 8) {
      setError("Password must be at least 8 characters!");
    } else {
      setLoader(true);
      let loginUser = await fetch("/api/loginuser", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });
      loginUser = await loginUser.json();

      if (loginUser.error) {
        setError(loginUser.error);
        setLoader(false);
      } else {
        setLoader(false);
        router.replace("/");
        window.scrollTo(0, 0);
        toast.success("Login Successful!");
      }
    }
  };

  return (
    <>
      <div className="loginBox">
        <h3 className="text-success">Sign in here</h3>
        <form method="post">
          <div className="inputBox">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
            <input
              id="pass"
              type="password"
              name="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>
          <button
            className="btn btn-success"
            type="submit"
            onClick={handleLogin}
          >
            {loader ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <Link href="/verifyemail">Forget Password</Link>
        <div className="text-center">
          <Link href="/signup">
            <p className="text-success">
              <span>If you don&apos;t have an account! </span> Sign-Up
            </p>
          </Link>
        </div>
        <p className="text-danger text-center">{error}</p>
      </div>
    </>
  );
}
