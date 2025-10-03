"use client";

import "@/Component Css/login.css";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);


  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email == "") {
      setError("All fields are required!");
    } else if (!emailRegex.test(email)) {
      setError("invalid email format!");
    } else if (password == "") {
      setError("All fields are required!");
    } else if (password.length < 8) {
      setError("password at least 8 characters!");
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
        setLoader(false)
      } else {
        setLoader(false);
        router.replace("/");
        window.scrollTo(0, 0);
        alert("login Successsfullty!");
      }
    }
  };

  return (
    <>
      <div className="loginBox">
        {/* <img className="user" src="https://i.ibb.co/yVGxFPR/2.png" height="100px" width="100px"/> */}
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
        <a href="#">
          Forget Password
          <br />{" "}
        </a>
        <div className="text-center">
          <Link href="/signup">
            <p className="text-success">
              <span>if you don&apos;t have an account! </span> Sign-Up
            </p>
          </Link>
        </div>
        <p className="text-danger text-center">{error}</p>
      </div>
    </>
  );
}
