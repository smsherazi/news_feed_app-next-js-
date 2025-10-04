"use client";

import "@/Component Css/profileDropdown.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { Poppins } from "next/font/google";
import toast from "react-hot-toast";
import { RiLockPasswordFill  } from "react-icons/ri";
import {
  MdOutlineLibraryBooks,
  MdPrivacyTip,
  MdEdit,
  MdLogout,
} from "react-icons/md";
import { GiNewspaper } from "react-icons/gi";
import { useRouter, usePathname } from "next/navigation";
import Modal from "./Modal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200"],
});

export default function ProfileDropdown({ userData, setUser, setLoader, setCloseCountryDropdown }) {
  const [firstChar, setFirstChar] = useState();
  const [bgColor, setBgColor] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  const bgColors = [
    "#e40505ff",
    "#9805c5ff",
    "#570080ff",
    "#701403ff",
    "#e66f01ff",
  ];

  useEffect(() => {
    if (userData?.name) {
      const char = userData.name.charAt(0).toUpperCase();
      const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
      setFirstChar(char);
      setBgColor(randomColor);
    }
  }, [userData.name, bgColors]);

  async function onSave(payload) {
    try {
      if (payload.oldPassword && payload.password) {
        const res = await fetch("/api/changePassword", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
          setUser((prev) => ({
            ...prev,
            password: payload.password,
          }));
          toast.success(data.message);
          setShowModal(null);
          setShowDropdown(null);
          setCloseCountryDropdown(false)
        } else {
          toast.error(data.message);
        }

        return;
      }

      const res = await fetch("/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setUser((prev) => ({
          ...prev,
          name: payload.name,
          email: payload.email,
        }));
        toast.success(data.message);
        setShowModal(null);
        setShowDropdown(null);
        setCloseCountryDropdown(false)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = () => {
    toast(
      (t) => (
        <span>
          Are you sure you want to Logout?
          <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                toast.promise(
                  fetch("/api/logout", { method: "POST" }).then(async (res) => {
                    const data = await res.json();
                    if (!data.success) throw new Error("Already Logout!");
                    return data;
                  }),
                  {
                    loading: "Logging out...",
                    success: (data) => {
                      if (pathname === "/") {
                        setUser(null);
                        setShowDropdown(null);
                        router.refresh();
                        setLoader(true);
                        return data.message;
                      } else {
                        router.push("/");
                      }
                    },
                    error: (err) => err.message || "Error while removing.",
                  }
                );
              }}
              style={{
                padding: "4px 10px",
                fontSize: "13px",
                background: "#2ecc71",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: "4px 10px",
                fontSize: "13px",
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              No
            </button>
          </div>
        </span>
      ),
      { duration: 6000 }
    );
  };

  return (
    <>
      <div className="profile">
      <div className="profileIcon " style={{ backgroundColor: bgColor }}>
        <h6>{firstChar}</h6>
        <span onClick={() => setShowDropdown(!showDropdown)}>
          <IoIosArrowDropdownCircle />
        </span>

        {showDropdown ? (
          <div className="dropdown">
            <div className={`dropdownLink ${poppins.className}`}>
              <button onClick={() => setShowModal("edit")}>
                Edit Profile <MdEdit />
              </button>
              <Link href={"/savednews"}>
                Library <MdOutlineLibraryBooks />
              </Link>
              <button onClick={() => setShowModal("password")}>
                Change Password
                <RiLockPasswordFill />
              </button>

              <div className="line"></div>

              <button onClick={handleLogout}>
                Logout <MdLogout />
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      </div>

      {showModal && (
        <Modal
          mode={showModal}
          user={userData}
          onSave={onSave}
          onClose={() => setShowModal(null)}
        />
      )}
    </>
  );
}
