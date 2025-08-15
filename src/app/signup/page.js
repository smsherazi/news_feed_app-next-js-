"use client";

import "@/Component Css/signup.css";
import { method } from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const router = useRouter();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (name == "") {
      setError("All fields are required!");
    } else if (email == "") {
      setError("All fields are required!");
    } else if (!emailRegex.test(email)) {
      setError("Invalid email format!");
    } else if (password == "") {
      setError("All fields are required!");
    } else if (password.length <= 7) {
      setError("Password at least 8 characters!");
    } else {
      setLoader(true)
      let result = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      result = await result.json();
      if (result.error) {
        setError(result.error);
        setLoader(false)
      }
      else{
        router.push("/")
        window.scrollTo(0, 0);
        alert(result.message)
        setLoader(false)
      }
    }
  };

  return (
    <>
      <div className="signupBox">
        {/* <img className="user" src="https://i.ibb.co/yVGxFPR/2.png" height="100px" width="100px"/> */}
        <h3 className="text-success">Sign Up here</h3>
        <form method="post">
          <div className="inputBox">
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                const key = e.key;
                const cursorPosition = e.target.selectionStart;
                if (
                  (!/^[a-zA-Z\s]$/.test(key) &&
                    key !== "Backspace" &&
                    key !== "Tab" &&
                    key !== "ArrowLeft" &&
                    key !== "ArrowRight") ||
                  (key === " " && cursorPosition === 0)
                ) {
                  e.preventDefault();
                }
              }}
            />
            <input
              id="email"
              type="email"
              name="email"
              required
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
              required
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
            onClick={handleSignup}
          >
            {loader ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              "SignUp"
            )}
          </button>
        </form>
        <div className="text-center">
          <Link href="/login">
            <p className="text-success">
              <span>if you have an account!</span> Login
            </p>
          </Link>
        </div>
        <p className="text-danger text-center">{error}</p>
      </div>
    </>
  );
}
