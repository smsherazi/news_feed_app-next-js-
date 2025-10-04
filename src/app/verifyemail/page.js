"use client";

import "@/Component Css/login.css";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  
  const [error, setError] = useState("");

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const router = useRouter();

  const verifyEmail = async (e) => {
    e.preventDefault();

    if (email == "") {
      setError("email field are required!");
    } else if (!emailRegex.test(email)) {
      setError("invalid email format!");
     } else {
      setLoader(true);
      let verifyemail = await fetch("/api/verifyemail", {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      });
      verifyemail = await verifyemail.json();

      if (verifyemail.error) {
        setError(verifyemail.error);
        setLoader(false)
      } else {
        setLoader(false);
        router.replace(`/newpassword?userId=${verifyemail.user.userId}`);
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <>
      <div className="loginBox">
        {/* <img className="user" src="https://i.ibb.co/yVGxFPR/2.png" height="100px" width="100px"/> */}
        <h3 className="text-success">Verify Email</h3>
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
          </div>
          <button
            className="btn btn-success"
            type="submit"
            onClick={verifyEmail}
          >
            {loader ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              "verify"
            )}
          </button>
          
        </form>
         <p className="text-danger text-center">{error}</p>
      </div>
    </>
  );
}
