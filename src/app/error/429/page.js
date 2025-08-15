"use client";

import Navbar from "@/Components/navbar";
import { useEffect, useState } from "react";


export default function Error429() {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {


    function update() {
      const now = new Date();
      const target = new Date();
      target.setHours(5, 0, 0, 0);
      if (now >= target) target.setDate(target.getDate() + 1);

      const diff = target - now;
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

      setCountdown(`${h}h ${m}m ${s}s`);
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  },[]);

  return (

    <>
    <div
      style={{
        textAlign: "center",
        padding: "4rem 2rem",
        color: "#fff",
        background: "#02010a",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "6rem", marginBottom: "0.5rem" }} className="text-success">429</h1>
      <h2 style={{ marginBottom: "1rem" }}>Too Many Requests</h2>
      <p style={{ maxWidth: "500px", lineHeight: "1.6" }}>
        You&apos;ve made too many requests in a short period. <br />
        Please wait a while before trying again. <br />
        We&apos;re protecting the service for everyone.
      </p>
      <p
        style={{
          marginTop: "2rem",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
        className="text-success"
      >
        Try again in: {countdown}
      </p>
    </div>
    </>
  );
}
