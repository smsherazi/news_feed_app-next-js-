"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ShowToast() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    if (message) {
      sessionStorage.setItem("toastMessage", message);
    }
    router.replace("/login"); // Redirect to login after setting message
  }, [message, router]);

  return null;
}
