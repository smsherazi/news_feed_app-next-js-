"use client";

import "@/Component Css/login.css";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [Confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const router = useRouter();

  const updatePassword = async (e) => {
    e.preventDefault();

    if (password == "" || Confirmpassword == "") {
      setError("All fields are required!");
    } else if (password.length < 8) {
      setError("password at least 8 characters!");
    } else if(password !== Confirmpassword){
        setError(`password does not matched!`)
    }
    else {
      setLoader(true);
      let updatePassword = await fetch("/api/newpassword", {
        method: "PUT",
        body: JSON.stringify({
          password,
          userId
        }),
      });
      updatePassword = await updatePassword.json();

      if (updatePassword.error) {
        setError(updatePassword.error);
        setLoader(false)
      } else {
        setLoader(false);
        router.replace("/login");
        window.scrollTo(0, 0);
        toast.success('Password Update Successfully!');
      }
    }
  };

  return (
    <>
      <div className="loginBox">
        {/* <img className="user" src="https://i.ibb.co/yVGxFPR/2.png" height="100px" width="100px"/> */}
        <h3 className="text-success">New Password</h3>
        <form method="post">
          <div className="inputBox">
              <input
              name="userId"
              hidden
              value={userId || ""}
            />
            <input
              id="pass"
              type="password"
              name="Password"
              placeholder="New Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
             <input
              id="pass"
              type="password"
              name="Password"
              placeholder="Confirm New Password"
              value={Confirmpassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
            />
          </div>
          <button
            className="btn btn-success"
            type="submit"
            onClick={updatePassword}
          >
            {loader ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
        <p className="text-danger text-center">{error}</p>
      </div>
    </>
  );
}
